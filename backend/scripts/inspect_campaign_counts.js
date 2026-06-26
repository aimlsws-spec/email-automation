const pool = require('../db');

(async () => {
  const id = 102;
  try {
    console.log('COUNT leads WHERE campaign_id=?', id);
    const leadsCount = await pool.query('SELECT COUNT(*) AS count FROM leads WHERE campaign_id = ?', [id]);
    console.log('leads_count:', leadsCount.rows[0]?.count || 0);

    const emailLogs = await pool.query('SELECT COUNT(*) AS count FROM email_logs WHERE campaign_id = ?', [id]);
    console.log('email_logs_count:', emailLogs.rows[0]?.count || 0);

    const emailQueue = await pool.query('SELECT COUNT(*) AS count FROM email_queue WHERE campaign_id = ?', [id]);
    console.log('email_queue_count:', emailQueue.rows[0]?.count || 0);

    const followupQueue = await pool.query('SELECT COUNT(*) AS count FROM followup_queue WHERE campaign_id = ?', [id]);
    console.log('followup_queue_count:', followupQueue.rows[0]?.count || 0);

    const followupLogs = await pool.query('SELECT COUNT(*) AS count FROM followup_logs WHERE campaign_id = ?', [id]);
    console.log('followup_logs_count:', followupLogs.rows[0]?.count || 0);

    const campaignsRow = await pool.query('SELECT id, total_leads, sent_count, pending_count, failed_count, reply_count FROM campaigns WHERE id = ?', [id]);
    console.log('campaigns_row_count:', campaignsRow.rows.length);
    if (campaignsRow.rows.length) console.log('campaigns_row:', campaignsRow.rows[0]);

    const leadsNull = await pool.query('SELECT COUNT(*) AS count FROM leads WHERE campaign_id IS NULL OR campaign_id = 0');
    console.log('leads_with_null_or_0_campaign_id:', leadsNull.rows[0]?.count || 0);

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit(0);
  }
})();
