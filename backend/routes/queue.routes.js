const express = require('express');
const router = express.Router();
const pool = require('../db');
const { triggerQueue } = require('../services/queueWorker');

// POST /api/queue/trigger — force-reset isProcessing and kick the worker immediately
router.post('/api/queue/trigger', (req, res) => {
  triggerQueue();
  res.json({ success: true, message: 'Queue worker triggered. Check server logs.' });
});


// POST /api/queue/unblock — clear future scheduled_at so warmup-blocked jobs become
// eligible immediately on the next worker cycle. Call AFTER /api/warmup/reset.
router.post('/api/queue/unblock', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT COUNT(*) AS cnt FROM email_queue WHERE status = 'pending' AND scheduled_at > NOW()`
    );
    const count = parseInt(rows[0]?.cnt) || 0;
    await pool.query(`UPDATE email_queue SET scheduled_at = NULL WHERE status = 'pending' AND scheduled_at > NOW()`);
    triggerQueue();
    console.log(`[QUEUE/UNBLOCK] Cleared scheduled_at for ${count} blocked job(s). Worker kicked.`);
    res.json({ success: true, unblocked: count, message: `${count} job(s) unblocked. Worker triggered.` });
  } catch (err) {
    console.error('[QUEUE/UNBLOCK] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
