const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /track/click - Tracks email link clicks
router.get('/track/click', async (req, res) => {
  const { lid, cid, sid, url, type } = req.query;
  const leadEmail = lid ? decodeURIComponent(lid) : 'unknown';
  console.log(`[TRACK] Link clicked: ${leadEmail}`);

  try {
    if (!url) return res.status(400).send('Missing URL');

    const decodedUrl = Buffer.from(url, 'base64').toString('utf8');

    await pool.query(
      `INSERT INTO link_clicks (lead_email, campaign_id, sender_email, url, type, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [leadEmail, cid || null, sid || '', decodedUrl, type || 'click', req.ip, req.headers['user-agent']]
    ).catch(() => {});

    if (lid) {
      await pool.query(
        `UPDATE email_events SET clicked = 1 WHERE recipient_email = ?`,
        [leadEmail]
      ).catch(() => {});
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
  const leadEmail = lead ? decodeURIComponent(lead) : 'unknown';
  console.log(`[TRACK] Link clicked: ${leadEmail}`);

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
