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
        GREATEST(
          COUNT(l.email),
          COALESCE((SELECT COUNT(*) FROM email_queue eq WHERE eq.campaign_id = c.id), 0)
        ) as total,
        SUM(CASE WHEN l.status = 'Sent' THEN 1 ELSE 0 END) as sent,
        SUM(CASE WHEN l.status = 'Pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN l.status = 'Failed' THEN 1 ELSE 0 END) as failed,
        SUM(CASE WHEN l.has_replied = 1 THEN 1 ELSE 0 END) as replied,
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

      return {
        ...row,
        status,
        replied: parseInt(row.replied) || 0,
        reply_rate: parseInt(row.total) > 0
          ? parseFloat((parseInt(row.replied) / parseInt(row.total) * 100).toFixed(1))
          : 0,
        progress: parseInt(row.total) > 0 ? Math.round((parseInt(row.sent) / parseInt(row.total)) * 100) : 0
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

    // 1. Fetch campaign metadata
    const campaignMeta = await pool.query('SELECT name, subject, active_sender FROM campaigns WHERE id = ?', [id]);
    if (campaignMeta.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    // 2. Fetch leads
    const leadsRes = await pool.query(`
      SELECT email, name, company, status, sender_email, created_at
      FROM leads
      WHERE campaign_id = ?
      ORDER BY created_at DESC
    `, [id]);

    // 3. Fetch summary stats
    const summaryRes = await pool.query(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'Sent' THEN 1 ELSE 0 END) AS sent,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN status = 'Failed' THEN 1 ELSE 0 END) AS failed,
        SUM(CASE WHEN has_replied = 1 THEN 1 ELSE 0 END) AS replied,
        MIN(created_at) AS created_at,
        (SELECT sender_email FROM leads WHERE campaign_id = ? AND sender_email IS NOT NULL
         GROUP BY sender_email ORDER BY COUNT(*) DESC LIMIT 1) AS active_sender
      FROM leads
      WHERE campaign_id = ?
    `, [id, id]);

    const summary = summaryRes.rows[0] || {
      total: 0, sent: 0, pending: 0, failed: 0, created_at: null, active_sender: null
    };

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

    console.log(`[API] /api/campaigns/${campaignId}/leads → ${rows.length} leads`);
    res.json({ success: true, data: rows, count: rows.length });
  } catch (err) {
    console.error(`❌ /api/campaigns/:id/leads ERROR:`, err.message);
    res.status(500).json({ success: false, error: err.message, data: [] });
  }
});

module.exports = router;
