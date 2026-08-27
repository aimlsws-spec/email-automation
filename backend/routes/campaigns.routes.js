const express = require('express');
const router = express.Router();
const pool = require('../db');

const uid = (req) => req.user.id;

router.get('/api/campaigns/status', async (req, res) => {
  try {
    const userId = uid(req);
    const { rows } = await pool.query(`
      SELECT c.id, c.name, c.status AS db_status,
        COUNT(l.email) AS lead_count,
        GREATEST(COUNT(l.email), COALESCE((SELECT COUNT(*) FROM email_queue eq WHERE eq.campaign_id = c.id), 0)) AS total,
        SUM(CASE WHEN LOWER(COALESCE(l.status, '')) IN ('sent', 'replied', 'bounced', 'failed', 'unsubscribed') OR LOWER(COALESCE(l.status, '')) LIKE 'follow-up%' OR l.has_replied = 1 OR l.is_bounced = 1 THEN 1 ELSE 0 END) AS processed,
        SUM(CASE WHEN LOWER(COALESCE(l.status, '')) IN ('sent', 'replied') OR LOWER(COALESCE(l.status, '')) LIKE 'follow-up%' OR l.has_replied = 1 THEN 1 ELSE 0 END) AS sent,
        SUM(CASE WHEN LOWER(COALESCE(l.status, '')) IN ('pending', 'queued') THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN LOWER(COALESCE(l.status, '')) = 'failed' THEN 1 ELSE 0 END) AS failed,
        SUM(CASE WHEN l.has_replied = 1 THEN 1 ELSE 0 END) AS replied,
        SUM(CASE WHEN LOWER(COALESCE(l.status, '')) = 'bounced' OR l.is_bounced = 1 THEN 1 ELSE 0 END) AS bounced,
        MAX(COALESCE(c.active_sender, 'Auto Rotation')) AS active_sender,
        MAX(c.created_at) AS created_at
      FROM campaigns c
      LEFT JOIN leads l ON l.campaign_id = c.id
      WHERE c.user_id = ?
      GROUP BY c.id, c.name, c.status
      ORDER BY created_at DESC
    `, [userId]);
    const campaigns = rows.map(row => {
      const dbStatus = (row.db_status || '').toLowerCase();
      const total = parseInt(row.total) || 0;
      const pending = parseInt(row.pending) || 0;
      const leadCount = parseInt(row.lead_count) || 0;
      const processed = parseInt(row.processed) || 0;
      let status = 'PENDING';
      if (dbStatus === 'paused') status = 'PAUSED';
      else if (total > 0 && pending === 0) status = 'COMPLETED';
      else if (total > 0) status = 'RUNNING';
      return {
        ...row, status, sent: parseInt(row.sent) || 0, replied: parseInt(row.replied) || 0,
        bounced: parseInt(row.bounced) || 0,
        reply_rate: total > 0 ? parseFloat((parseInt(row.replied) / total * 100).toFixed(1)) : 0,
        progress: leadCount > 0 ? Math.round((processed / leadCount) * 100) : 0,
      };
    });
    res.json({ success: true, campaigns });
  } catch (err) {
    console.error('❌ /api/campaigns/status ERROR:', err);
    res.json({ success: false, campaigns: [], message: err.message });
  }
});

router.get('/api/campaigns/:id', async (req, res) => {
  try {
    const userId = uid(req);
    const { id } = req.params;
    if (isNaN(parseInt(id))) return res.status(400).json({ error: 'Invalid campaign ID' });

    const campaignMeta = await pool.query('SELECT name, subject, active_sender FROM campaigns WHERE id = ? AND user_id = ?', [id, userId]);
    if (campaignMeta.rows.length === 0) return res.status(404).json({ success: false, message: 'Campaign not found' });

    const leadsRes = await pool.query(`
      SELECT email, name, company, status, sender_email, created_at
      FROM leads WHERE campaign_id = ? AND user_id = ? ORDER BY created_at DESC
    `, [id, userId]);

    const summaryRes = await pool.query(`
      SELECT COUNT(*) AS total,
        SUM(CASE WHEN LOWER(COALESCE(status, '')) IN ('sent', 'replied') OR LOWER(COALESCE(status, '')) LIKE 'follow-up%' OR has_replied = 1 THEN 1 ELSE 0 END) AS sent,
        SUM(CASE WHEN LOWER(COALESCE(status, '')) IN ('pending', 'queued') THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN LOWER(COALESCE(status, '')) = 'failed' THEN 1 ELSE 0 END) AS failed,
        SUM(CASE WHEN has_replied = 1 THEN 1 ELSE 0 END) AS replied,
        SUM(CASE WHEN LOWER(COALESCE(status, '')) = 'bounced' OR is_bounced = 1 THEN 1 ELSE 0 END) AS bounced,
        SUM(CASE WHEN LOWER(COALESCE(status, '')) = 'suppressed' THEN 1 ELSE 0 END) AS suppressed,
        SUM(CASE WHEN LOWER(COALESCE(status, '')) IN ('sent', 'replied', 'bounced', 'failed', 'unsubscribed', 'suppressed') OR LOWER(COALESCE(status, '')) LIKE 'follow-up%' OR has_replied = 1 OR is_bounced = 1 THEN 1 ELSE 0 END) AS completed,
        MIN(created_at) AS created_at,
        (SELECT sender_email FROM leads WHERE campaign_id = ? AND sender_email IS NOT NULL AND user_id = ?
         GROUP BY sender_email ORDER BY COUNT(*) DESC LIMIT 1) AS active_sender
      FROM leads WHERE campaign_id = ? AND user_id = ?
    `, [id, userId, id, userId]);

    const summary = summaryRes.rows[0] || { total: 0, sent: 0, pending: 0, failed: 0, replied: 0, bounced: 0, completed: 0, created_at: null, active_sender: null };
    res.json({
      success: true, id, name: campaignMeta.rows[0].name, subject: campaignMeta.rows[0].subject,
      leads: leadsRes.rows,
      summary: { ...summary, active_sender: summary.active_sender || campaignMeta.rows[0].active_sender || 'Auto Rotation' },
    });
  } catch (err) {
    console.error('❌ /api/campaigns/:id ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/api/campaigns/:id/leads', async (req, res) => {
  try {
    const userId = uid(req);
    const campaignId = parseInt(req.params.id, 10);
    if (isNaN(campaignId)) return res.status(400).json({ error: 'Invalid campaign ID' });
    const { rows } = await pool.query(`
      SELECT l.email AS id, l.name, l.email, l.company, l.status, l.follow_up_count,
        l.follow_up_step, l.has_replied, l.is_bounced, l.followup_enabled,
        l.followup_stopped_reason, l.unsubscribed, l.next_follow_up_at,
        l.last_sent_at, l.last_activity_at, l.created_at, l.reply_detected_at,
        l.sender_email, l.campaign_id, c.name AS campaign_name, c.subject
      FROM leads l LEFT JOIN campaigns c ON l.campaign_id = c.id
      WHERE l.campaign_id = ? AND l.user_id = ?
      ORDER BY l.last_activity_at IS NULL, l.last_activity_at DESC
    `, [campaignId, userId]);
    res.json({ success: true, data: rows, count: rows.length });
  } catch (err) {
    console.error('❌ /api/campaigns/:id/leads ERROR:', err.message);
    res.status(500).json({ success: false, error: err.message, data: [] });
  }
});

router.delete('/api/campaigns/:id', async (req, res) => {
  try {
    const userId = uid(req);
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid campaign ID' });
    const { rows } = await pool.query('SELECT id, name FROM campaigns WHERE id = ? AND user_id = ?', [id, userId]);
    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Campaign not found' });
    await pool.query(`UPDATE campaigns SET status = 'Cancelled' WHERE id = ?`, [id]);
    await pool.query('DELETE FROM email_queue WHERE campaign_id = ?', [id]);
    await pool.query('DELETE FROM followup_queue WHERE campaign_id = ?', [id]);
    await pool.query('DELETE FROM followup_logs WHERE campaign_id = ?', [id]);
    await pool.query('DELETE FROM leads WHERE campaign_id = ?', [id]);
    await pool.query('DELETE FROM campaigns WHERE id = ?', [id]);
    res.json({ success: true, name: rows[0].name });
  } catch (err) {
    console.error('[CAMPAIGN_DELETE] error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

const campaignsController = require('../controllers/campaigns.controller');

router.get('/api/campaigns/top', campaignsController.getTopCampaign);
router.get('/api/campaigns', campaignsController.getCampaigns);
router.post('/api/campaigns/:campaignId/followup/send-now', campaignsController.sendFollowUpNow);

module.exports = router;
