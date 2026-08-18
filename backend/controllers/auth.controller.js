const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_EXPIRES_IN = '7d';
const RESET_TOKEN_EXPIRY = 60 * 60 * 1000;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 10;

const loginAttempts = new Map();

function getRateLimitInfo(key) {
  const now = Date.now();
  const record = loginAttempts.get(key);
  if (!record || now - record.windowStart > RATE_LIMIT_WINDOW) {
    return { count: 0, windowStart: now };
  }
  return record;
}

function checkRateLimit(key) {
  const record = getRateLimitInfo(key);
  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }
  record.count++;
  loginAttempts.set(key, record);
  return true;
}

class AuthController {
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
      }
      if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      }

      const existing = await pool.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ success: false, message: 'An account with this email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name.trim(), email.toLowerCase().trim(), hashedPassword]
      );

      res.status(201).json({ success: true, message: 'Account created successfully' });
    } catch (err) {
      console.error('[AUTH] Register error:', err.message);
      res.status(500).json({ success: false, message: 'Server error during registration' });
    }
  }

  static async login(req, res) {
    try {
      const { email, password, rememberMe } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
      }

      const ip = req.ip || req.connection?.remoteAddress || 'unknown';
      if (!checkRateLimit(`login:${ip}`)) {
        return res.status(429).json({ success: false, message: 'Too many login attempts. Please try again later.' });
      }

      const userResult = await pool.query(
        'SELECT id, name, email, password, created_at FROM users WHERE email = ?',
        [email.toLowerCase().trim()]
      );
      if (userResult.rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const user = userResult.rows[0];
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { user_id: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: rememberMe ? '30d' : JWT_EXPIRES_IN }
      );

      res.json({
        success: true,
        authToken: token,
        responsedata: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at,
        },
      });
    } catch (err) {
      console.error('[AUTH] Login error:', err.message);
      res.status(500).json({ success: false, message: 'Server error during login' });
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
      }

      const userResult = await pool.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
      if (userResult.rows.length > 0) {
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY);

        await pool.query(
          'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
          [userResult.rows[0].id, token, expiresAt]
        );

        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
        console.log(`[AUTH] Password reset URL for ${email}: ${resetUrl}`);
      }

      res.json({ success: true, message: 'If an account with this email exists, a password reset link has been sent.' });
    } catch (err) {
      console.error('[AUTH] Forgot password error:', err.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        return res.status(400).json({ success: false, message: 'Token and new password are required' });
      }
      if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
      }

      const tokenResult = await pool.query(
        'SELECT user_id, expires_at FROM password_reset_tokens WHERE token = ? AND used = 0',
        [token]
      );
      if (tokenResult.rows.length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
      }

      const resetRecord = tokenResult.rows[0];
      if (new Date(resetRecord.expires_at) < new Date()) {
        return res.status(400).json({ success: false, message: 'Reset token has expired' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, resetRecord.user_id]);
      await pool.query('UPDATE password_reset_tokens SET used = 1 WHERE token = ?', [token]);

      res.json({ success: true, message: 'Password reset successful' });
    } catch (err) {
      console.error('[AUTH] Reset password error:', err.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  static async getProfile(req, res) {
    try {
      const userResult = await pool.query(
        'SELECT id, name, email, created_at FROM users WHERE id = ?',
        [req.user.id]
      );
      if (userResult.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.json({ success: true, responsedata: userResult.rows[0] });
    } catch (err) {
      console.error('[AUTH] Profile error:', err.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
}

module.exports = AuthController;
