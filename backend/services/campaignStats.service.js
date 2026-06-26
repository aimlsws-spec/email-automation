const pool = require('../db');

async function ensureCampaignStatsColumns() {
  await pool.query(`ALTER TABLE campaigns ADD COLUMN total_leads INT DEFAULT 0`).catch(() => {});
  await pool.query(`ALTER TABLE campaigns ADD COLUMN sent_count INT DEFAULT 0`).catch(() => {});
  await pool.query(`ALTER TABLE campaigns ADD COLUMN pending_count INT DEFAULT 0`).catch(() => {});
  await pool.query(`ALTER TABLE campaigns ADD COLUMN failed_count INT DEFAULT 0`).catch(() => {});
  await pool.query(`ALTER TABLE campaigns ADD COLUMN active_sender VARCHAR(255)`).catch(() => {});
}

function sentStatusSql(alias = '') {
  const p = alias ? `${alias}.` : '';
  return `(
    LOWER(COALESCE(${p}status, '')) IN ('sent', 'replied')
    OR LOWER(COALESCE(${p}status, '')) LIKE 'follow-up%'
    OR COALESCE(${p}has_replied, 0) = 1
    OR COALESCE(${p}message_id, '') != ''
    OR COALESCE(${p}thread_id, '') != ''
  )`;
}

async function recalculateCampaignStats(campaignId, activeSender = null) {
  if (!campaignId) return null;
  await ensureCampaignStatsColumns();

  const { rows } = await pool.query(
    `SELECT
       COUNT(*) AS total,
       SUM(CASE WHEN ${sentStatusSql()} THEN 1 ELSE 0 END) AS sent,
       SUM(CASE WHEN LOWER(COALESCE(status, '')) IN ('pending', 'queued') THEN 1 ELSE 0 END) AS pending,
       SUM(CASE WHEN LOWER(COALESCE(status, '')) = 'failed' THEN 1 ELSE 0 END) AS failed,
       SUM(CASE WHEN COALESCE(has_replied, 0) = 1 THEN 1 ELSE 0 END) AS replied,
       (SELECT sender_email FROM leads
        WHERE campaign_id = ? AND sender_email IS NOT NULL AND sender_email != ''
        GROUP BY sender_email ORDER BY COUNT(*) DESC LIMIT 1) AS lead_sender
     FROM leads
     WHERE campaign_id = ?`,
    [campaignId, campaignId]
  );

  const stats = rows[0] || {};
  const total = parseInt(stats.total) || 0;
  const sent = parseInt(stats.sent) || 0;
  const pending = parseInt(stats.pending) || 0;
  const failed = parseInt(stats.failed) || 0;
  const replied = parseInt(stats.replied) || 0;
  const sender = activeSender || stats.lead_sender || null;

  await pool.query(
    `UPDATE campaigns
     SET total_leads = ?,
         sent_count = ?,
         pending_count = ?,
         failed_count = ?,
         active_sender = COALESCE(?, active_sender)
     WHERE id = ?`,
    [total, sent, pending, failed, sender, campaignId]
  );

  console.log(`[CAMPAIGN_STATS] campaign=${campaignId} total=${total} sent=${sent} replied=${replied} pending=${pending} failed=${failed} sender=${sender || 'Auto Rotation'}`);
  return {
    total,
    sent,
    replied,
    pending,
    failed,
    progress: total > 0 ? Math.round((sent / total) * 100) : 0,
    active_sender: sender,
  };
}

module.exports = {
  ensureCampaignStatsColumns,
  recalculateCampaignStats,
  sentStatusSql,
};
