const express = require('express');
const router  = express.Router();
const pool    = require('../db');

// Create table if it doesn't exist at all.
pool.query(`
  CREATE TABLE IF NOT EXISTS followup_templates (
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    campaign_template_id INT NOT NULL DEFAULT 0,
    sender_account_id    INT DEFAULT NULL,
    followup_stage       INT NOT NULL DEFAULT 1,
    delay_value          INT NOT NULL DEFAULT 1,
    delay_unit           VARCHAR(10) NOT NULL DEFAULT 'days',
    subject              VARCHAR(500) NULL,
    body                 LONGTEXT NULL,
    created_at           DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at           DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_ft_template_stage (campaign_template_id, followup_stage)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`).catch(() => {});

// Idempotent column migrations — handle the case where the table was previously
// created by an older migration that used different column names (name/content).
// Each ALTER silently no-ops (errno 1060) if the column already exists.
pool.query(`ALTER TABLE followup_templates ADD COLUMN campaign_template_id INT NOT NULL DEFAULT 0`).catch(() => {});
pool.query(`ALTER TABLE followup_templates ADD COLUMN sender_account_id INT DEFAULT NULL`).catch(() => {});
pool.query(`ALTER TABLE followup_templates ADD COLUMN followup_stage INT NOT NULL DEFAULT 1`).catch(() => {});
pool.query(`ALTER TABLE followup_templates ADD COLUMN delay_value INT NOT NULL DEFAULT 1`).catch(() => {});
pool.query(`ALTER TABLE followup_templates ADD COLUMN delay_unit VARCHAR(10) NOT NULL DEFAULT 'days'`).catch(() => {});
pool.query(`ALTER TABLE followup_templates ADD COLUMN body LONGTEXT NULL`).catch(() => {});
pool.query(`ALTER TABLE followup_templates ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`).catch(() => {});
pool.query(`ALTER TABLE followup_templates ADD UNIQUE KEY uniq_ft_template_stage (campaign_template_id, followup_stage)`).catch(() => {});
// Relax legacy NOT NULL constraints that block our INSERTs
pool.query(`ALTER TABLE followup_templates MODIFY COLUMN name VARCHAR(255) NULL DEFAULT NULL`).catch(() => {});
pool.query(`ALTER TABLE followup_templates MODIFY COLUMN content LONGTEXT NULL`).catch(() => {});

pool.query(`
  CREATE TABLE IF NOT EXISTS followup_queue (
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    lead_email           VARCHAR(255) NOT NULL,
    campaign_id          INT NOT NULL,
    campaign_template_id INT NOT NULL,
    followup_template_id INT NOT NULL,
    followup_stage       INT NOT NULL,
    scheduled_at         DATETIME NOT NULL,
    status               VARCHAR(50) NOT NULL DEFAULT 'pending',
    stopped_reason       VARCHAR(255),
    sent_at              DATETIME,
    created_at           DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_fq_lead_campaign_stage (lead_email(191), campaign_id, followup_stage)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`).catch(() => {});

pool.query(`ALTER TABLE campaigns ADD COLUMN initial_template_id INT DEFAULT NULL`).catch(() => {});

// ---------------------------------------------------------------------------
// All handlers use RELATIVE paths.
// This router is mounted at /api/followup-templates in server.js, so:
//   router.get('/')     → GET  /api/followup-templates
//   router.post('/')    → POST /api/followup-templates
//   router.put('/:id')  → PUT  /api/followup-templates/:id
//   router.delete('/:id')→ DELETE /api/followup-templates/:id
// ---------------------------------------------------------------------------

// GET /api/followup-templates?campaign_template_id=X
router.get('/', async (req, res) => {
  const { campaign_template_id } = req.query;
  if (!campaign_template_id) {
    return res.status(400).json({ success: false, error: 'campaign_template_id query param required' });
  }
  try {
    const { rows } = await pool.query(
      `SELECT * FROM followup_templates
       WHERE campaign_template_id = ?
       ORDER BY followup_stage ASC`,
      [campaign_template_id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('[GET /api/followup-templates]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/followup-templates
router.post('/', async (req, res) => {
  const { campaign_template_id, sender_account_id, followup_stage, delay_value, delay_unit, subject, body } = req.body;

  if (!campaign_template_id || !followup_stage || !subject || !body) {
    return res.status(400).json({ success: false, error: 'campaign_template_id, followup_stage, subject, body required' });
  }
  if (followup_stage < 1 || followup_stage > 10) {
    return res.status(400).json({ success: false, error: 'followup_stage must be 1–10' });
  }

  try {
    await pool.query(
      `INSERT INTO followup_templates
         (campaign_template_id, sender_account_id, followup_stage, delay_value, delay_unit, subject, body)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         sender_account_id = VALUES(sender_account_id),
         delay_value       = VALUES(delay_value),
         delay_unit        = VALUES(delay_unit),
         subject           = VALUES(subject),
         body              = VALUES(body),
         updated_at        = NOW()`,
      [
        campaign_template_id,
        sender_account_id || null,
        followup_stage,
        delay_value != null ? delay_value : 1,
        delay_unit  || 'days',
        subject,
        body,
      ]
    );

    const { rows } = await pool.query(
      `SELECT * FROM followup_templates
       WHERE campaign_template_id = ? AND followup_stage = ? LIMIT 1`,
      [campaign_template_id, followup_stage]
    );
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('[POST /api/followup-templates]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/followup-templates/:id
router.put('/:id', async (req, res) => {
  const { delay_value, delay_unit, subject, body } = req.body;
  if (!subject || !body) {
    return res.status(400).json({ success: false, error: 'subject and body required' });
  }
  try {
    const { rowCount } = await pool.query(
      `UPDATE followup_templates
       SET delay_value = ?, delay_unit = ?, subject = ?, body = ?, updated_at = NOW()
       WHERE id = ?`,
      [delay_value != null ? delay_value : 1, delay_unit || 'days', subject, body, req.params.id]
    );
    if (!rowCount) return res.status(404).json({ success: false, error: 'Follow-up template not found' });
    const { rows } = await pool.query(`SELECT * FROM followup_templates WHERE id = ?`, [req.params.id]);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('[PUT /api/followup-templates/:id]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/followup-templates/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query(`DELETE FROM followup_templates WHERE id = ?`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/followup-templates/:id]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
