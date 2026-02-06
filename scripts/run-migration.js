const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

// Farkli baglanti yontemlerini dene
const configs = [
  {
    name: "Direct IPv4 - sifre parantezli",
    host: "db.bqftvnvvbzprkkiqtmlj.supabase.co",
    port: 5432,
    user: "postgres",
    password: "[Ekdgunal.25271107]",
    database: "postgres",
    ssl: { rejectUnauthorized: false },
    family: 4,
  },
  {
    name: "Direct IPv4 - sifre parantezsiz",
    host: "db.bqftvnvvbzprkkiqtmlj.supabase.co",
    port: 5432,
    user: "postgres",
    password: "Ekdgunal.25271107",
    database: "postgres",
    ssl: { rejectUnauthorized: false },
    family: 4,
  },
  {
    name: "Pooler eu-central-1 - sifre parantezli",
    host: "aws-0-eu-central-1.pooler.supabase.com",
    port: 6543,
    user: "postgres.bqftvnvvbzprkkiqtmlj",
    password: "[Ekdgunal.25271107]",
    database: "postgres",
    ssl: { rejectUnauthorized: false },
  },
  {
    name: "Pooler eu-central-1 - sifre parantezsiz",
    host: "aws-0-eu-central-1.pooler.supabase.com",
    port: 6543,
    user: "postgres.bqftvnvvbzprkkiqtmlj",
    password: "Ekdgunal.25271107",
    database: "postgres",
    ssl: { rejectUnauthorized: false },
  },
];

async function tryConnect(config) {
  const { name, ...pgConfig } = config;
  const client = new Client(pgConfig);
  try {
    await client.connect();
    const res = await client.query("SELECT 1 as test");
    console.log(`[BASARILI] ${name}`);
    return { client, name };
  } catch (err) {
    console.log(`[BASARISIZ] ${name} -> ${err.message}`);
    try { await client.end(); } catch {}
    return null;
  }
}

async function run() {
  console.log("Baglanti yontemlerini deniyorum...\n");

  let connected = null;
  for (const config of configs) {
    connected = await tryConnect(config);
    if (connected) break;
  }

  if (!connected) {
    console.log("\nHicbir baglanti yontemi calismadi.");
    console.log("Supabase Dashboard > SQL Editor'den manuel olarak calistirin:");
    console.log("1. supabase/migrations/001_initial_schema.sql");
    console.log("2. supabase/seed.sql");
    return;
  }

  const { client, name } = connected;
  console.log(`\n${name} ile baglanti kuruldu. SQL calistiriliyor...\n`);

  try {
    // 1. Migration
    console.log("=== Migration calistiriliyor ===");
    const migrationSql = fs.readFileSync(
      path.join(__dirname, "..", "supabase", "migrations", "001_initial_schema.sql"),
      "utf-8"
    );
    await client.query(migrationSql);
    console.log("Migration basarili!\n");

    // 2. Seed data
    console.log("=== Seed data yukleniyor ===");
    const seedSql = fs.readFileSync(
      path.join(__dirname, "..", "supabase", "seed.sql"),
      "utf-8"
    );
    await client.query(seedSql);
    console.log("Seed data basarili!\n");

    // 3. Dogrulama
    const catResult = await client.query("SELECT COUNT(*) FROM categories");
    const compResult = await client.query("SELECT COUNT(*) FROM companies");
    const chanResult = await client.query("SELECT COUNT(*) FROM contact_channels");

    console.log("=== Dogrulama ===");
    console.log(`Kategoriler: ${catResult.rows[0].count}`);
    console.log(`Firmalar: ${compResult.rows[0].count}`);
    console.log(`Iletisim Kanallari: ${chanResult.rows[0].count}`);
    console.log("\nTum islemler basarili!");
  } catch (err) {
    console.error("SQL HATASI:", err.message);
  } finally {
    await client.end();
  }
}

run();
