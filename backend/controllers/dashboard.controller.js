const DashboardService = require('../services/dashboard.service');

/**
 * Dashboard Controller — handles dashboard API requests
 */

class DashboardController {
  /**
   * GET /api/dashboard/overview
   * Query params: company (optional)
   */
  static async getOverview(req, res) {
    try {
      const { company } = req.query;
      const companyFilter = company || null;
      const result = await DashboardService.getDashboardOverview(companyFilter);

      return res.status(200).json(result);
    } catch (error) {
      console.error('Dashboard overview error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch dashboard overview'
      });
    }
  }

  /**
   * GET /api/dashboard/recent-activity
   * Query params: company (optional)
   */
  static async getRecentActivity(req, res) {
    try {
      const { company } = req.query;
      const companyFilter = company || null;
      const data = await DashboardService.getRecentActivity(companyFilter);

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error('Recent activity error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch recent activity'
      });
    }
  }

  /**
   * GET /api/dashboard/lead-status
   * Query params: company (optional)
   */
  static async getLeadStatus(req, res) {
    try {
      const { company } = req.query;
      const companyFilter = company || null;
      const data = await DashboardService.getLeadStatusOverview(companyFilter);

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error('Lead status error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch lead status'
      });
    }
  }

  /**
   * GET /api/dashboard/automation
   * Query params: company (optional)
   */
  static async getAutomation(req, res) {
    try {
      console.log('[API] GET /api/dashboard/automation - Fetching stats');
      const { company } = req.query;
      const companyFilter = company || null;

      const data = await DashboardService.getAutomationOverview(companyFilter);
      
      console.log('[API] Automation stats retrieved successfully');

      return res.status(200).json({
        success: true,
        data: data
      });
    } catch (error) {
      console.error("Automation API Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch automation overview',
        data: {
          emails_sent_today: 0,
          replies_today: 0,
          followups_sent: 0,
          pending_followups: 0,
          failed_today: 0
        }
      });
    }
  }

  /**
   * GET /api/dashboard/companies
   * Get all companies (for company selector)
   */
  static async getCompanies(req, res) {
    try {
      const companies = await DashboardService.getAllCompanies();

      return res.status(200).json({
        success: true,
        data: companies,
      });
    } catch (error) {
      console.error('Get companies error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch companies'
      });
    }
  }

  /**
   * GET /api/dashboard
   * Returns top-level summary metrics
   */
  static async getDashboard(req, res) {
    try {
      const metrics = await DashboardService.getSummaryMetrics();
      return res.status(200).json({
        success: true,
        data: metrics
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error'
      });
    }
  }
}

module.exports = DashboardController;
