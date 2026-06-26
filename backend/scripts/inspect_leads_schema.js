const pool = require('../db');

(async () => {
  try {
    console.log('DESCRIBE leads');
    const desc = await pool.query('DESCRIBE leads');
    console.log('columns:', desc.rows.map(r => ({Field: r.Field, Type: r.Type}))); 

    console.log('\nCOUNT leads by campaign_id (top 20)');
    const byCamp = await pool.query('SELECT campaign_id, COUNT(*) AS cnt FROM leads GROUP BY campaign_id ORDER BY cnt DESC LIMIT 20');
    console.log(byCamp.rows);

    console.log('\nDoes campaign_leads table exist?');
    try {
      const cl = await pool.query('SELECT COUNT(*) AS cnt FROM campaign_leads');
      console.log('campaign_leads_count:', cl.rows[0]?.cnt);
    } catch (e) {
      console.log('campaign_leads table not found or error:', e.message);
    }

  } catch (err) {
    console.error('Error inspecting leads schema:', err.message);
  } finally {
    process.exit(0);
  }
})();
