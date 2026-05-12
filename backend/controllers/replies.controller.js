const pool = require('../db');
const { checkReplies } = require('../services/replyService');
const { ensureEmailEventsTable } = require('../services/emailService');
const { runReplyCheck, syncRepliedFlagsFromLeads } = require('../services/replyCheck.service');

// POST /api/replies/check — manual trigger (Python path)
async function checkRepliesHandler(req, res) {
  try {
    await runReplyCheck();
    await syncRepliedFlagsFromLeads();
    const { rows } = await pool.query(`
      SELECT COUNT(*) AS count FROM leads
      WHERE reply_detected_at IS NOT NULL AND reply_detected_at != ''
    `);
    res.json({ success: true, total_replied: parseInt(rows[0].count) });
  } catch (err) {
    console.error('[REPLY] Manual trigger error:', err.message);
    res.status(500).json({ error: err.message });
  }
}

// POST /api/replies/sync — manual trigger for Gmail thread-based reply detection
async function syncRepliesHandler(req, res) {
  try {
    console.log('[REPLY_SCAN_START] Manual sync triggered');
    await checkReplies();
    await syncRepliedFlagsFromLeads();
    const { rows } = await pool.query(`
      SELECT
        COUNT(*) AS total_replied,
        (SELECT COUNT(*) FROM email_logs WHERE status IN ('sent','success')) AS total_sent
      FROM leads WHERE has_replied = 1
    `);
    const total_replied = parseInt(rows[0]?.total_replied) || 0;
    const total_sent    = parseInt(rows[0]?.total_sent)    || 0;
    const reply_rate    = total_sent > 0 ? parseFloat((total_replied / total_sent * 100).toFixed(1)) : 0;
    console.log(`[DASHBOARD_REFRESH] sync done replied=${total_replied} sent=${total_sent} rate=${reply_rate}%`);
    res.json({ success: true, total_replied, total_sent, reply_rate });
  } catch (err) {
    console.error('[REPLY] /api/replies/sync error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { checkRepliesHandler, syncRepliesHandler };
