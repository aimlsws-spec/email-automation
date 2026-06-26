const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/campaigns/status
router.get('/api/campaigns/status', async (req, res) => {
  try {
    console.log('[API] GET /api/campaigns/status - Fetching live data from leads');

    const { rows } = await pool.query(`
      SELECT
        c.id,
        c.name,
        c.status AS db_status,
        COUNT(l.email) as lead_count,
        GREATEST(
          COUNT(l.email),
          COALESCE((SELECT COUNT(*) FROM email_queue eq WHERE eq.campaign_id = c.id), 0)
        ) as total,
        SUM(CASE WHEN LOWER(l.status) = 'sent' THEN 1 ELSE 0 END) as sent,
        SUM(CASE WHEN LOWER(l.status) = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN LOWER(l.status) = 'failed' THEN 1 ELSE 0 END) as failed,
        SUM(CASE WHEN l.has_replied = 1 THEN 1 ELSE 0 END) as replied,
        SUM(CASE WHEN LOWER(l.status) IN ('sent', 'delivered', 'replied', 'completed', 'followup_completed') OR l.has_replied = 1 THEN 1 ELSE 0 END) as completed,
        MAX(COALESCE(c.active_sender, 'Auto Rotation')) as active_sender,
        MAX(c.created_at) as created_at
      FROM campaigns c
      LEFT JOIN leads l ON l.campaign_id = c.id
      GROUP BY c.id, c.name, c.status
      ORDER BY created_at DESC
    `);

    console.log(`[API] Found ${rows.length} campaigns`);

    const campaigns = rows.map(row => {
      const dbStatus = (row.db_status || '').toLowerCase();
      let status = 'PENDING';
      if (dbStatus === 'paused') {
        status = 'PAUSED';
      } else if (row.total > 0 && parseInt(row.sent) === parseInt(row.total)) {
        status = 'COMPLETED';
      } else if (parseInt(row.sent) > 0 || dbStatus === 'running') {
        status = 'RUNNING';
      }

      const leadCount = parseInt(row.lead_count) || 0;
      const completedCount = parseInt(row.completed) || 0;
      const calculatedProgress = leadCount > 0 ? Math.round((completedCount / leadCount) * 100) : 0;

      console.log('[PROGRESS_DEBUG]', {
        campaign_id: row.id,
        totalLeads: leadCount,
        sentLeads: parseInt(row.sent) || 0,
        repliedLeads: parseInt(row.replied) || 0,
        completedLeads: completedCount,
        calculatedProgress
      });

      return {
        ...row,
        status,
        replied: parseInt(row.replied) || 0,
        reply_rate: parseInt(row.total) > 0
          ? parseFloat((parseInt(row.replied) / parseInt(row.total) * 100).toFixed(1))
          : 0,
        progress: calculatedProgress
      };
    });

    res.json({
      success: true,
      campaigns: campaigns
    });
  } catch (err) {
    console.error('❌ [API] /api/campaigns/status ERROR:', err);
    res.json({
      success: false,
      campaigns: [],
      message: err.message
    });
  }
});

// Step 4: FIX GET /api/campaigns/:id
router.get('/api/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Invalid campaign ID' });
    }

    console.log('[CAMPAIGN_DETAILS]');
    console.log(`campaign_id=${id}`);

    // 1. Fetch campaign metadata
    const campaignMeta = await pool.query('SELECT name, subject, active_sender FROM campaigns WHERE id = ?', [id]);
    if (campaignMeta.rows.length === 0) {
      console.log(`[CAMPAIGN_DETAILS] campaign_id=${id} - campaign not found`);
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    // 2. Fetch leads
    const leadsRes = await pool.query(`
      SELECT email, name, company, status, sender_email, created_at
      FROM leads
      WHERE campaign_id = ?
      ORDER BY created_at DESC
    `, [id]);

    console.log('[CAMPAIGN_LEADS]');
    console.log(`campaign_id=${id}`);
    console.log(`rows_found=${leadsRes.rows.length}`);

    // 3. Fetch summary stats
    const summaryRes = await pool.query(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN LOWER(status) = 'sent' THEN 1 ELSE 0 END) AS sent,
        SUM(CASE WHEN LOWER(status) = 'pending' THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN LOWER(status) = 'failed' THEN 1 ELSE 0 END) AS failed,
        SUM(CASE WHEN has_replied = 1 THEN 1 ELSE 0 END) AS replied,
        SUM(CASE WHEN LOWER(status) IN ('sent', 'delivered', 'replied', 'completed', 'followup_completed') OR has_replied = 1 THEN 1 ELSE 0 END) AS completed,
        MIN(created_at) AS created_at,
        (SELECT sender_email FROM leads WHERE campaign_id = ? AND sender_email IS NOT NULL
         GROUP BY sender_email ORDER BY COUNT(*) DESC LIMIT 1) AS active_sender
      FROM leads
      WHERE campaign_id = ?
    `, [id, id]);

    const summary = summaryRes.rows[0] || {
      total: 0, sent: 0, pending: 0, failed: 0, created_at: null, active_sender: null
    };

    console.log('[CAMPAIGN_STATS]');
    console.log(`campaign_id=${id}`);
    console.log(`total_leads=${summary.total}`);
    console.log(`sent=${summary.sent}`);
    console.log(`pending=${summary.pending}`);
    console.log(`replied=${summary.replied}`);
    console.log(`completed=${summary.completed}`);

    res.json({
      success: true,
      id: id,
      name: campaignMeta.rows[0].name,
      subject: campaignMeta.rows[0].subject,
      leads: leadsRes.rows,
      summary: {
        ...summary,
        active_sender: summary.active_sender || campaignMeta.rows[0].active_sender || 'Auto Rotation'
      }
    });
  } catch (err) {
    console.error('❌ /api/campaigns/:id ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/campaigns/:id/leads — dedicated leads fetch for campaign details
router.get('/api/campaigns/:id/leads', async (req, res) => {
  try {
    const campaignId = parseInt(req.params.id, 10);
    if (isNaN(campaignId)) return res.status(400).json({ error: 'Invalid campaign ID' });

    const { rows } = await pool.query(`
      SELECT
        l.email AS id,
        l.name,
        l.email,
        l.company,
        l.status,
        l.follow_up_count,
        l.follow_up_step,
        l.has_replied,
        l.is_bounced,
        l.followup_enabled,
        l.followup_stopped_reason,
        l.unsubscribed,
        l.next_follow_up_at,
        l.last_sent_at,
        l.last_activity_at,
        l.created_at,
        l.reply_detected_at,
        l.sender_email,
        l.campaign_id,
        c.name AS campaign_name,
        c.subject
      FROM leads l
      LEFT JOIN campaigns c ON l.campaign_id = c.id
      WHERE l.campaign_id = ?
      ORDER BY l.last_activity_at IS NULL, l.last_activity_at DESC
    `, [campaignId]);

    console.log('[CAMPAIGN_LEADS]');
    console.log(`campaign_id=${campaignId}`);
    console.log(`rows_found=${rows.length}`);
    console.log(`[API] /api/campaigns/${campaignId}/leads → ${rows.length} leads`);
    res.json({ success: true, data: rows, count: rows.length });
  } catch (err) {
    console.error(`❌ /api/campaigns/:id/leads ERROR:`, err.message);
    res.status(500).json({ success: false, error: err.message, data: [] });
  }
});

// DELETE /api/campaigns/:id — delete campaign and everything related to it
router.delete('/api/campaigns/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid campaign ID' });

    const { rows } = await pool.query('SELECT id, name FROM campaigns WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, error: 'Campaign not found' });

    // Step 1: Signal the queue worker to skip any in-flight jobs for this campaign
    await pool.query(`UPDATE campaigns SET status = 'Cancelled' WHERE id = ?`, [id]);
    // Step 2: Delete in dependency order: queue/logs first, then leads, then campaign
    await pool.query('DELETE FROM email_queue    WHERE campaign_id = ?', [id]);
    await pool.query('DELETE FROM followup_queue WHERE campaign_id = ?', [id]);
    await pool.query('DELETE FROM followup_logs  WHERE campaign_id = ?', [id]);
    await pool.query('DELETE FROM leads          WHERE campaign_id = ?', [id]);
    await pool.query('DELETE FROM campaigns      WHERE id = ?',          [id]);

    console.log(`[CAMPAIGN_DELETE] Deleted campaign ${id} (${rows[0].name})`);
    res.json({ success: true, name: rows[0].name });
  } catch (err) {
    console.error('[CAMPAIGN_DELETE] error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
