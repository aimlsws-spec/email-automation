const pool = require('../db');

async function ensureSystemSettings() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS system_settings (
      \`key\`       VARCHAR(100) NOT NULL PRIMARY KEY,
      \`value\`     VARCHAR(255) NOT NULL DEFAULT '1',
      updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `).catch(() => {});
  await pool.query(`
    INSERT IGNORE INTO system_settings (\`key\`, \`value\`) VALUES ('followup_automation_enabled', '1')
  `).catch(() => {});
}

async function getAutomationEnabled() {
  await ensureSystemSettings();
  const { rows } = await pool.query(
    `SELECT \`value\` FROM system_settings WHERE \`key\` = 'followup_automation_enabled' LIMIT 1`
  );
  return rows[0]?.value !== '0';
}

async function setAutomationEnabled(flag) {
  await ensureSystemSettings();
  await pool.query(
    `INSERT INTO system_settings (\`key\`, \`value\`) VALUES ('followup_automation_enabled', ?)
     ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`), updated_at = NOW()`,
    [flag ? '1' : '0']
  );
}

module.exports = { ensureSystemSettings, getAutomationEnabled, setAutomationEnabled };
