const express = require('express');
const router = express.Router();
const pool = require('../db');
const { handleUnsubscribe, isInSuppressionList } = require('../services/automatedFollowUp.service');

// Normalize email: double-decode (handles %2540 from email clients), lowercase, trim
function normalizeEmail(raw) {
  if (!raw) return '';
  let s = raw;
  try { s = decodeURIComponent(s); } catch (_) {}
  try { s = decodeURIComponent(s); } catch (_) {}
  return s.toLowerCase().trim();
}

// POST /api/unsubscribe
router.post('/api/unsubscribe', async (req, res) => {
  try {
    const raw = req.body.email;
    const email = normalizeEmail(raw);
    const campaignId = req.body.campaignId || null;
    console.log(`[UNSUB POST] raw="${raw}" normalized="${email}" campaign=${campaignId}`);
    if (!email) return res.status(400).json({ error: 'email required' });
    // handleUnsubscribe writes to suppression_list, leads, and unsubscribed_contacts atomically
    await handleUnsubscribe(email, campaignId, req.ip, req.headers['user-agent']);
    console.log(`[UNSUB POST] handleUnsubscribe done for "${email}"`);
    res.json({ success: true, message: `${email} has been unsubscribed.` });
  } catch (err) {
    console.error('[UNSUB POST] error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/unsubscribe — one-click unsubscribe from email link
// Accepts: ?email=<encoded>, ?token=<encoded_email>, ?lid=<encoded>
// The token value IS the URL-encoded email (set by {{unsubscribe_token}} / {{unsubscribe}}).
router.get('/api/unsubscribe', async (req, res) => {
  try {
    // Express already URL-decodes query params; normalizeEmail handles double-encoding
    // from email clients that re-encode %40 → %2540.
    const raw = req.query.email || req.query.token || req.query.lid || '';
    const email = normalizeEmail(raw);
    const campaignId = req.query.cid || null;
    console.log(`[UNSUB GET] raw="${raw}" normalized="${email}" campaign=${campaignId} ip=${req.ip}`);

    if (!email) {
      console.warn('[UNSUB GET] Missing or empty email — returning 400');
      return res.status(400).send('Missing email parameter');
    }

    // handleUnsubscribe writes to suppression_list, leads, and unsubscribed_contacts atomically
    await handleUnsubscribe(email, campaignId, req.ip, req.headers['user-agent']);
    console.log(`[UNSUB GET] handleUnsubscribe done for "${email}"`);

    res.send(`<!DOCTYPE html>
<html><head><title>Unsubscribed</title>
<style>body{font-family:sans-serif;text-align:center;padding:60px;background:#f9fafb;color:#111}
h2{color:#111}p{color:#555}small{color:#aaa}</style></head>
<body>
<h2>You have been unsubscribed</h2>
<p>Your email address has been removed from our mailing list.</p>
<p>You will no longer receive emails from us.</p>
<small>If this was a mistake, please contact us directly.</small>
</body></html>`);
  } catch (err) {
    console.error('[UNSUB GET] error:', err.message);
    res.status(500).send('Error processing unsubscribe request');
  }
});

// GET /api/suppression/:email
router.get('/api/suppression/:email', async (req, res) => {
  try {
    const email = normalizeEmail(req.params.email);
    const suppressed = await isInSuppressionList(email);
    res.json({ suppressed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
