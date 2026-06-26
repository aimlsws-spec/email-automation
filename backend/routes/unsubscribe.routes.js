'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const { Readable } = require('stream');

const {
  addUnsubscribe, importBulk, removeById,
  list, getStats, getTrend, getByDomain,
} = require('../services/unsubscribe.service');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) return cb(null, true);
    cb(new Error('Only CSV files are accepted'));
  },
});

// GET /api/unsubscribed/stats
router.get('/api/unsubscribed/stats', async (req, res) => {
  try {
    const data = await getStats();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/unsubscribed/trend?days=30
router.get('/api/unsubscribed/trend', async (req, res) => {
  try {
    const days = Math.min(365, Math.max(7, parseInt(req.query.days) || 30));
    const data = await getTrend(days);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/unsubscribed/by-domain
router.get('/api/unsubscribed/by-domain', async (req, res) => {
  try {
    const data = await getByDomain();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/unsubscribed/export
router.get('/api/unsubscribed/export', async (req, res) => {
  try {
    const { rows } = await list({ page: 1, limit: 100000 });
    const headers = ['id', 'email', 'name', 'campaign_id', 'sender_email', 'domain', 'source', 'reason', 'unsubscribed_at'];

    const escape = v => {
      const s = v == null ? '' : String(v).replace(/"/g, '""');
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s;
    };

    const csvLines = [
      headers.join(','),
      ...rows.map(r => headers.map(h => escape(r[h])).join(',')),
    ];

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="unsubscribed_${Date.now()}.csv"`);
    res.send(csvLines.join('\n'));
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/unsubscribed?page=1&limit=50&search=&domain=&startDate=&endDate=
router.get('/api/unsubscribed', async (req, res) => {
  try {
    const { page = 1, limit = 50, search = '', domain = '', startDate = '', endDate = '' } = req.query;
    const result = await list({
      page:  Math.max(1, parseInt(page)  || 1),
      limit: Math.min(200, parseInt(limit) || 50),
      search, domain, startDate, endDate,
    });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/unsubscribed/manual
router.post('/api/unsubscribed/manual', async (req, res) => {
  try {
    const { email, name, reason } = req.body;
    if (!email || !email.includes('@'))
      return res.status(400).json({ success: false, message: 'Valid email is required' });
    const result = await addUnsubscribe({ email, name: name || null, reason: reason || null, source: 'manual' });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/unsubscribed/import  (multipart/form-data, field: file)
router.post('/api/unsubscribed/import', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'CSV file required (field: file)' });

    const records = await new Promise((resolve, reject) => {
      const results = [];
      Readable.from(req.file.buffer.toString('utf8'))
        .pipe(csv())
        .on('data', row => results.push(row))
        .on('end', () => resolve(results))
        .on('error', reject);
    });

    if (records.length === 0)
      return res.status(400).json({ success: false, message: 'CSV is empty or has no valid rows' });

    const result = await importBulk(records);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/unsubscribed/:id
router.delete('/api/unsubscribed/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid id' });
    const removed = await removeById(id);
    if (!removed) return res.status(404).json({ success: false, message: 'Record not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
