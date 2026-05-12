const express = require('express');
const router = express.Router();
const pool = require('../db');
const { markAsReplied, markAsBounced } = require('../services/followUp.service');
const {
  runAutomatedFollowUpScheduler,
  pauseFollowUp,
  resumeFollowUp,
  getFollowUpAnalytics,
  getLeadFollowUpTimeline,
  getSchedulePreview,
  getNextFollowUpInfo,
} = require('../services/automatedFollowUp.service');
const { getAutomationEnabled, setAutomationEnabled } = require('../services/systemSettings.service');

// POST /api/followup/run — manual trigger
router.post('/api/followup/run', async (req, res) => {
  try {
    const sent = await runAutomatedFollowUpScheduler();
    res.json({ success: true, message: `Follow-up job complete. ${sent} sent this run.` });
  } catch (err) {
    console.error('[FOLLOWUP] Manual trigger error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/followup/mark-replied
router.post('/api/followup/mark-replied', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });
    await markAsReplied(email);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/followup/mark-bounced
router.post('/api/followup/mark-bounced', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });
    await markAsBounced(email);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/followup/analytics — full follow-up analytics for dashboard
router.get('/api/followup/analytics', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        email, name, company, status,
        follow_up_step, follow_up_count,
        has_replied, is_bounced,
        last_sent_at, next_follow_up_at,
        reply_detected_at, sender_email
      FROM leads
      WHERE follow_up_count > 0 OR has_replied = 1 OR status LIKE 'Follow-up%'
      ORDER BY
        CASE WHEN has_replied = 1 THEN 0 ELSE 1 END,
        follow_up_count DESC,
        last_sent_at IS NULL, last_sent_at DESC
      LIMIT 200
    `);

    const { rows: [summary] } = await pool.query(`
      SELECT
        SUM(CASE WHEN follow_up_count > 0 THEN 1 ELSE 0 END)                                                        AS total_with_followups,
        SUM(CASE WHEN has_replied = 1 THEN 1 ELSE 0 END)                                                            AS total_replied,
        SUM(CASE WHEN has_replied = 0 AND is_bounced = 0 AND next_follow_up_at IS NOT NULL AND next_follow_up_at > NOW() THEN 1 ELSE 0 END) AS pending_followups,
        COALESCE(SUM(follow_up_count), 0)                                                                            AS total_followup_emails_sent,
        SUM(CASE WHEN has_replied = 0 AND follow_up_count > 0 AND is_bounced = 0 THEN 1 ELSE 0 END)                 AS active_sequences
      FROM leads
    `);

    res.json({ success: true, leads: rows, summary });
  } catch (err) {
    console.error('❌ /api/followup/analytics ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/followup/status — leads currently in follow-up pipeline
router.get('/api/followup/status', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT email, name, company, status, follow_up_step, follow_up_count,
             next_follow_up_at, last_sent_at, sender_email, has_replied, is_bounced
      FROM leads
      WHERE has_replied = 0
        AND is_bounced  = 0
        AND status NOT IN ('Pending', 'Failed', 'Replied')
      ORDER BY next_follow_up_at IS NULL, next_follow_up_at ASC
      LIMIT 200
    `);
    res.json({ count: rows.length, leads: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Automated Follow-Up API Routes ────────────────────────────────────────

// GET /api/followup/schedule
router.get('/api/followup/schedule', (req, res) => {
  res.json({ success: true, schedule: getSchedulePreview() });
});

// GET /api/followup/analytics/v2
router.get('/api/followup/analytics/v2', async (req, res) => {
  try {
    const campaignId = req.query.campaignId ? parseInt(req.query.campaignId) : null;
    const data = await getFollowUpAnalytics(campaignId);
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/followup/timeline/:email
router.get('/api/followup/timeline/:email', async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const timeline = await getLeadFollowUpTimeline(email);
    const { rows: [lead] } = await pool.query(
      `SELECT email, name, follow_up_step, followup_enabled, followup_stopped_reason,
              next_follow_up_at, has_replied, is_bounced, unsubscribed, message_id, thread_id
       FROM leads WHERE email = ? LIMIT 1`,
      [email]
    );
    const nextInfo = lead ? getNextFollowUpInfo(lead) : null;
    res.json({ success: true, timeline, lead: lead || null, nextFollowUp: nextInfo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Global automation toggle (persisted in system_settings) ────────────────

// GET /api/followup/automation/status
router.get('/api/followup/automation/status', async (req, res) => {
  try {
    const enabled = await getAutomationEnabled();
    res.json({ success: true, enabled });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/followup/automation/pause
router.post('/api/followup/automation/pause', async (req, res) => {
  try {
    await setAutomationEnabled(false);
    console.log('[AUTO FOLLOWUP] Automation paused via API');
    res.json({ success: true, enabled: false });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/followup/automation/resume
router.post('/api/followup/automation/resume', async (req, res) => {
  try {
    await setAutomationEnabled(true);
    console.log('[AUTO FOLLOWUP] Automation resumed via API');
    res.json({ success: true, enabled: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/followup/pause
router.post('/api/followup/pause', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });
    await pauseFollowUp(email);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/followup/resume
router.post('/api/followup/resume', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });
    await resumeFollowUp(email);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/followup/stop
router.post('/api/followup/stop', async (req, res) => {
  try {
    const { email, reason } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });
    const { stopFollowUp: stopFU } = require('../services/automatedFollowUp.service');
    await stopFU(email, reason || 'manual_stop');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/followup/campaign/:id/toggle
router.post('/api/followup/campaign/:id/toggle', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.id);
    const { enabled } = req.body;
    await pool.query(`UPDATE campaigns SET followup_enabled = ? WHERE id = ?`, [enabled ? 1 : 0, campaignId]);
    if (!enabled) {
      await pool.query(
        `UPDATE leads SET followup_enabled = 0, followup_stopped_reason = 'campaign_disabled', next_follow_up_at = NULL
         WHERE campaign_id = ? AND has_replied = 0 AND is_bounced = 0`,
        [campaignId]
      );
    }
    res.json({ success: true, enabled: !!enabled });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/followup/campaign/:id/stats
router.get('/api/followup/campaign/:id/stats', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.id);
    const data = await getFollowUpAnalytics(campaignId);
    const { rows: [campaign] } = await pool.query(
      `SELECT id, name, followup_enabled FROM campaigns WHERE id = ?`,
      [campaignId]
    );
    res.json({ success: true, campaign: campaign || null, ...data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
