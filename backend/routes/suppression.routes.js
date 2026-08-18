const express = require('express');
const router = express.Router();
const pool = require('../db');
const { revalidateEmail } = require('../services/suppression.service');

// GET /api/suppressions - List all suppressions with filters, pagination and stats
router.get('/api/suppressions', async (req, res) => {
  try {
    const { search, reason, smtpCode, campaignId, senderAccount, startDate, endDate, page = 1, limit = 50 } = req.query;
    
    let query = `SELECT * FROM email_suppressions WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) as total FROM email_suppressions WHERE 1=1`;
    let params = [];

    if (search) {
      query += ` AND email LIKE ?`;
      countQuery += ` AND email LIKE ?`;
      params.push(`%${search}%`);
    }
    if (reason) {
      query += ` AND suppression_reason = ?`;
      countQuery += ` AND suppression_reason = ?`;
      params.push(reason);
    }
    if (smtpCode) {
      query += ` AND smtp_code = ?`;
      countQuery += ` AND smtp_code = ?`;
      params.push(smtpCode);
    }
    if (campaignId) {
      query += ` AND campaign_id = ?`;
      countQuery += ` AND campaign_id = ?`;
      params.push(campaignId);
    }
    if (senderAccount) {
      query += ` AND sender_account = ?`;
      countQuery += ` AND sender_account = ?`;
      params.push(senderAccount);
    }
    if (startDate) {
      query += ` AND last_failed_at >= ?`;
      countQuery += ` AND last_failed_at >= ?`;
      params.push(startDate);
    }
    if (endDate) {
      query += ` AND last_failed_at <= ?`;
      countQuery += ` AND last_failed_at <= ?`;
      params.push(endDate);
    }

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` ORDER BY last_failed_at DESC LIMIT ? OFFSET ?`;
    const paginatedParams = [...params, parseInt(limit), offset];

    const [{ rows: data }, { rows: countResult }, { rows: statsRows }] = await Promise.all([
      pool.query(query, paginatedParams),
      pool.query(countQuery, params),
      pool.query(`
        SELECT 
          COUNT(*) as total_records,
          SUM(CASE WHEN is_suppressed = 1 THEN 1 ELSE 0 END) as active_suppressions,
          SUM(CASE WHEN bounce_type = 'Hard Bounce' AND is_suppressed = 1 THEN 1 ELSE 0 END) as hard_bounces,
          SUM(CASE WHEN is_suppressed = 0 THEN 1 ELSE 0 END) as revalidated_emails,
          COALESCE(SUM(skip_count), 0) as skipped_sends
        FROM email_suppressions
      `)
    ]);

    const s = statsRows[0] || {};
    const stats = {
      total_suppressed: Number(s.total_records) || 0,
      total_hard_bounces: Number(s.hard_bounces) || 0,
      total_skipped: Number(s.skipped_sends) || 0,
    };

    // Map DB column names to frontend-expected field names
    const mapped = data.map(row => ({
      email: row.email,
      reason: row.suppression_reason || '',
      skip_count: row.skip_count ?? 0,
      last_skipped_at: row.last_failed_at,
      added_at: row.created_at,
      smtp_code: row.smtp_code,
      failure_reason: row.failure_reason,
      campaign_id: row.campaign_id,
      sender_account: row.sender_account,
      is_suppressed: row.is_suppressed,
      status: row.status,
    }));

    res.json({
      success: true,
      data: mapped,
      stats,
      total: countResult[0].total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('[SUPPRESSION] GET /api/suppressions error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/suppressions - Manually add an email to the suppression list
router.post('/api/suppressions', async (req, res) => {
  const { email, reason } = req.body;
  if (!email) return res.status(400).json({ success: false, error: 'Email is required' });
  try {
    await pool.query(`
      INSERT INTO email_suppressions
        (email, status, suppression_reason, bounce_type, smtp_code, failure_reason, first_failed_at, last_failed_at, failure_count, is_suppressed)
      VALUES (?, 'Invalid', ?, 'Manual', '', ?, NOW(), NOW(), 1, 1)
      ON DUPLICATE KEY UPDATE
        suppression_reason = VALUES(suppression_reason),
        failure_reason     = VALUES(failure_reason),
        last_failed_at     = NOW(),
        failure_count      = failure_count + 1,
        is_suppressed      = 1,
        status             = 'Invalid'
    `, [email.trim().toLowerCase(), reason || 'Manual', reason || 'Manually added']);
    res.json({ success: true, message: 'Email added to suppression list' });
  } catch (error) {
    console.error('[SUPPRESSION] POST /api/suppressions error:', error.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/suppressions/revalidate - Revalidate a single email
router.post('/api/suppressions/revalidate', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email required' });
  
  try {
    await revalidateEmail(email);
    res.json({ success: true, message: 'Email revalidated successfully' });
  } catch (error) {
    console.error('[SUPPRESSION] Revalidate error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/suppressions/revalidate-bulk - Bulk revalidate
router.post('/api/suppressions/revalidate-bulk', async (req, res) => {
  const { emails } = req.body;
  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ success: false, message: 'Emails array required' });
  }

  try {
    // Generate ?, ?, ? for IN clause
    const placeholders = emails.map(() => '?').join(',');
    await pool.query(`UPDATE email_suppressions SET is_suppressed = 0, status = 'Active', revalidated_at = NOW() WHERE email IN (${placeholders})`, emails);
    res.json({ success: true, message: `${emails.length} emails revalidated successfully` });
  } catch (error) {
    console.error('[SUPPRESSION] Bulk revalidate error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/suppressions/:email - Delete a suppression record
router.delete('/api/suppressions/:email', async (req, res) => {
  const { email } = req.params;
  try {
    await pool.query(`DELETE FROM email_suppressions WHERE email = ?`, [email]);
    res.json({ success: true, message: 'Suppression record deleted' });
  } catch (error) {
    console.error('[SUPPRESSION] Delete error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/suppressions/stats - Get reporting stats
router.get('/api/suppressions/stats', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        COUNT(*) as total_records,
        SUM(CASE WHEN is_suppressed = 1 THEN 1 ELSE 0 END) as active_suppressions,
        SUM(CASE WHEN bounce_type = 'Hard Bounce' AND is_suppressed = 1 THEN 1 ELSE 0 END) as hard_bounces,
        SUM(CASE WHEN is_suppressed = 0 THEN 1 ELSE 0 END) as revalidated_emails,
        SUM(skip_count) as skipped_sends
      FROM email_suppressions
    `);
    
    const stats = rows[0] || {
      total_records: 0,
      active_suppressions: 0,
      hard_bounces: 0,
      revalidated_emails: 0,
      skipped_sends: 0
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('[SUPPRESSION] Stats error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
