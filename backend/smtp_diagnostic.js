const nodemailer = require('nodemailer');
const pool = require('./db');

async function test() {
  const { rows } = await pool.query(
    "SELECT smtp_host, smtp_port, smtp_user, smtp_pass FROM sender_accounts WHERE email = 'bhumi@viralkar.in'"
  );

  if (!rows[0]) {
    console.error('ERROR: No SMTP account found for bhumi@viralkar.in');
    process.exit(1);
  }

  const s = rows[0];
  const port = parseInt(s.smtp_port) || 465;
  console.log('SMTP CONFIG:', { host: s.smtp_host, port, user: s.smtp_user });

  const t = nodemailer.createTransport({
    host: s.smtp_host,
    port,
    secure: port === 465,
    auth: { user: s.smtp_user, pass: s.smtp_pass },
    debug: true,
    logger: true,
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  console.log('\nVerifying SMTP connection...');
  await t.verify();
  console.log('SMTP VERIFY OK\n');

  const info = await t.sendMail({
    from: '"Bhumi Test" <bhumi@viralkar.in>',
    to: 'aimlsws@gmail.com',
    subject: 'SMTP RAW DIAGNOSTIC ' + new Date().toISOString(),
    text: 'If you receive this, SMTP delivery is working end-to-end.',
    html: '<p>If you receive this, <strong>SMTP delivery is working</strong> end-to-end.</p>',
    envelope: { from: s.smtp_user, to: 'aimlsws@gmail.com' },
  });

  console.log('\n=== RESULT ===');
  console.log('ACCEPTED:', info.accepted);
  console.log('REJECTED:', info.rejected);
  console.log('RESPONSE:', info.response);
  console.log('MESSAGE ID:', info.messageId);

  if (info.accepted.length > 0) {
    console.log('\nSMTP ACCEPTED the message.');
    console.log('Check aimlsws@gmail.com inbox AND spam folder.');
    console.log('If not in either — issue is server-side (SPF/DKIM/relay config on mail.viralkar.in).');
  } else {
    console.log('\nSMTP REJECTED the message — check credentials and relay permissions.');
  }

  process.exit(0);
}

test().catch(err => {
  console.error('\nDIAGNOSTIC FAILED:', err.message);
  console.error('CODE:', err.code);
  console.error('COMMAND:', err.command);
  process.exit(1);
});
