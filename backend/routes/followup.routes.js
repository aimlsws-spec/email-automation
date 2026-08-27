const express = require('express');
const router = express.Router();
const pool = require('../db');
const { markAsReplied, markAsBounced } = require('../services/followUp.service');
const {
  runAutomatedFollowUpScheduler, pauseFollowUp, resumeFollowUp,
  getFollowUpAnalytics, getLeadFollowUpTimeline, getSchedulePreview, getNextFollowUpInfo,
  getSchedulerStatus,
} = require('../services/automatedFollowUp.service');
const { runCampaignLinkedFollowUpScheduler } = require('../services/campaignFollowUp.service');
const { getAutomationEnabled, setAutomationEnabled } = require('../services/systemSettings.service');
const { triggerQueue, getQueueStatus } = require('../services/queueWorker');

const uid = (req) => req.user.id;

router.post('/api/followup/mark-replied', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });
    await markAsReplied(email);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/api/followup/mark-bounced', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });
    await markAsBounced(email);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/api/followup/analytics', async (req, res) => {
  try {
    const userId = uid(req);
    const { rows } = await pool.query(`
      SELECT email, name, company, status, follow_up_step, follow_up_count,
        has_replied, is_bounced, last_sent_at, next_follow_up_at, reply_detected_at, sender_email
      FROM leads
      WHERE (follow_up_count > 0 OR has_replied = 1 OR status LIKE 'Follow-up%') AND user_id = ?
      ORDER BY CASE WHEN has_replied = 1 THEN 0 ELSE 1 END, follow_up_count DESC, last_sent_at IS NULL, last_sent_at DESC
      LIMIT 200
    `, [userId]);
    const { rows: [summary] } = await pool.query(`
      SELECT
        SUM(CASE WHEN follow_up_count > 0 THEN 1 ELSE 0 END) AS total_with_followups,
        SUM(CASE WHEN has_replied = 1 THEN 1 ELSE 0 END) AS total_replied,
        SUM(CASE WHEN has_replied = 0 AND is_bounced = 0 AND next_follow_up_at IS NOT NULL AND next_follow_up_at > NOW() THEN 1 ELSE 0 END) AS pending_followups,
        COALESCE(SUM(follow_up_count), 0) AS total_followup_emails_sent,
        SUM(CASE WHEN has_replied = 0 AND follow_up_count > 0 AND is_bounced = 0 THEN 1 ELSE 0 END) AS active_sequences
      FROM leads WHERE user_id = ?
    `, [userId]);
    res.json({ success: true, leads: rows, summary });
  } catch (err) {
    console.error('❌ /api/followup/analytics ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/api/followup/status', async (req, res) => {
  try {
    const userId = uid(req);
    const { rows } = await pool.query(`
      SELECT email, name, company, status, follow_up_step, follow_up_count,
        next_follow_up_at, last_sent_at, sender_email, has_replied, is_bounced
      FROM leads
      WHERE has_replied = 0 AND is_bounced = 0 AND status NOT IN ('Pending', 'Failed', 'Replied') AND user_id = ?
      ORDER BY next_follow_up_at IS NULL, next_follow_up_at ASC LIMIT 200
    `, [userId]);
    res.json({ count: rows.length, leads: rows });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/api/followup/analytics/v2', async (req, res) => {
  try {
    const campaignId = req.query.campaignId ? parseInt(req.query.campaignId) : null;
    const data = await getFollowUpAnalytics(campaignId);
    res.json({ success: true, ...data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/api/followup/timeline/:email', async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const timeline = await getLeadFollowUpTimeline(email);
    const { rows: [lead] } = await pool.query(
      `SELECT email, name, follow_up_step, followup_enabled, followup_stopped_reason,
        next_follow_up_at, has_replied, is_bounced, unsubscribed, message_id, thread_id
       FROM leads WHERE email = ? LIMIT 1`, [email]
    );
    const nextInfo = lead ? getNextFollowUpInfo(lead) : null;
    res.json({ success: true, timeline, lead: lead || null, nextFollowUp: nextInfo });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/api/followup/automation/status', async (req, res) => {
  try {
    const enabled = await getAutomationEnabled();
    res.json({ success: true, enabled });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.post('/api/followup/automation/pause', async (req, res) => {
  try {
    const before = await getAutomationEnabled();
    console.log('[RESUME] Before pause - automationEnabled=', before);
    await setAutomationEnabled(false);
    // Wake worker so follow-up jobs re-evaluate and move to pending
    try { triggerQueue(); } catch (e) { console.warn('[AUTO] triggerQueue failed on pause:', e.message); }
    const after = await getAutomationEnabled();
    const q = await getQueueStatus().catch(() => ({}));
    const s = getSchedulerStatus ? getSchedulerStatus() : {schedulerRunning: false};
    console.log('[RESUME] After pause - automationEnabled=', after, 'QueueStatus=', q, 'SchedulerStatus=', s);
    res.json({ success: true, enabled: false });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.post('/api/followup/automation/resume', async (req, res) => {
  try {
    const before = await getAutomationEnabled();
    console.log('[RESUME] Before resume - automationEnabled=', before);
    await setAutomationEnabled(true);
    // Immediately run one scheduler tick and wake the queue worker so sends resume without waiting for cron
    try { await runAutomatedFollowUpScheduler(); console.log('[RESUME] Automated Scheduler Restarted'); } catch (e) { console.warn('[AUTO] runAutomatedFollowUpScheduler failed on resume:', e.message); }
    try { await runCampaignLinkedFollowUpScheduler(); console.log('[RESUME] Campaign Linked Scheduler Restarted'); } catch (e) { console.warn('[AUTO] runCampaignLinkedFollowUpScheduler failed on resume:', e.message); }
    try { triggerQueue(); console.log('[RESUME] Queue Restarted'); } catch (e) { console.warn('[AUTO] triggerQueue failed on resume:', e.message); }
    const after = await getAutomationEnabled();
    const q = await getQueueStatus().catch(() => ({}));
    const s = getSchedulerStatus ? getSchedulerStatus() : {schedulerRunning: false};
    console.log('[RESUME] After resume - automationEnabled=', after, 'QueueStatus=', q, 'SchedulerStatus=', s);
    res.json({ success: true, enabled: true });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.post('/api/followup/pause', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });
    await pauseFollowUp(email);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/api/followup/resume', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });
    await resumeFollowUp(email);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/api/followup/stop', async (req, res) => {
  try {
    const { email, reason } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });
    const { stopFollowUp: stopFU } = require('../services/automatedFollowUp.service');
    await stopFU(email, reason || 'manual_stop');
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/api/followup/campaign/:id/toggle', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.id);
    const { enabled } = req.body;
    await pool.query(`UPDATE campaigns SET followup_enabled = ? WHERE id = ? AND user_id = ?`, [enabled ? 1 : 0, campaignId, uid(req)]);
    if (!enabled) {
      await pool.query(
        `UPDATE leads SET followup_enabled = 0, followup_stopped_reason = 'campaign_disabled', next_follow_up_at = NULL
         WHERE campaign_id = ? AND has_replied = 0 AND is_bounced = 0`, [campaignId]);
    }
    res.json({ success: true, enabled: !!enabled });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/api/followup/campaign/:id/stats', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.id);
    const data = await getFollowUpAnalytics(campaignId);
    const { rows: [campaign] } = await pool.query(
      `SELECT id, name, followup_enabled FROM campaigns WHERE id = ? AND user_id = ?`, [campaignId, uid(req)]);
    res.json({ success: true, campaign: campaign || null, ...data });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Diagnostics endpoint for automation/scheduler/queue
router.get('/api/followup/diagnostics', async (req, res) => {
  try {
    const automationEnabled = await getAutomationEnabled();
    const queueStatus = await getQueueStatus().catch(() => ({}));
    const schedulerStatus = getSchedulerStatus ? getSchedulerStatus() : { schedulerRunning: false };

    // Lightweight DB checks
    const { rows: [pendingRow] } = await pool.query(`SELECT COUNT(*) AS cnt FROM leads WHERE (followup_enabled = 1 OR followup_enabled IS NULL) AND next_follow_up_at IS NOT NULL`);
    const { rows: [overdueRow] } = await pool.query(`SELECT COUNT(*) AS cnt FROM leads WHERE (followup_enabled = 1 OR followup_enabled IS NULL) AND next_follow_up_at <= NOW()`);

    const { rows: [mismatchLeads] } = await pool.query(`
      SELECT COUNT(*) AS cnt FROM leads l
      JOIN campaigns c ON l.campaign_id = c.id
      WHERE (l.followup_enabled = 1 OR l.followup_enabled IS NULL) AND (c.followup_enabled = 0 OR c.followup_enabled IS NULL AND c.status IN ('paused'))
    `).catch(() => [{ cnt: 0 }]);

    const { rows: [staleLeads] } = await pool.query(`
      SELECT COUNT(*) AS cnt FROM leads WHERE (followup_enabled = 0 OR followup_enabled IS NULL) AND next_follow_up_at IS NOT NULL
    `).catch(() => [{ cnt: 0 }]);

    res.json({
      success: true,
      automationEnabled,
      schedulerStatus,
      queueStatus,
      db: {
        pendingLeads: pendingRow.cnt || 0,
        overdueLeads: overdueRow.cnt || 0,
        mismatchedCampaignLeads: mismatchLeads.cnt || 0,
        staleLeadsWithSchedule: staleLeads.cnt || 0,
      },
    });
  } catch (err) {
    console.error('[DIAGNOSTICS] Failed:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
