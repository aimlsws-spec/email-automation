const pool = require('./db');

async function resetSystem() {
  console.log('--- Starting System Reset ---');
  const client = await pool.connect();
  
  try {
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('follow_ups', 'email_logs', 'leads', 'campaigns', 'email_queue')
    `);
    const tables = tableCheck.rows.map(r => r.table_name);

    await client.query('BEGIN');

    // 1. Delete dependent data first
    console.log('Cleaning leads and logs...');
    if (tables.includes('follow_ups')) await client.query('DELETE FROM follow_ups');
    if (tables.includes('email_logs')) await client.query('DELETE FROM email_logs');
    if (tables.includes('leads')) await client.query('DELETE FROM leads');
    
    // 2. Delete campaigns
    if (tables.includes('campaigns')) {
        console.log('Cleaning campaigns...');
        await client.query('DELETE FROM campaigns');
    }

    // 3. Reset sequences
    console.log('Resetting sequences...');
    await client.query('ALTER SEQUENCE IF EXISTS campaigns_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE IF EXISTS leads_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE IF EXISTS email_logs_id_seq RESTART WITH 1');

    // 4. Reset sender usage
    console.log('Resetting sender usage metrics...');
    await client.query(`
      UPDATE sender_accounts 
      SET 
        daily_sent_count = 0, 
        last_sent_at = NULL, 
        status = 'active',
        is_connected = true
    `);

    // 5. Reset queue if it exists
    if (tables.includes('email_queue')) {
        console.log('Cleaning email queue...');
        await client.query('DELETE FROM email_queue');
    }

    await client.query('COMMIT');
    console.log('--- System Reset Complete ---');
    
    // 6. Verification
    const campCount = tables.includes('campaigns') ? await client.query('SELECT COUNT(*) FROM campaigns') : { rows: [{count: 0}] };
    const leadCount = tables.includes('leads') ? await client.query('SELECT COUNT(*) FROM leads') : { rows: [{count: 0}] };
    const logCount = tables.includes('email_logs') ? await client.query('SELECT COUNT(*) FROM email_logs') : { rows: [{count: 0}] };
    
    console.log(`Verification:`);
    console.log(`- Campaigns: ${campCount.rows[0].count}`);
    console.log(`- Leads: ${leadCount.rows[0].count}`);
    console.log(`- Email Logs: ${logCount.rows[0].count}`);
    
    console.log("\nSystem reset complete. Ready for fresh test.");

  } catch (error) {
    if (client) await client.query('ROLLBACK').catch(() => {});
    console.error('ERROR during reset:', error);
  } finally {
    client.release();
    process.exit();
  }
}

resetSystem();
