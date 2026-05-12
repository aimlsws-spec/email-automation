const express = require('express');
const router = express.Router();
const { getSenderStats, getGlobalStats } = require('../services/senderService');

// GET /api/sender-stats
router.get('/api/sender-stats', async (req, res) => {
  try {
    const senders = await getSenderStats();
    const global = await getGlobalStats();
    res.json({ success: true, senders, global });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;