const DashboardService = require('../services/dashboard.service');

class DashboardController {
  static async getOverview(req, res) {
    try {
      const result = await DashboardService.getDashboardOverview(req.user.id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message || 'Failed to fetch dashboard overview' });
    }
  }

  static async getRecentActivity(req, res) {
    try {
      const data = await DashboardService.getRecentActivity(req.user.id);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message || 'Failed to fetch recent activity' });
    }
  }

  static async getLeadStatus(req, res) {
    try {
      const data = await DashboardService.getLeadStatusOverview(req.user.id);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message || 'Failed to fetch lead status' });
    }
  }

  static async getAutomation(req, res) {
    try {
      const data = await DashboardService.getAutomationOverview(req.user.id);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({
        success: false, message: error.message || 'Failed to fetch automation overview',
        data: { emails_sent_today: 0, replies_today: 0, followups_sent: 0, pending_followups: 0, failed_today: 0 },
      });
    }
  }

  static async getCompanies(req, res) {
    try {
      const companies = await DashboardService.getAllCompanies(req.user.id);
      return res.status(200).json({ success: true, data: companies });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message || 'Failed to fetch companies' });
    }
  }

  static async getDashboard(req, res) {
    try {
      const metrics = await DashboardService.getSummaryMetrics(req.user.id);
      return res.status(200).json({ success: true, data: metrics });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
  }
}

module.exports = DashboardController;
