'use strict';

const pool = require('../db');

// ─── GET /api/queue/stats ─────────────────────────────────────────────────────
async function getStats(req, res) {
  try {
    const [queueCounts, senderCounts, nextSched, oldestPending, followupCounts, failedFollowups, retryPending] = await Promise.all([
      // Email queue status breakdown — JOIN campaigns so NULL sender_email falls back
      // to c.active_sender (the column the queue worker actually uses)
      pool.query(`
        SELECT
          SUM(CASE WHEN eq.status = 'pending'    THEN 1 ELSE 0 END) AS pending_emails,
          SUM(CASE WHEN eq.status = 'processing' THEN 1 ELSE 0 END) AS processing_emails,
          SUM(CASE WHEN eq.status = 'failed'     THEN 1 ELSE 0 END) AS failed_emails,
          COUNT(DISTINCT CASE WHEN eq.status = 'pending'
            THEN COALESCE(eq.sender_email, c.active_sender, c.sender_email) END) AS pending_senders,
          COUNT(DISTINCT CASE WHEN eq.status = 'processing' THEN eq.campaign_id END) AS active_campaigns
        FROM email_queue eq
        LEFT JOIN campaigns c ON eq.campaign_id = c.id
        WHERE eq.status IN ('pending', 'processing', 'failed')
      `),

      // Distinct sender count for processing
      pool.query(`
        SELECT COUNT(DISTINCT sender_email) AS processing_senders
        FROM email_queue WHERE status = 'processing'
      `),

      // Next scheduled email time
      pool.query(`
        SELECT MIN(scheduled_at) AS next_scheduled
        FROM email_queue
        WHERE status = 'pending' AND scheduled_at > NOW()
      `),

      // Oldest pending email
      pool.query(`
        SELECT MIN(created_at) AS oldest_queued
        FROM email_queue WHERE status = 'pending'
      `),

      // Follow-up queue counts from leads table
      pool.query(`
        SELECT
          SUM(CASE WHEN followup_enabled = 1 AND next_follow_up_at IS NOT NULL AND follow_up_step < 7
                        AND has_replied = 0 AND is_bounced = 0
                        AND (unsubscribed = 0 OR unsubscribed IS NULL)
               THEN 1 ELSE 0 END) AS pending_followups,
          SUM(CASE WHEN followup_enabled = 1 AND next_follow_up_at IS NOT NULL
                        AND DATE(next_follow_up_at) = CURDATE()
                        AND has_replied = 0 AND is_bounced = 0
                        AND (unsubscribed = 0 OR unsubscribed IS NULL)
               THEN 1 ELSE 0 END) AS due_today_followups,
          SUM(CASE WHEN followup_enabled = 1 AND next_follow_up_at IS NOT NULL
                        AND next_follow_up_at < NOW()
                        AND has_replied = 0 AND is_bounced = 0
                        AND (unsubscribed = 0 OR unsubscribed IS NULL)
               THEN 1 ELSE 0 END) AS overdue_followups
        FROM leads
      `),

      // Failed follow-ups (last 7 days)
      pool.query(`
        SELECT COUNT(*) AS failed_followups
        FROM followup_logs
        WHERE status = 'failed'
          AND sent_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      `),

      // Retry-eligible: failed with < 3 attempts
      pool.query(`
        SELECT COUNT(*) AS retry_pending
        FROM email_queue
        WHERE status = 'failed' AND attempts < 3
      `),
    ]);

    const q  = queueCounts.rows[0]  || {};
    const ns = nextSched.rows[0]    || {};
    const op = oldestPending.rows[0] || {};
    const fu = followupCounts.rows[0] || {};
    const ff = failedFollowups.rows[0] || {};
    const rp = retryPending.rows[0]   || {};

    const payload = {
      pendingEmails:     parseInt(q.pending_emails)    || 0,
      processingEmails:  parseInt(q.processing_emails) || 0,
      failedEmails:      parseInt(q.failed_emails)     || 0,
      pendingSenders:    parseInt(q.pending_senders)   || 0,
      activeCampaigns:   parseInt(q.active_campaigns)  || 0,
      nextScheduled:     ns.next_scheduled || null,
      oldestQueued:      op.oldest_queued  || null,
      pendingFollowups:  parseInt(fu.pending_followups)    || 0,
      dueTodayFollowups: parseInt(fu.due_today_followups)  || 0,
      overdueFollowups:  parseInt(fu.overdue_followups)    || 0,
      failedFollowups:   parseInt(ff.failed_followups)     || 0,
      retryPending:      parseInt(rp.retry_pending)        || 0,
    };

    console.log('[QUEUE_STATS]');
    console.log(`  Pending:    ${payload.pendingEmails}`);
    console.log(`  Processing: ${payload.processingEmails}`);
    console.log(`  Failed:     ${payload.failedEmails}`);
    console.log(`  Followups:  ${payload.pendingFollowups} (today: ${payload.dueTodayFollowups}, overdue: ${payload.overdueFollowups})`);

    res.json({ success: true, data: payload });
  } catch (err) {
    console.error('[QUEUE_MONITOR] getStats error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

// ─── GET /api/queue/senders ───────────────────────────────────────────────────
async function getSenders(req, res) {
  try {
    // Use COALESCE so that rows where email_queue.sender_email is NULL fall back
    // to the campaign's active_sender (the field the queue worker reads at send time)
    const { rows: queueRows } = await pool.query(`
      SELECT
        COALESCE(eq.sender_email, c.active_sender, c.sender_email) AS eff_sender,
        SUM(CASE WHEN eq.status = 'pending'    THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN eq.status = 'processing' THEN 1 ELSE 0 END) AS processing,
        SUM(CASE WHEN eq.status = 'failed'     THEN 1 ELSE 0 END) AS failed,
        MIN(CASE WHEN eq.status = 'pending' AND eq.scheduled_at > NOW()
            THEN eq.scheduled_at END) AS next_scheduled
      FROM email_queue eq
      LEFT JOIN campaigns c ON eq.campaign_id = c.id
      WHERE eq.status IN ('pending', 'processing', 'failed')
        AND COALESCE(eq.sender_email, c.active_sender, c.sender_email) IS NOT NULL
        AND COALESCE(eq.sender_email, c.active_sender, c.sender_email) != ''
      GROUP BY eff_sender
      ORDER BY pending DESC
    `);

    // Enrich with sent-today counts from email_logs
    const { rows: sentTodayRows } = await pool.query(`
      SELECT sender_email, COUNT(*) AS sent_today
      FROM email_logs
      WHERE DATE(sent_at) = CURDATE()
        AND sender_email IS NOT NULL AND sender_email != ''
      GROUP BY sender_email
    `);

    const sentMap = {};
    for (const r of sentTodayRows) sentMap[r.sender_email] = parseInt(r.sent_today) || 0;

    const senders = queueRows.map(r => ({
      senderEmail:   r.eff_sender,
      pending:       parseInt(r.pending)    || 0,
      processing:    parseInt(r.processing) || 0,
      failed:        parseInt(r.failed)     || 0,
      sentToday:     sentMap[r.eff_sender]  || 0,
      nextScheduled: r.next_scheduled       || null,
    }));

    // Include senders active in email_logs today but not currently queued
    for (const [email, sentToday] of Object.entries(sentMap)) {
      if (!senders.find(s => s.senderEmail === email)) {
        senders.push({ senderEmail: email, pending: 0, processing: 0, failed: 0, sentToday, nextScheduled: null });
      }
    }

    res.json({ success: true, data: senders });
  } catch (err) {
    console.error('[QUEUE_MONITOR] getSenders error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

// ─── GET /api/queue/list ──────────────────────────────────────────────────────
async function getList(req, res) {
  try {
    const {
      page     = 1,
      limit    = 50,
      status,
      sender,
      campaign,
      type,
      dateFrom,
      dateTo,
      search,
    } = req.query;

    const offset = (Math.max(1, parseInt(page)) - 1) * Math.min(200, parseInt(limit));
    const pageSize = Math.min(200, parseInt(limit) || 50);

    const conditions = [];
    const params     = [];

    // effective_sender resolves NULL eq.sender_email via the campaign's active_sender
    const effSender = "COALESCE(eq.sender_email, c.active_sender, c.sender_email)";

    if (status)   { conditions.push('eq.status = ?');              params.push(status); }
    if (sender)   { conditions.push(`${effSender} = ?`);           params.push(sender); }
    if (campaign) { conditions.push('c.name LIKE ?');              params.push(`%${campaign}%`); }
    if (type)     { conditions.push('eq.type = ?');                params.push(type); }
    if (dateFrom) { conditions.push('eq.created_at >= ?');         params.push(dateFrom); }
    if (dateTo)   { conditions.push('eq.created_at <= ?');         params.push(dateTo + ' 23:59:59'); }
    if (search) {
      conditions.push(`(eq.lead_email LIKE ? OR ${effSender} LIKE ? OR c.name LIKE ?)`);
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    const [{ rows: items }, { rows: countRow }] = await Promise.all([
      pool.query(`
        SELECT
          eq.id,
          c.name AS campaign_name,
          COALESCE(eq.sender_email, c.active_sender, c.sender_email) AS sender_email,
          eq.lead_email AS recipient_email,
          eq.type       AS queue_type,
          eq.status,
          eq.created_at AS queued_at,
          eq.scheduled_at,
          eq.attempts,
          eq.updated_at AS last_attempt,
          eq.last_error,
          eq.campaign_id
        FROM email_queue eq
        LEFT JOIN campaigns c ON eq.campaign_id = c.id
        ${where}
        ORDER BY eq.created_at DESC
        LIMIT ? OFFSET ?
      `, [...params, pageSize, offset]),

      pool.query(`
        SELECT COUNT(*) AS total
        FROM email_queue eq
        LEFT JOIN campaigns c ON eq.campaign_id = c.id
        ${where}
      `, params),
    ]);

    res.json({
      success: true,
      data: items,
      total:   parseInt(countRow[0]?.total) || 0,
      page:    parseInt(page),
      limit:   pageSize,
    });
  } catch (err) {
    console.error('[QUEUE_MONITOR] getList error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

// ─── GET /api/followup-queue/list ─────────────────────────────────────────────
async function getFollowupList(req, res) {
  try {
    const {
      page     = 1,
      limit    = 50,
      status,
      sender,
      campaign,
      dateFrom,
      dateTo,
      search,
    } = req.query;

    const offset   = (Math.max(1, parseInt(page)) - 1) * Math.min(200, parseInt(limit));
    const pageSize = Math.min(200, parseInt(limit) || 50);

    const conditions = [
      'l.next_follow_up_at IS NOT NULL',
      'l.has_replied = 0',
      'l.is_bounced = 0',
      '(l.unsubscribed = 0 OR l.unsubscribed IS NULL)',
      '(l.followup_enabled = 1 OR l.followup_enabled IS NULL)',
    ];
    const params = [];

    if (sender)   { conditions.push('l.sender_email = ?');   params.push(sender); }
    if (campaign) { conditions.push('c.name LIKE ?');         params.push(`%${campaign}%`); }
    if (dateFrom) { conditions.push('l.next_follow_up_at >= ?'); params.push(dateFrom); }
    if (dateTo)   { conditions.push('l.next_follow_up_at <= ?'); params.push(dateTo + ' 23:59:59'); }
    if (search) {
      conditions.push('(l.email LIKE ? OR l.name LIKE ? OR c.name LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Status filter maps to computed column logic
    if (status === 'overdue')   conditions.push('l.next_follow_up_at < NOW()');
    if (status === 'due_today') conditions.push('DATE(l.next_follow_up_at) = CURDATE()');
    if (status === 'pending')   conditions.push('l.next_follow_up_at > NOW()');

    const where = 'WHERE ' + conditions.join(' AND ');

    const [{ rows: items }, { rows: countRow }] = await Promise.all([
      pool.query(`
        SELECT
          l.email           AS lead_email,
          l.name            AS lead_name,
          l.follow_up_step  AS followup_stage,
          l.next_follow_up_at AS scheduled_time,
          l.sender_email,
          l.last_sent_at,
          l.campaign_id,
          c.name            AS campaign_name,
          DATEDIFF(NOW(), l.last_sent_at) AS days_since_last_email,
          CASE
            WHEN l.next_follow_up_at < NOW()             THEN 'Overdue'
            WHEN DATE(l.next_follow_up_at) = CURDATE()   THEN 'Due Today'
            ELSE 'Pending'
          END AS fu_status
        FROM leads l
        LEFT JOIN campaigns c ON l.campaign_id = c.id
        ${where}
        ORDER BY l.next_follow_up_at ASC
        LIMIT ? OFFSET ?
      `, [...params, pageSize, offset]),

      pool.query(`
        SELECT COUNT(*) AS total
        FROM leads l
        LEFT JOIN campaigns c ON l.campaign_id = c.id
        ${where}
      `, params),
    ]);

    res.json({
      success: true,
      data: items,
      total:  parseInt(countRow[0]?.total) || 0,
      page:   parseInt(page),
      limit:  pageSize,
    });
  } catch (err) {
    console.error('[QUEUE_MONITOR] getFollowupList error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

// ─── DELETE /api/queue/items ──────────────────────────────────────────────────
async function deleteQueueItems(req, res) {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'ids array required' });
    }
    const safeIds = ids.map(id => parseInt(id)).filter(id => !isNaN(id));
    if (safeIds.length === 0) {
      return res.status(400).json({ success: false, error: 'No valid IDs provided' });
    }
    const placeholders = safeIds.map(() => '?').join(',');
    const { rowCount } = await pool.query(
      `DELETE FROM email_queue WHERE id IN (${placeholders}) AND status IN ('pending', 'failed')`,
      safeIds
    );
    console.log(`[QUEUE_DELETE] Deleted ${rowCount} queue item(s)`);
    res.json({ success: true, deleted: rowCount });
  } catch (err) {
    console.error('[QUEUE_DELETE] error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

// ─── DELETE /api/followup-queue/items ─────────────────────────────────────────
async function deleteFollowupItems(req, res) {
  try {
    const { items } = req.body; // [{ lead_email, campaign_id }]
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'items array required' });
    }
    let deleted = 0;
    for (const item of items) {
      if (!item.lead_email || !item.campaign_id) continue;
      const cid = parseInt(item.campaign_id);
      await Promise.all([
        // Cancel on the lead record
        pool.query(
          `UPDATE leads SET next_follow_up_at = NULL, followup_enabled = 0,
            followup_stopped_reason = 'manually_removed'
           WHERE email = ? AND campaign_id = ?`,
          [item.lead_email, cid]
        ),
        // Remove pending rows from the followup_queue scheduling table
        pool.query(
          `DELETE FROM followup_queue
           WHERE lead_email = ? AND campaign_id = ? AND status IN ('pending', 'failed')`,
          [item.lead_email, cid]
        ),
        // Remove any queued follow-up emails already sitting in email_queue
        pool.query(
          `DELETE FROM email_queue
           WHERE lead_email = ? AND campaign_id = ? AND status IN ('pending', 'failed')
             AND type LIKE 'follow_up%'`,
          [item.lead_email, cid]
        ),
      ]);
      deleted++;
    }
    console.log(`[FOLLOWUP_DELETE] Cancelled follow-ups for ${deleted} lead(s)`);
    res.json({ success: true, deleted });
  } catch (err) {
    console.error('[FOLLOWUP_DELETE] error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { getStats, getSenders, getList, getFollowupList, deleteQueueItems, deleteFollowupItems };
