const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

async function main() {
  const { rows } = await pool.query(
    "SELECT tablename FROM pg_tables WHERE schemaname = $1",
    ["public"],
  );

  if (rows.length === 0) {
    console.log("No public tables found.");
    return;
  }

  const tables = rows
    .map((row) => `"public"."${row.tablename.replace(/"/g, '""')}"`)
    .join(", ");

  await pool.query(`TRUNCATE TABLE ${tables} RESTART IDENTITY CASCADE`);
  console.log(`Truncated tables: ${rows.map((row) => row.tablename).join(", ")}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
