const pool = require('./db');

async function removeEmail() {
  const emailToRemove = 'bhumikatirgar08@gmail.com';
  
  console.log(`🗑️  Removing email: ${emailToRemove}\n`);

  try {
    // Check if email exists
    const { rows: existing } = await pool.query(
      'SELECT * FROM leads WHERE email = $1',
      [emailToRemove]
    );

    if (existing.length === 0) {
      console.log('ℹ️  Email not found in database');
      console.log('   Nothing to remove\n');
      process.exit(0);
    }

    console.log('Found lead:');
    console.log('  Name:', existing[0].name);
    console.log('  Email:', existing[0].email);
    console.log('  Company:', existing[0].company);
    console.log('  Status:', existing[0].status);
    console.log();

    // Delete the email
    const result = await pool.query(
      'DELETE FROM leads WHERE email = $1',
      [emailToRemove]
    );

    if (result.rowCount > 0) {
      console.log('✅ Email removed successfully\n');
      
      // Show remaining count
      const { rows: count } = await pool.query('SELECT COUNT(*) as count FROM leads');
      console.log(`📊 Remaining leads in database: ${count[0].count}\n`);
    } else {
      console.log('❌ Failed to remove email\n');
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

removeEmail();
