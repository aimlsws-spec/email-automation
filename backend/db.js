const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env'), override: false });

// ─── MySQL connection pool ────────────────────────────────────────────────────
const _pool = mysql.createPool({
  host:               process.env.DB_HOST     || '127.0.0.1',
  port:               parseInt(process.env.DB_PORT) || 3306,
  database:           process.env.DB_NAME     || 'automate_mail',
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  connectTimeout:     15000,
  charset:            'utf8mb4',
  // Auto-parse JSON columns stored as TEXT/JSON
  typeCast(field, next) {
    if (field.type === 'JSON' || field.type === 'BLOB') {
      const val = field.string('utf8');
      if (val === null) return null;
      try { return JSON.parse(val); } catch { return val; }
    }
    return next();
  },
});

_pool.on('error', (err) => {
  console.error('❌ Unexpected MySQL pool error:', err.message);
});

// ─── pg-compatible wrapper ────────────────────────────────────────────────────
// The rest of the codebase uses pool.query(sql, params) and expects { rows }
// MySQL uses ? placeholders; pg uses $1,$2 — we translate here.

function pgToMysql(sql) {
  // Replace $1, $2, ... with ?
  return sql.replace(/\$\d+/g, '?');
}

const pool = {
  // Standard query — returns { rows, rowCount, insertId }
  query: async (sql, params) => {
    const mysqlSql = pgToMysql(sql);
    try {
      const [result] = await _pool.query(mysqlSql, params || []);
      const rows     = Array.isArray(result) ? result : [];
      const rowCount = result.affectedRows ?? rows.length;
      const insertId = result.insertId ?? null;
      return { rows, rowCount, insertId };
    } catch (err) {
      // Silence expected schema migration warnings (duplicate column/index)
      if (err.errno !== 1060 && err.errno !== 1061) {
        console.error('[DB] Query error:', err.message);
        console.error('[DB] SQL:', sql.slice(0, 300));
      }
      throw err;
    }
  },

  // Transaction-capable client (mirrors pg pool.connect())
  connect: async () => {
    const conn = await _pool.getConnection();
    let inTransaction = false;
    return {
      query: async (sql, params) => {
        if (sql.trim().toUpperCase() === 'BEGIN') {
          await conn.beginTransaction();
          inTransaction = true;
          return { rows: [], rowCount: 0 };
        }
        if (sql.trim().toUpperCase() === 'COMMIT') {
          await conn.commit();
          inTransaction = false;
          return { rows: [], rowCount: 0 };
        }
        if (sql.trim().toUpperCase() === 'ROLLBACK') {
          await conn.rollback();
          inTransaction = false;
          return { rows: [], rowCount: 0 };
        }
        const mysqlSql = pgToMysql(sql);
        const [result] = await conn.query(mysqlSql, params || []);
        const rows     = Array.isArray(result) ? result : [];
        const rowCount = result.affectedRows ?? rows.length;
        const insertId = result.insertId ?? null;
        return { rows, rowCount, insertId };
      },
      release: () => conn.release(),
    };
  },

  on: (event, cb) => _pool.on(event, cb),
};

// ─── Startup connection test ──────────────────────────────────────────────────
(async () => {
  try {
    const conn = await _pool.getConnection();
    console.log('✅ MySQL connected successfully');
    console.log('   Database:', process.env.DB_NAME);
    console.log('   Host:    ', process.env.DB_HOST);
    conn.release();

    const [rows] = await _pool.query('SELECT COUNT(*) AS count FROM leads');
    const count = rows[0]?.count ?? 0;
    console.log('✅ Leads table exists. Row count:', count);
    if (count === 0) console.log('⚠️  Table is empty. Import leads via /api/upload-leads');
  } catch (err) {
    console.error('❌ MySQL connection error:', err.message);
    console.log('\n💡 Check .env:');
    console.log('   DB_HOST:', process.env.DB_HOST);
    console.log('   DB_PORT:', process.env.DB_PORT);
    console.log('   DB_NAME:', process.env.DB_NAME);
    console.log('   DB_USER:', process.env.DB_USER);
  }
})();

module.exports = pool;
