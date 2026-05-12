const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/health - Simple health check
router.get('/api/health', (req, res) => {
  res.json({
    status: "ok",
    timestamp: Date.now()
  });
});

// GET /api/email-logs — recent send log
router.get('/api/email-logs', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const { rows } = await pool.query(
      'SELECT * FROM email_logs ORDER BY sent_at DESC LIMIT ?',
      [limit]
    );
    res.json({ logs: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /send-test-gmail - send one real Gmail test email
router.get('/send-test-gmail', async (req, res) => {
  try {
    const to = req.query.to || process.env.GMAIL_USER;
    const info = await transporter.sendMail({
      from: `"${process.env.FROM_NAME || 'Seawind Sales'}" <${process.env.GMAIL_USER}>`,
      to,
      subject: 'Gmail Test',
      text: 'Gmail send test successful',
    });

    console.log('Gmail test messageId:', info.messageId);
    res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
