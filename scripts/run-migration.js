const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

function getConfig() {
  if (process.env.SUPABASE_DB_URL) {
    return {
      connectionString: process.env.SUPABASE_DB_URL,
      ssl: { rejectUnauthorized: false },
    };
  }

  if (
    process.env.SUPABASE_DB_HOST &&
    process.env.SUPABASE_DB_USER &&
    process.env.SUPABASE_DB_PASSWORD
  ) {
    return {
      host: process.env.SUPABASE_DB_HOST,
      port: Number(process.env.SUPABASE_DB_PORT || "5432"),
      user: process.env.SUPABASE_DB_USER,
      password: process.env.SUPABASE_DB_PASSWORD,
      database: process.env.SUPABASE_DB_NAME || "postgres",
      ssl: { rejectUnauthorized: false },
    };
  }

  return null;
}

async function tryConnect(config) {
  const client = new Client(config);
  try {
    await client.connect();
    await client.query("SELECT 1 as test");
    console.log("[BASARILI] Veritabani baglantisi kuruldu");
    return client;
  } catch (err) {
    console.log(`[BASARISIZ] ${err.message}`);
    try { await client.end(); } catch {}
    return null;
  }
}

async function run() {
  console.log("Veritabani baglantisi deneniyor...\n");

  const config = getConfig();
  if (!config) {
    console.log("Eksik ortam degiskenleri bulundu.");
    console.log("SUPABASE_DB_URL veya SUPABASE_DB_HOST / USER / PASSWORD degerlerini tanimlayin.");
    return;
  }

  const client = await tryConnect(config);
  if (!client) {
    console.log("\nBaglanti kurulamadigi icin SQL dosyalari calistirilamadi.");
    return;
  }

  console.log("\nBaglanti kuruldu. SQL calistiriliyor...\n");

  try {
    console.log("=== Migration calistiriliyor ===");
    const migrationSql = fs.readFileSync(
      path.join(__dirname, "..", "supabase", "migrations", "001_initial_schema.sql"),
      "utf-8"
    );
    await client.query(migrationSql);
    console.log("Migration basarili!\n");

    console.log("=== Seed data yukleniyor ===");
    const seedSql = fs.readFileSync(
      path.join(__dirname, "..", "supabase", "seed.sql"),
      "utf-8"
    );
    await client.query(seedSql);
    console.log("Seed data basarili!\n");

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
