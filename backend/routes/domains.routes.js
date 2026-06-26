const express = require('express');
const router = express.Router();
const pool = require('../db');
const { getAllDomainStats } = require('../services/eventTracker.service');
const { resetDailyCounters } = require('../services/senderWarmup.service');
const { resetSenderCounts } = require('../services/senderPool.service');
const { trackEvent } = require('../services/eventTracker.service');

// GET /api/domains/stats — all domain reputation stats
router.get('/api/domains/stats', async (req, res) => {
  try {
    const stats = await getAllDomainStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    console.error('❌ /api/domains/stats ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/domains/events?domain=...&limit=50 — raw event log per domain
router.get('/api/domains/events', async (req, res) => {
  try {
    const domain = (req.query.domain || '').trim();
    const limit  = Math.min(parseInt(req.query.limit) || 50, 200);
    const { rows } = domain
      ? await pool.query(`SELECT * FROM domain_events WHERE domain = ? ORDER BY created_at DESC LIMIT ?`, [domain, limit])
      : await pool.query(`SELECT * FROM domain_events ORDER BY created_at DESC LIMIT ?`, [limit]);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('❌ /api/domains/events ERROR:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/domains/report-spam — manually flag a spam report for a domain
router.post('/api/domains/report-spam', async (req, res) => {
  try {
    const { domain } = req.body;
    if (!domain) return res.status(400).json({ error: 'domain required' });
    await trackEvent({ domain, type: 'spam' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/warmup/reset — manually run the midnight warmup+sender reset without waiting for cron.
// Useful when the server was restarted after 00:01 and counters were not cleared.
// Accepts optional body { domain: 'viralkar.in' } to reset a single domain only.
router.post('/api/warmup/reset', async (req, res) => {
  try {
    const { domain } = req.body || {};
    if (domain) {
      await pool.query(`UPDATE sender_warmup SET current_sent = 0 WHERE LOWER(sender_email) LIKE ?`, [`%@${domain.toLowerCase()}`]);
      await pool.query(`UPDATE sender_accounts SET daily_sent_count = 0 WHERE LOWER(email) LIKE ?`, [`%@${domain.toLowerCase()}`]);
      console.log(`[WARMUP/RESET] Manual reset for domain: ${domain}`);
      return res.json({ success: true, message: `Warmup counter reset for ${domain}` });
    }
    await Promise.all([resetDailyCounters(), resetSenderCounts()]);
    console.log('[WARMUP/RESET] Manual full reset triggered');
    res.json({ success: true, message: 'All warmup and sender counters reset.' });
  } catch (err) {
    console.error('[WARMUP/RESET] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;