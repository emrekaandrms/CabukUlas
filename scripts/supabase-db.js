const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const envFiles = [".env.supabase.local", ".env.local", ".env"];

function parseEnvValue(rawValue) {
  const value = rawValue.trim();
  if (!value) {
    return "";
  }

  const quote = value[0];
  if ((quote === '"' || quote === "'") && value[value.length - 1] === quote) {
    return value.slice(1, -1);
  }

  return value;
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = parseEnvValue(trimmed.slice(separatorIndex + 1));

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function loadEnv() {
  for (const fileName of envFiles) {
    loadEnvFile(path.join(projectRoot, fileName));
  }
}

function getConnectionConfig() {
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

function printMissingEnvHelp() {
  console.log("Supabase veritabani baglantisi bulunamadi.");
  console.log("`.env.supabase.local` dosyasini olusturup asagidakilerden birini tanimlayin:");
  console.log("- SUPABASE_DB_URL=postgresql://postgres:...@db.<project-ref>.supabase.co:5432/postgres");
  console.log("- veya SUPABASE_DB_HOST / SUPABASE_DB_PORT / SUPABASE_DB_USER / SUPABASE_DB_PASSWORD / SUPABASE_DB_NAME");
}

function printUsage() {
  console.log("Kullanim:");
  console.log("  npm run supabase:ping");
  console.log('  npm run supabase:sql -- "select now();"');
  console.log("  npm run supabase:file -- supabase/migrations/006_operational_foundation.sql");
  console.log("  npm run supabase:apply -- supabase/migrations/006_operational_foundation.sql supabase/migrations/007_admin_analytics_surface.sql");
  console.log("");
  console.log("Not:");
  console.log("- Ortam degiskenleri sirasiyla `.env.supabase.local`, `.env.local`, `.env` dosyalarindan yuklenir.");
  console.log("- Yikici SQL desenleri algilanirsa komut durdurulur; bilerek calistiracaksaniz `--force` ekleyin.");
}

function parseCliArgs(argv) {
  const force = argv.includes("--force");
  const args = argv.filter((arg) => arg !== "--force");
  return { force, args };
}

function resolveProjectPath(inputPath) {
  return path.isAbsolute(inputPath)
    ? inputPath
    : path.resolve(projectRoot, inputPath);
}

function readSqlFile(inputPath) {
  const absolutePath = resolveProjectPath(inputPath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`SQL dosyasi bulunamadi: ${inputPath}`);
  }

  return {
    absolutePath,
    sql: fs.readFileSync(absolutePath, "utf8"),
  };
}

function isPotentiallyDestructive(sql) {
  const lowerSql = sql.toLowerCase();
  const patterns = [
    /\bdrop\s+table\b/,
    /\bdrop\s+schema\b/,
    /\btruncate\b/,
    /\bdelete\s+from\b/,
    /\balter\s+table\b[\s\S]{0,200}\bdrop\s+column\b/,
  ];

  return patterns.some((pattern) => pattern.test(lowerSql));
}

function printQueryResult(result) {
  if (result.rows && result.rows.length > 0) {
    console.table(result.rows);
    console.log(`${result.rows.length} satir gosterildi.`);
    return;
  }

  console.log(`${result.rowCount || 0} satir etkilendi.`);
}

async function withClient(work) {
  const config = getConnectionConfig();
  if (!config) {
    printMissingEnvHelp();
    process.exitCode = 1;
    return;
  }

  const client = new Client(config);

  try {
    await client.connect();
    await work(client);
  } finally {
    await client.end();
  }
}

async function runPing() {
  await withClient(async (client) => {
    const result = await client.query("select now() as server_time, current_database() as db_name");
    printQueryResult(result);
  });
}

async function runSql(queryText) {
  if (!queryText.trim()) {
    throw new Error("SQL metni bos olamaz.");
  }

  await withClient(async (client) => {
    const result = await client.query(queryText);
    printQueryResult(result);
  });
}

async function runSqlFile(inputPath, force) {
  const { absolutePath, sql } = readSqlFile(inputPath);

  if (!force && isPotentiallyDestructive(sql)) {
    throw new Error(
      `Potansiyel olarak yikici SQL algilandi: ${path.relative(projectRoot, absolutePath)}. Bilerek calistiriyorsaniz komuta --force ekleyin.`
    );
  }

  await withClient(async (client) => {
    console.log(`Calistiriliyor: ${path.relative(projectRoot, absolutePath)}`);
    const result = await client.query(sql);
    printQueryResult(result);
  });
}

async function runApply(pathsToApply, force) {
  if (pathsToApply.length === 0) {
    throw new Error("En az bir SQL dosyasi vermelisiniz.");
  }

  const files = pathsToApply.map(readSqlFile);

  if (!force) {
    const destructiveFile = files.find((file) => isPotentiallyDestructive(file.sql));
    if (destructiveFile) {
      throw new Error(
        `Potansiyel olarak yikici SQL algilandi: ${path.relative(projectRoot, destructiveFile.absolutePath)}. Bilerek calistiriyorsaniz komuta --force ekleyin.`
      );
    }
  }

  await withClient(async (client) => {
    for (const file of files) {
      console.log(`Calistiriliyor: ${path.relative(projectRoot, file.absolutePath)}`);
      const result = await client.query(file.sql);
      printQueryResult(result);
      console.log("");
    }
  });
}

async function main() {
  loadEnv();

  const [command, ...rawArgs] = process.argv.slice(2);
  const { force, args } = parseCliArgs(rawArgs);

  try {
    switch (command) {
      case "ping":
        await runPing();
        break;
      case "sql":
        await runSql(args.join(" "));
        break;
      case "file":
        if (!args[0]) {
          throw new Error("Bir SQL dosya yolu vermelisiniz.");
        }
        await runSqlFile(args[0], force);
        break;
      case "apply":
        await runApply(args, force);
        break;
      case "help":
      case "--help":
      case "-h":
      case undefined:
        printUsage();
        break;
      default:
        throw new Error(`Bilinmeyen komut: ${command}`);
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

main();
