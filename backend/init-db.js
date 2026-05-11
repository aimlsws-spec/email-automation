const pool = require('./db');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

function findProjectDir() {
  if (process.env.PYTHON_PROJECT_DIR) return process.env.PYTHON_PROJECT_DIR;

  let current = __dirname;
  while (current && current !== path.dirname(current)) {
    if (fs.existsSync(path.join(current, 'gmail_oauth.py'))) {
      return current;
    }
    current = path.dirname(current);
  }

  return path.resolve(__dirname, '../../../../../..');
}

async function initDatabase() {
  console.log('🔧 Initializing database...\n');

  try {
    // 1. Create table
    console.log('📋 Creating leads table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
          email                   TEXT PRIMARY KEY,
          name                    TEXT DEFAULT '',
          company                 TEXT DEFAULT '',
          status                  TEXT DEFAULT 'Pending',
          email_provider          TEXT DEFAULT 'gmail',
          last_sent_date          TEXT DEFAULT '',
          follow_up_count         INTEGER DEFAULT 0,
          message_id              TEXT DEFAULT '',
          initial_message_id      TEXT DEFAULT '',
          last_subject            TEXT DEFAULT '',
          inquiry_id              TEXT DEFAULT '',
          reply_detected_at       TEXT DEFAULT ''
      );
    `);
    console.log('✅ Table created/verified\n');

    // 2. Check if data exists
    const { rows: existing } = await pool.query('SELECT COUNT(*) as count FROM leads');
    const count = parseInt(existing[0].count);
    
    if (count > 0) {
      console.log(`ℹ️  Database already has ${count} leads`);
      console.log('   To reimport, run: DELETE FROM leads; then run this script again\n');
      process.exit(0);
    }

    // 3. Import from CSV
    const csvPath = path.join(findProjectDir(), 'data.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.log('⚠️  No data.csv found at:', csvPath);
      console.log('   Upload leads via /api/upload-leads endpoint\n');
      process.exit(0);
    }

    console.log('📥 Importing from:', csvPath);
    
    const leads = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => leads.push(row))
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(`   Found ${leads.length} leads in CSV\n`);

    // 4. Insert into database
    let inserted = 0;
    for (const lead of leads) {
      try {
        await pool.query(
          `INSERT INTO leads (email, name, company, status, last_sent_date, follow_up_count, message_id, initial_message_id, last_subject, inquiry_id, reply_detected_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           ON CONFLICT (email) DO NOTHING`,
          [
            lead.email || '',
            lead.name || '',
            lead.company || '',
            lead.status || 'Pending',
            lead.last_sent_date || '',
            parseInt(lead.follow_up_count) || 0,
            lead.message_id || '',
            lead.initial_message_id || '',
            lead.last_subject || '',
            lead.inquiry_id || '',
            lead.reply_detected_at || ''
          ]
        );
        inserted++;
      } catch (err) {
        console.error(`   ⚠️  Skipped ${lead.email}:`, err.message);
      }
    }

    console.log(`✅ Imported ${inserted} leads into database\n`);
    
    // 5. Verify
    const { rows: final } = await pool.query('SELECT COUNT(*) as count FROM leads');
    console.log(`📊 Final count: ${final[0].count} leads in database\n`);
    
    console.log('✅ Database initialization complete!');
    console.log('   Start backend: npm start');
    console.log('   API endpoint: http://localhost:4000/api/dashboard\n');

  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error(err);
  } finally {
    await pool.end();
  }
}

initDatabase();
