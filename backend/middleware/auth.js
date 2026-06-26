/**
 * JWT Middleware for Dashboard Authentication
 * 
 * Usage:
 * 1. Install: npm install jsonwebtoken
 * 2. Add to server.js:
 *    const authMiddleware = require('./middleware/auth');
 *    app.use('/api/dashboard', authMiddleware);
 * 3. Update service calls to use: getDashboardOverview(req.user.company_id)
 */

const jwt = require('jsonwebtoken');

/**
 * Verify JWT token and extract company_id
 * Prevents cross-company data access
 */
function authMiddleware(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Missing authorization header',
      });
    }

    const token = authHeader.split(' ')[1]; // "Bearer <token>"
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token format',
      });
    }

    // Verify token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT_SECRET not configured');
    const decoded = jwt.verify(token, jwtSecret);

    // Attach user info to request
    req.user = {
      id: decoded.user_id,
      company_id: decoded.company_id,
      email: decoded.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
      message: err.message,
    });
  }
}

module.exports = authMiddleware;

/**
 * ─────────────────────────────────────────────────────────
 * UPDATED SERVER.JS USAGE
 * ─────────────────────────────────────────────────────────
 * 
 * const authMiddleware = require('./middleware/auth');
 * const DashboardController = require('./controllers/dashboard.controller');
 * 
 * // Apply auth to dashboard routes
 * app.get('/api/dashboard/overview', authMiddleware, DashboardController.getOverview);
 * app.get('/api/dashboard/recent-activity', authMiddleware, DashboardController.getRecentActivity);
 * app.get('/api/dashboard/lead-status', authMiddleware, DashboardController.getLeadStatus);
 * app.get('/api/dashboard/automation', authMiddleware, DashboardController.getAutomation);
 * 
 * ─────────────────────────────────────────────────────────
 */

/**
 * ─────────────────────────────────────────────────────────
 * UPDATED DASHBOARD CONTROLLER
 * ─────────────────────────────────────────────────────────
 * 
 * static async getOverview(req, res) {
 *   try {
 *     // Use company_id from JWT instead of query param
 *     const companyId = req.user.company_id;
 *
 *     const result = await DashboardService.getDashboardOverview(companyId);
 *     return res.status(200).json(result);
 *   } catch (error) {
 *     console.error('Dashboard overview error:', error);
 *     return res.status(500).json({
 *       success: false,
 *       error: 'Failed to fetch dashboard overview',
 *       message: error.message,
 *     });
 *   }
 * }
 * 
 * ─────────────────────────────────────────────────────────
 */

/**
 * ─────────────────────────────────────────────────────────
 * TOKEN EXAMPLE
 * ─────────────────────────────────────────────────────────
 * 
 * {
 *   "user_id": "uuid-1234",
 *   "company_id": "uuid-5678",
 *   "email": "user@company.com",
 *   "iat": 1234567890,
 *   "exp": 1234571490
 * }
 * 
 * ─────────────────────────────────────────────────────────
 */

/**
 * ─────────────────────────────────────────────────────────
 * FRONTEND USAGE (React)
 * ─────────────────────────────────────────────────────────
 * 
 * async function fetchDashboard() {
 *   const token = localStorage.getItem('auth_token');
 *
 *   const response = await fetch('/api/dashboard/overview', {
 *     headers: {
 *       'Authorization': `Bearer ${token}`,
 *       'Content-Type': 'application/json',
 *     },
 *   });
 *
 *   const { data } = await response.json();
 *   return data;
 * }
 * 
 * ─────────────────────────────────────────────────────────
 */
