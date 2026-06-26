const pool = require('../db');

(async () => {
  const id = 102;
  console.log('--- Inspecting campaign', id);
  try {
    const camp = await pool.query('SELECT * FROM campaigns WHERE id = ?', [id]);
    console.log('campaign rows:', camp.rows.length);
    if (camp.rows.length) console.log(camp.rows[0]);

    const leadsCount = await pool.query('SELECT COUNT(*) AS count FROM leads WHERE campaign_id = ?', [id]);
    console.log('leads_count:', leadsCount.rows[0]?.count || 0);

    const leadsSample = await pool.query('SELECT id, email, status, has_replied, campaign_id, created_at FROM leads WHERE campaign_id = ? LIMIT 10', [id]);
    console.log('leads sample rows:', leadsSample.rows.length);
    console.log(leadsSample.rows);

    const emailLogs = await pool.query('SELECT COUNT(*) AS count FROM email_logs WHERE campaign_id = ?', [id]);
    console.log('email_logs_count:', emailLogs.rows[0]?.count || 0);

    const emailQueue = await pool.query('SELECT COUNT(*) AS count FROM email_queue WHERE campaign_id = ?', [id]);
    console.log('email_queue_count:', emailQueue.rows[0]?.count || 0);

    const followupQueue = await pool.query('SELECT COUNT(*) AS count FROM followup_queue WHERE campaign_id = ?', [id]);
    console.log('followup_queue_count:', followupQueue.rows[0]?.count || 0);

    const followupLogs = await pool.query('SELECT COUNT(*) AS count FROM followup_logs WHERE campaign_id = ?', [id]);
    console.log('followup_logs_count:', followupLogs.rows[0]?.count || 0);

    // Also check for leads that reference NULL campaign_id or different ids
    const leadsNull = await pool.query('SELECT COUNT(*) AS count FROM leads WHERE campaign_id IS NULL OR campaign_id = 0');
    console.log('leads_with_null_or_0_campaign_id:', leadsNull.rows[0]?.count || 0);

    // Check if any leads have campaign_id cast differently e.g., as string
    const leadsByCampaigns = await pool.query('SELECT campaign_id, COUNT(*) AS count FROM leads GROUP BY campaign_id ORDER BY count DESC LIMIT 20');
    console.log('top campaign_id counts (sample):', leadsByCampaigns.rows.slice(0,20));

  } catch (err) {
    console.error('Error inspecting campaign:', err.message);
  } finally {
    process.exit(0);
  }
})();
