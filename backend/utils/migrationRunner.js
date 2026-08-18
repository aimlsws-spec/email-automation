'use strict';

const fs = require('fs');
const path = require('path');
const pool = require('../db');

/**
 * Splits SQL script contents into individual queries, ignoring comments
 * and empty statements.
 */
function splitSqlStatements(content) {
  const lines = content.split('\n');
  const statements = [];
  let currentStatement = '';

  for (let line of lines) {
    line = line.trim();
    // Skip empty lines and comments
    if (!line || line.startsWith('--') || line.startsWith('/*')) {
      continue;
    }

    // Strip trailing inline "-- comment" text so it doesn't get glued to the
    // next line when statements are joined with a space below — otherwise
    // MySQL treats everything after "--" as part of one unterminated comment,
    // swallowing the rest of the statement.
    line = line.replace(/\s+--.*$/, '').trim();
    if (!line) continue;

    currentStatement += ' ' + line;

    if (line.endsWith(';')) {
      statements.push(currentStatement.trim());
      currentStatement = '';
    }
  }

  if (currentStatement.trim()) {
    statements.push(currentStatement.trim());
  }

  return statements;
}

async function runMigrations() {
  console.log('[MIGRATION_RUNNER] Starting database migrations check...');
  
  // 1. Ensure the _migrations tracking table exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      run_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // 2. Read and sort all sql files in migrations/ folder
  const migrationsDir = path.join(__dirname, '..', 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    console.log('[MIGRATION_RUNNER] No migrations folder found, skipping.');
    return;
  }

  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log(`[MIGRATION_RUNNER] Found ${files.length} migration file(s).`);

  // 3. Execute outstanding migrations
  for (const file of files) {
    const { rows } = await pool.query('SELECT id FROM _migrations WHERE name = ? LIMIT 1', [file]);
    if (rows.length > 0) {
      // Already run, skip
      continue;
    }

    console.log(`[MIGRATION_RUNNER] Running migration: ${file}`);
    const filePath = path.join(migrationsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const statements = splitSqlStatements(content);

    for (const sql of statements) {
      if (!sql) continue;
      try {
        await pool.query(sql);
      } catch (err) {
        // Silence expected errors for idempotent migrations:
        // - 1050: Table already exists
        // - 1060: Duplicate column name
        // - 1061: Duplicate key name
        // - 1091: Can't drop column/key; doesn't exist
        const errno = err.errno || err.code;
        if (errno === 1050 || errno === 1060 || errno === 1061 || errno === 1091) {
          // console.log(`[MIGRATION_RUNNER] Silenced expected error (${errno}) for query: ${sql.slice(0, 100)}...`);
        } else {
          console.error(`[MIGRATION_RUNNER] Error executing query in ${file}:`, err.message);
          console.error(`[MIGRATION_RUNNER] Failed SQL statement:`, sql);
          throw err; // Halt migrations on unexpected error
        }
      }
    }

    await pool.query('INSERT INTO _migrations (name) VALUES (?)', [file]);
    console.log(`[MIGRATION_RUNNER] ✓ Migration ${file} complete`);
  }

  console.log('[MIGRATION_RUNNER] All migrations check complete.');
}

module.exports = { runMigrations };
