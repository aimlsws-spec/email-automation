const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/leads — Enriched leads with campaign info
router.get('/api/leads', async (req, res) => {
  try {
    const campaignId = req.query.campaignId ? parseInt(req.query.campaignId, 10) : null;
    if (req.query.campaignId && isNaN(campaignId)) {
      return res.status(400).json({ error: 'Invalid campaignId' });
    }

    let query = `
      SELECT
        l.email AS id,
        l.name,
        l.email,
        l.company,
        l.status,
        l.follow_up_count,
        l.has_replied,
        l.last_activity_at,
        l.created_at,
        l.reply_detected_at,
        l.sender_email AS lead_sender_email,
        c.id AS campaign_id,
        c.name AS campaign_name,
        COALESCE(c.sender_email, l.sender_email) AS sender_email,
        c.subject
      FROM leads l
      LEFT JOIN campaigns c ON l.campaign_id = c.id
    `;
    const params = [];
    if (campaignId) {
      query += ` WHERE l.campaign_id = ?`;
      params.push(campaignId);
    }
    query += ` ORDER BY l.last_activity_at IS NULL, l.last_activity_at DESC`;

    const { rows } = await pool.query(query, params);
    console.log(`[API] /api/leads campaignId=${campaignId ?? 'all'} → ${rows.length} rows`);
    res.json(rows);
  } catch (err) {
    console.error('❌ /api/leads ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
