const pool = require('../db');
const { getSenderStats } = require('../services/senderService');
const { getOrCreateRecord, domainFromEmail } = require('../services/senderWarmup.service');
const { ensureSenderInPool } = require('../services/senderPool.service');

exports.getSenders = async (req, res) => {
  try {
    console.log('[API] GET /api/senders - Fetching accounts');
    const { rows } = await pool.query(
      `SELECT email, is_connected, updated_at, COALESCE(type, 'gmail') AS type FROM sender_accounts ORDER BY email ASC`
    );
    res.json({ success: true, data: rows || [] });
  } catch (err) {
    console.error('❌ getSenders ERROR:', err);
    res.status(500).json({ success: false, data: [], message: err.message || 'Internal Server Error' });
  }
};

exports.getSenderStats = async (req, res) => {
  try {
    const accounts = await getSenderStats();
    const activeCount        = accounts.filter(a => a.status === 'active' && a.is_connected).length;
    const totalDailyCapacity = accounts.reduce((sum, a) => sum + (parseInt(a.daily_limit) || 300), 0);

    // Use email_logs as source of truth for today's actual send count per sender
    const { rows: logRows } = await pool.query(`
      SELECT sender_email, COUNT(*) AS cnt
      FROM email_logs
      WHERE status IN ('sent','success') AND DATE(sent_at) = CURDATE()
      GROUP BY sender_email
    `);
    const sentByAccount = {};
    for (const r of logRows) sentByAccount[r.sender_email] = parseInt(r.cnt) || 0;
    const totalSentToday = Object.values(sentByAccount).reduce((s, n) => s + n, 0);
    const totalRemaining = Math.max(0, totalDailyCapacity - totalSentToday);

    res.json({
      success: true,
      data: {
        activeAccounts:    activeCount,
        dailyCapacity:     totalDailyCapacity,
        sentToday:         totalSentToday,
        remainingCapacity: totalRemaining,
        accounts: accounts.map(a => ({
          email:        a.email,
          type:         a.type || 'gmail',
          daily_limit:  parseInt(a.daily_limit) || 300,
          sent_today:   sentByAccount[a.email] || 0,
          status:       a.status,
          is_connected: a.is_connected,
        })),
      },
    });
  } catch (err) {
    console.error('❌ getSenderStats ERROR:', err);
    res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
  }
};

exports.addSender = async (req, res) => {
  try {
    const { email, type = 'gmail', smtp_host, smtp_port, smtp_user, smtp_pass } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    if (type === 'smtp') {
      if (!smtp_host || !smtp_user || !smtp_pass) {
        return res.status(400).json({ success: false, message: 'smtp_host, smtp_user, and smtp_pass are required for SMTP accounts' });
      }
      await pool.query(
        `INSERT INTO sender_accounts (email, type, smtp_host, smtp_port, smtp_user, smtp_pass, is_connected, status)
         VALUES (?, 'smtp', ?, ?, ?, ?, 1, 'active')
         ON DUPLICATE KEY UPDATE
           type = 'smtp', smtp_host = VALUES(smtp_host), smtp_port = VALUES(smtp_port),
           smtp_user = VALUES(smtp_user), smtp_pass = VALUES(smtp_pass),
           is_connected = 1, status = 'active', updated_at = NOW()`,
        [email, smtp_host, parseInt(smtp_port) || 465, smtp_user, smtp_pass]
      );
    } else {
      await pool.query(
        `INSERT INTO sender_accounts (email, type, is_connected, status)
         VALUES (?, 'gmail', 0, 'active')
         ON DUPLICATE KEY UPDATE type = 'gmail', updated_at = NOW()`,
        [email]
      );
    }

    await getOrCreateRecord(domainFromEmail(email));
    await ensureSenderInPool(email);

    res.json({
      success: true,
      message: `Sender account (${type}) added/updated successfully`,
      data: { email, type, smtp_host: smtp_host || null, smtp_port: smtp_port || null, smtp_user: smtp_user || null },
    });
  } catch (err) {
    console.error('❌ addSender ERROR:', err);
    res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
  }
};

exports.deleteSender = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) return res.status(400).json({ success: false, message: 'Email parameter is required' });
    await pool.query('DELETE FROM sender_accounts WHERE email = ?', [email]);
    res.json({ success: true, message: 'Sender account deleted successfully' });
  } catch (err) {
    console.error('❌ deleteSender ERROR:', err);
    res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
  }
};
