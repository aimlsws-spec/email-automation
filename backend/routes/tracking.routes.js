const express = require('express');
const router = express.Router();
const pool = require('../db');

// Normalize email: decode URL encoding (handles double-encoded %2540 → %40 → @),
// lowercase, trim.  Safe to call on already-decoded strings.
function normalizeEmail(raw) {
  if (!raw) return 'unknown';
  let s = raw;
  try { s = decodeURIComponent(s); } catch (_) {}
  // Second decode handles email clients that re-encode %40 → %2540
  try { s = decodeURIComponent(s); } catch (_) {}
  return s.toLowerCase().trim() || 'unknown';
}

// GET /track/click - Tracks email link clicks
router.get('/track/click', async (req, res) => {
  const { lid, cid, sid, url, type } = req.query;
  const leadEmail = normalizeEmail(lid);
  console.log(`[TRACK] Link clicked: raw="${lid}" normalized="${leadEmail}"`);

  try {
    if (!url) return res.status(400).send('Missing URL');

    let decodedUrl = Buffer.from(url, 'base64').toString('utf8');

    // For unsubscribe links where the token/email param is missing or empty,
    // inject the lid email so old emails (sent before {{unsubscribe_token}} was
    // wired up) still trigger a proper unsubscribe.
    if (decodedUrl.includes('unsubscribe') && leadEmail !== 'unknown') {
      try {
        const u = new URL(decodedUrl);
        const hasEmail = u.searchParams.get('email');
        const hasToken = u.searchParams.get('token');
        if (!hasEmail && !hasToken) {
          u.searchParams.set('token', leadEmail);
          decodedUrl = u.toString();
          console.log(`[TRACK] Injected missing unsubscribe token for ${leadEmail}`);
        }
      } catch (e) { void e; }
    }

    const isUnsubClick = decodedUrl.toLowerCase().includes('unsubscribe');
    const clickType = isUnsubClick ? 'unsubscribe' : (type || 'click');

    await pool.query(
      `INSERT INTO link_clicks (lead_email, campaign_id, sender_email, url, type, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [leadEmail, cid || null, sid || '', decodedUrl, clickType, req.ip, req.headers['user-agent']]
    ).catch(() => {});

    if (lid) {
      await pool.query(
        `UPDATE email_events SET clicked = 1 WHERE recipient_email = ?`,
        [leadEmail]
      ).catch(() => {});
    }

    // When an unsubscribe link is clicked, mark the lead immediately.
    // This works via the /track/ proxy (already configured in nginx) without
    // needing a separate /api/unsubscribe endpoint.
    if (isUnsubClick && leadEmail !== 'unknown') {
      await pool.query(`
        UPDATE leads
        SET unsubscribed = 1, unsubscribed_at = NOW(),
            followup_enabled = 0, followup_stopped_reason = 'unsubscribed',
            next_follow_up_at = NULL, status = 'Unsubscribed', last_activity_at = NOW()
        WHERE email = ?
      `, [leadEmail]).catch(() => {});
      await pool.query(
        `INSERT INTO suppression_list (email, reason, added_at) VALUES (?, 'unsubscribe', NOW())
         ON DUPLICATE KEY UPDATE added_at = NOW()`,
        [leadEmail]
      ).catch(() => {});
      console.log(`[TRACK] Unsubscribe click — marked ${leadEmail} as unsubscribed`);
    }

    return res.redirect(decodedUrl);
  } catch (err) {
    console.error('[TRACK] Click error:', err.message);
    if (url) {
      try { return res.redirect(Buffer.from(url, 'base64').toString('utf8')); } catch (e) {}
    }
    res.status(500).send('Internal Server Error');
  }
});

// GET /api/track/click - alias for tracking links injected into emails
router.get('/api/track/click', async (req, res) => {
  const { lead, campaign, url } = req.query;
  const leadEmail = normalizeEmail(lead);
  console.log(`[TRACK] Link clicked: raw="${lead}" normalized="${leadEmail}"`);

  try {
    if (!url) return res.status(400).send('Missing URL');
    const decodedUrl = decodeURIComponent(url);

    await pool.query(
      `INSERT INTO link_clicks (lead_email, campaign_id, url, type, ip_address, user_agent, clicked_at)
       VALUES (?, ?, ?, 'click', ?, ?, NOW())`,
      [leadEmail, campaign || null, decodedUrl, req.ip, req.headers['user-agent']]
    ).catch(() => {});

    await pool.query(
      `UPDATE email_events SET clicked = 1 WHERE recipient_email = ?`,
      [leadEmail]
    ).catch(() => {});

    return res.redirect(decodedUrl);
  } catch (err) {
    console.error('[TRACK] /api/track/click error:', err.message);
    res.status(500).send('Internal Server Error');
  }
});

// GET /t/open/:trackingId.gif - 1x1 tracking pixel, marks email as opened
router.get('/t/open/:trackingId.gif', async (req, res) => {
  try {
    const trackingId = (req.params.trackingId || '').trim();
    if (trackingId) {
      await pool.query(
        `UPDATE email_events SET opened = 1 WHERE tracking_id = ?`,
        [trackingId]
      );
    }
  } catch (err) {
    // swallow
  }

  const gif1x1 = Buffer.from(
    'R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
    'base64'
  );
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.send(gif1x1);
});

// GET /t/click/:trackingId — mark clicked=true and redirect
router.get('/t/click/:trackingId', async (req, res) => {
  const trackingId = (req.params.trackingId || '').trim();
  const url = String(req.query.url || '').trim();
  try {
    if (trackingId) {
      await pool.query(`UPDATE email_events SET clicked = 1 WHERE tracking_id = ?`, [trackingId]);
    }
  } catch (err) {
    // swallow
  }
  if (!/^https?:\/\//i.test(url)) return res.status(400).send('Invalid url');
  return res.redirect(url);
});

module.exports = router;
