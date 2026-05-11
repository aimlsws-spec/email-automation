const pool = require('./db');

async function listEmails() {
  console.log('📋 Listing all emails in database...\n');

  try {
    const { rows } = await pool.query('SELECT email, name, company, status FROM leads ORDER BY email');

    if (rows.length === 0) {
      console.log('ℹ️  No emails in database\n');
      process.exit(0);
    }

    console.log(`Found ${rows.length} leads:\n`);
    console.log('─'.repeat(80));
    console.log('EMAIL'.padEnd(40), 'NAME'.padEnd(20), 'STATUS');
    console.log('─'.repeat(80));

    rows.forEach((row, i) => {
      console.log(
        `${(i + 1).toString().padStart(2)}. ${row.email.padEnd(37)}`,
        row.name.padEnd(20).substring(0, 20),
        row.status
      );
    });

    console.log('─'.repeat(80));
    console.log(`\nTotal: ${rows.length} leads\n`);

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

listEmails();
