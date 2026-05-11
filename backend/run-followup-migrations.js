/**
 * Run follow-up system migrations
 * Usage: node run-followup-migrations.js
 */

const pool = require('./db');
const fs   = require('fs');
const path = require('path');

async function runMigrations() {
  console.log('Running automated follow-up migrations...\n');

  // ── 1. Schema changes ────────────────────────────────────────────────────
  const schemaSql = [
    // followup_logs table
    `CREATE TABLE IF NOT EXISTS followup_logs (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      lead_email     VARCHAR(255) NOT NULL,
      campaign_id    INT,
      followup_stage INT NOT NULL,
      template_used  VARCHAR(500),
      status         VARCHAR(50) DEFAULT 'sent',
      message_id     TEXT,
      thread_id      TEXT,
      sent_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
      stopped_reason VARCHAR(255),
      INDEX idx_lead (lead_email),
      INDEX idx_campaign (campaign_id),
      INDEX idx_stage (followup_stage),
      INDEX idx_sent_at (sent_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // suppression_list table
    `CREATE TABLE IF NOT EXISTS suppression_list (
      email       VARCHAR(255) NOT NULL PRIMARY KEY,
      reason      VARCHAR(100) DEFAULT 'unsubscribe',
      campaign_id INT,
      added_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip_address  VARCHAR(100),
      user_agent  TEXT,
      INDEX idx_reason (reason)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // leads columns
    `ALTER TABLE leads ADD COLUMN followup_enabled TINYINT(1) DEFAULT 1`,
    `ALTER TABLE leads ADD COLUMN followup_stopped_reason VARCHAR(255)`,
    `ALTER TABLE leads ADD COLUMN unsubscribed TINYINT(1) DEFAULT 0`,
    `ALTER TABLE leads ADD COLUMN unsubscribed_at DATETIME`,

    // campaigns columns
    `ALTER TABLE campaigns ADD COLUMN followup_enabled TINYINT(1) DEFAULT 1`,
    `ALTER TABLE campaigns ADD COLUMN initial_template_id INT`,
    `ALTER TABLE campaigns ADD COLUMN followup_template_1_id INT`,
    `ALTER TABLE campaigns ADD COLUMN followup_template_2_id INT`,

    // Backfill replied leads
    `UPDATE leads SET followup_enabled = 0, followup_stopped_reason = 'replied'
     WHERE has_replied = 1 AND (followup_enabled IS NULL OR followup_enabled = 1)`,

    // Backfill bounced leads
    `UPDATE leads SET followup_enabled = 0, followup_stopped_reason = 'bounced'
     WHERE is_bounced = 1 AND (followup_enabled IS NULL OR followup_enabled = 1)`,
  ];

  for (const sql of schemaSql) {
    const label = sql.trim().slice(0, 60).replace(/\n/g, ' ');
    try {
      await pool.query(sql);
      console.log(`  ✅ ${label}...`);
    } catch (err) {
      // 1060 = duplicate column, 1061 = duplicate index — safe to ignore
      if (err.errno === 1060 || err.errno === 1061) {
        console.log(`  ⏭  Already exists: ${label.slice(0, 40)}...`);
      } else {
        console.error(`  ❌ FAILED: ${label}`);
        console.error(`     ${err.message}`);
      }
    }
  }

  // ── 2. Insert follow-up templates ────────────────────────────────────────
  console.log('\nInserting follow-up templates...');

  const template1Html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:20px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
        <tr><td style="padding:40px 30px;">
          <p style="font-size:16px;line-height:1.6;color:#333;margin:0 0 20px;">Hi {{name}},</p>
          <p style="font-size:16px;line-height:1.6;color:#333;margin:0 0 20px;">
            I wanted to follow up on my previous email about how we can help {{company}} with IT solutions.
          </p>
          <p style="font-size:16px;line-height:1.6;color:#333;margin:0 0 20px;">We specialize in:</p>
          <ul style="font-size:16px;line-height:1.8;color:#333;margin:0 0 20px;padding-left:20px;">
            <li>Custom software development</li>
            <li>Cloud infrastructure setup</li>
            <li>Mobile app development</li>
            <li>IT consulting and support</li>
          </ul>
          <p style="font-size:16px;line-height:1.6;color:#333;margin:0 0 20px;">
            Would you be available for a quick 15-minute call this week?
          </p>
          <p style="font-size:16px;line-height:1.6;color:#333;margin:0 0 20px;">
            Best regards,<br>{{agentName}}
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:30px 0;">
          <p style="font-size:12px;color:#999;margin:0;">
            <a href="http://localhost:4000/api/unsubscribe?email={{unsubscribe}}" style="color:#999;">Unsubscribe</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const template2Html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:20px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
        <tr><td style="padding:40px 30px;">
          <p style="font-size:16px;line-height:1.6;color:#333;margin:0 0 20px;">Hi {{name}},</p>
          <p style="font-size:16px;line-height:1.6;color:#333;margin:0 0 20px;">
            Just checking in again regarding our IT services for {{company}}.
          </p>
          <p style="font-size:16px;line-height:1.6;color:#333;margin:0 0 20px;">We have helped companies like yours:</p>
          <ul style="font-size:16px;line-height:1.8;color:#333;margin:0 0 20px;padding-left:20px;">
            <li>Reduce IT costs by 30-40%</li>
            <li>Improve system uptime to 99.9%</li>
            <li>Accelerate digital transformation</li>
            <li>Scale infrastructure seamlessly</li>
          </ul>
          <p style="font-size:16px;line-height:1.6;color:#333;margin:0 0 20px;">
            Are you open to a brief conversation?
          </p>
          <p style="font-size:16px;line-height:1.6;color:#333;margin:0 0 20px;">
            Thanks,<br>{{agentName}}
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:30px 0;">
          <p style="font-size:12px;color:#999;margin:0;">
            <a href="http://localhost:4000/api/unsubscribe?email={{unsubscribe}}" style="color:#999;">Unsubscribe</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const templates = [
    { name: 'FOLLOW UP (VIRALKAR)',   html: template1Html },
    { name: 'FOLLOW UP 2 (VIRALKAR)', html: template2Html },
  ];

  for (const t of templates) {
    try {
      await pool.query(
        `INSERT INTO email_templates (name, html_content, created_at, updated_at)
         VALUES (?, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE html_content = VALUES(html_content), updated_at = NOW()`,
        [t.name, t.html]
      );
      console.log(`  ✅ Template: "${t.name}"`);
    } catch (err) {
      console.error(`  ❌ Template insert failed: ${t.name} — ${err.message}`);
    }
  }

  // ── 3. Verify ────────────────────────────────────────────────────────────
  console.log('\nVerification:');
  const { rows: templates_check } = await pool.query(
    `SELECT id, name, updated_at FROM email_templates WHERE name LIKE '%VIRALKAR%'`
  );
  if (templates_check.length === 2) {
    templates_check.forEach(t => console.log(`  ✅ id=${t.id}  name="${t.name}"`));
  } else {
    console.warn(`  ⚠️  Expected 2 templates, found ${templates_check.length}`);
  }

  const { rows: cols } = await pool.query(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'leads'
     AND COLUMN_NAME IN ('followup_enabled','followup_stopped_reason','unsubscribed')`
  );
  console.log(`  ✅ leads columns added: ${cols.map(c => c.COLUMN_NAME).join(', ')}`);

  const { rows: logs } = await pool.query(
    `SELECT COUNT(*) AS cnt FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'followup_logs'`
  );
  console.log(`  ✅ followup_logs table: ${logs[0].cnt > 0 ? 'exists' : 'MISSING'}`);

  const { rows: supp } = await pool.query(
    `SELECT COUNT(*) AS cnt FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'suppression_list'`
  );
  console.log(`  ✅ suppression_list table: ${supp[0].cnt > 0 ? 'exists' : 'MISSING'}`);

  console.log('\n✅ All migrations complete. Restart the server now.\n');
  process.exit(0);
}

runMigrations().catch(err => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
