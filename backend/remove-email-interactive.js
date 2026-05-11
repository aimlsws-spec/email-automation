const pool = require('./db');

// Get email from command line argument
const emailToRemove = process.argv[2];

async function removeEmail() {
  if (!emailToRemove) {
    console.log('❌ Please provide an email address\n');
    console.log('Usage: node remove-email-interactive.js <email>\n');
    console.log('Example: node remove-email-interactive.js test@example.com\n');
    process.exit(1);
  }

  console.log(`🗑️  Removing email: ${emailToRemove}\n`);

  try {
    // Check if email exists
    const { rows: existing } = await pool.query(
      'SELECT * FROM leads WHERE email = $1',
      [emailToRemove]
    );

    if (existing.length === 0) {
      console.log('❌ Email not found in database\n');
      console.log('Available emails:');
      
      const { rows: all } = await pool.query('SELECT email FROM leads ORDER BY email');
      all.forEach((row, i) => {
        console.log(`  ${i + 1}. ${row.email}`);
      });
      console.log();
      
      process.exit(1);
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
      console.log('✅ Email removed successfully from database\n');
      
      // Show remaining count
      const { rows: count } = await pool.query('SELECT COUNT(*) as count FROM leads');
      console.log(`📊 Remaining leads: ${count[0].count}\n`);
      
      console.log('💡 Note: Also remove from D:\\automate mail\\data.csv to prevent re-import\n');
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
