const pool = require('../db');

class DashboardService {
  static async getRecentActivity(userId) {
    try {
      const { rows } = await pool.query(`
        SELECT email as lead_email, name as lead_name,
          CASE WHEN reply_detected_at IS NOT NULL AND reply_detected_at != '' THEN 'replied'
               WHEN follow_up_count > 0 THEN 'followup' ELSE 'sent'
          END as action,
          COALESCE(reply_detected_at, last_sent_date) as timestamp, status
        FROM leads
        WHERE last_sent_date IS NOT NULL AND last_sent_date != '' AND user_id = ?
        ORDER BY COALESCE(reply_detected_at, last_sent_date) DESC LIMIT 10
      `, [userId]);
      return (rows || []).map(row => ({
        lead_email: row.lead_email, lead_name: row.lead_name,
        action: row.action, timestamp: row.timestamp, status: row.status,
      }));
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  }

  static async getLeadStatusOverview(userId) {
    try {
      const { rows } = await pool.query(`
        SELECT COUNT(*) AS total,
          SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pending,
          SUM(CASE WHEN status = 'Sent' THEN 1 ELSE 0 END) AS sent,
          SUM(CASE WHEN follow_up_count >= 1 AND follow_up_count < 2 THEN 1 ELSE 0 END) AS followup_1,
          SUM(CASE WHEN follow_up_count >= 2 THEN 1 ELSE 0 END) AS followup_2,
          SUM(CASE WHEN has_replied = 1 THEN 1 ELSE 0 END) AS replied,
          SUM(CASE WHEN status = 'Closed' THEN 1 ELSE 0 END) AS closed,
          SUM(CASE WHEN status = 'Failed' THEN 1 ELSE 0 END) AS failed
        FROM leads WHERE user_id = ?
      `, [userId]);
      const data = rows[0] || {};
      return {
        total: parseInt(data.total) || 0, pending: parseInt(data.pending) || 0,
        sent: parseInt(data.sent) || 0, followUp1: parseInt(data.followup_1) || 0,
        followUp2: parseInt(data.followup_2) || 0, replied: parseInt(data.replied) || 0,
        closed: parseInt(data.closed) || 0, failed: parseInt(data.failed) || 0,
        statusCounts: {
          pending: parseInt(data.pending) || 0, sent: parseInt(data.sent) || 0,
          followUp1: parseInt(data.followup_1) || 0, followUp2: parseInt(data.followup_2) || 0,
          replied: parseInt(data.replied) || 0, closed: parseInt(data.closed) || 0,
          failed: parseInt(data.failed) || 0,
        },
      };
    } catch (error) {
      console.error('Error fetching lead status overview:', error);
      throw error;
    }
  }

  static async getAutomationOverview(userId) {
    try {
      const logsRes = await pool.query(`
        SELECT SUM(CASE WHEN status IN ('sent','success') AND DATE(sent_at) = CURDATE() THEN 1 ELSE 0 END) AS emails_sent_today,
          SUM(CASE WHEN status IN ('sent','success') AND type LIKE 'follow_up_%' AND DATE(sent_at) = CURDATE() THEN 1 ELSE 0 END) AS followups_sent_today,
          SUM(CASE WHEN status = 'failed' AND DATE(sent_at) = CURDATE() THEN 1 ELSE 0 END) AS failed_today
        FROM email_logs WHERE user_id = ?
      `, [userId]);
      const leadsRes = await pool.query(`
        SELECT SUM(CASE WHEN has_replied = 1 AND DATE(last_activity_at) = CURDATE() THEN 1 ELSE 0 END) AS replies_today,
          SUM(CASE WHEN has_replied = 0 AND is_bounced = 0 AND next_follow_up_at IS NOT NULL AND next_follow_up_at > NOW() THEN 1 ELSE 0 END) AS pending_followups
        FROM leads WHERE user_id = ?
      `, [userId]);
      const clicksRes = await pool.query(`SELECT COUNT(*) AS clicks_today FROM link_clicks WHERE DATE(clicked_at) = CURDATE() AND user_id = ?`, [userId]);
      const l = logsRes.rows[0] || {};
      const r = leadsRes.rows[0] || {};
      return {
        emails_sent_today: parseInt(l.emails_sent_today) || 0,
        failed_today: parseInt(l.failed_today) || 0,
        followups_sent: parseInt(l.followups_sent_today) || 0,
        replies_today: parseInt(r.replies_today) || 0,
        pending_followups: parseInt(r.pending_followups) || 0,
        clicks_today: parseInt(clicksRes.rows[0]?.clicks_today) || 0,
      };
    } catch (error) {
      console.error('Error fetching automation overview:', error);
      throw error;
    }
  }

  static async getDashboardOverview(userId) {
    try {
      const [recentActivity, leadStatus, automation] = await Promise.all([
        this.getRecentActivity(userId),
        this.getLeadStatusOverview(userId),
        this.getAutomationOverview(userId),
      ]);
      return { success: true, data: { recent_activity: recentActivity, lead_stats: leadStatus, automation_stats: automation } };
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      throw error;
    }
  }

  static async getAllCompanies(userId) {
    try {
      const { rows } = await pool.query(`
        SELECT DISTINCT company FROM leads
        WHERE company IS NOT NULL AND company != '' AND user_id = ?
        ORDER BY company ASC
      `, [userId]);
      return (rows || []).map(row => row.company);
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }

  static async getSummaryMetrics(userId) {
    try {
      const [todayRes, yesterdayRes, activeCampRes, totalLeadsRes, sentTotalRes, replyCountRes, clickCountRes] = await Promise.all([
        pool.query(`SELECT COUNT(*) AS count FROM email_logs WHERE status IN ('sent','success') AND DATE(sent_at) = CURDATE() AND user_id = ?`, [userId]),
        pool.query(`SELECT COUNT(*) AS count FROM email_logs WHERE status IN ('sent','success') AND DATE(sent_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY) AND user_id = ?`, [userId]),
        pool.query(`SELECT COUNT(*) AS count FROM campaigns WHERE LOWER(status) = 'running' AND user_id = ?`, [userId]),
        pool.query(`SELECT COUNT(*) AS count FROM leads WHERE user_id = ?`, [userId]),
        pool.query(`SELECT COUNT(*) AS count FROM email_logs WHERE status IN ('sent','success') AND user_id = ?`, [userId]),
        pool.query(`SELECT COUNT(*) AS count FROM leads WHERE has_replied = 1 AND user_id = ?`, [userId]),
        pool.query(`SELECT COUNT(*) AS count FROM link_clicks WHERE user_id = ?`, [userId]),
      ]);
      const totalSent = parseInt(sentTotalRes.rows[0]?.count) || 0;
      const replies = parseInt(replyCountRes.rows[0]?.count) || 0;
      return {
        emailsSentToday: parseInt(todayRes.rows[0]?.count) || 0,
        emailsSentYesterday: parseInt(yesterdayRes.rows[0]?.count) || 0,
        activeCampaigns: parseInt(activeCampRes.rows[0]?.count) || 0,
        totalLeads: parseInt(totalLeadsRes.rows[0]?.count) || 0,
        replyRate: totalSent > 0 ? parseFloat(((replies / totalSent) * 100).toFixed(1)) : 0,
        totalClicks: parseInt(clickCountRes.rows[0]?.count) || 0,
        convertedLeads: replies,
        replyCount: replies,
        emailsSentTotal: totalSent,
      };
    } catch (error) {
      console.error('Error fetching summary metrics:', error);
      throw error;
    }
  }
}

module.exports = DashboardService;
