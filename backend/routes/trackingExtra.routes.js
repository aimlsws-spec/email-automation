const express = require('express');
const router = express.Router();
const pool = require('../db');
const { handleUnsubscribe, isInSuppressionList } = require('../services/automatedFollowUp.service');

// POST /api/unsubscribe
router.post('/api/unsubscribe', async (req, res) => {
  try {
    const { email, campaignId } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });
    await handleUnsubscribe(email, campaignId || null, req.ip, req.headers['user-agent']);
    res.json({ success: true, message: `${email} has been unsubscribed.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/unsubscribe — one-click unsubscribe from email link
router.get('/api/unsubscribe', async (req, res) => {
  try {
    const email = decodeURIComponent(req.query.email || req.query.lid || '');
    const campaignId = req.query.cid || null;
    if (!email) return res.status(400).send('Missing email parameter');
    await handleUnsubscribe(email, campaignId, req.ip, req.headers['user-agent']);
    res.send('<!DOCTYPE html><html><head><title>Unsubscribed</title></head><body style="font-family:sans-serif;text-align:center;padding:60px;"><h2>You have been unsubscribed</h2><p>You will no longer receive emails from us.</p></body></html>');
  } catch (err) {
    res.status(500).send('Error processing unsubscribe request');
  }
});

// GET /api/suppression/:email
router.get('/api/suppression/:email', async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const suppressed = await isInSuppressionList(email);
    res.json({ suppressed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;