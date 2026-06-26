const express = require('express');
const router = express.Router();
const pool = require('../db');
const { renderTemplate, usePreviewSafeImages } = require('../utils/templateRenderer');

// Ensure template_type column exists (idempotent)
pool.query(`ALTER TABLE email_templates ADD COLUMN template_type VARCHAR(10) NOT NULL DEFAULT 'html'`).catch(() => {});

// GET /api/templates
router.get('/api/templates', async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT id, name, template_type, created_at, updated_at FROM email_templates ORDER BY updated_at DESC`);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('[GET /api/templates] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/templates/:id
router.get('/api/templates/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM email_templates WHERE id = ?`, [req.params.id]);
    if (!rows[0]) return res.status(404).json({ success: false, error: 'Template not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('[GET /api/templates/:id] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/templates
router.post('/api/templates', async (req, res) => {
  try {
    const { name, html_content, template_type } = req.body;
    if (!name || !html_content) return res.status(400).json({ success: false, error: 'name and html_content required' });
    const type = template_type === 'text' ? 'text' : 'html';
    // Only sanitize scripts for HTML templates; plain text needs no sanitization
    const safe = type === 'html'
      ? String(html_content).replace(/<script[\s\S]*?<\/script>/gi, '')
      : String(html_content);
    await pool.query(
      `INSERT INTO email_templates (name, html_content, template_type) VALUES (?, ?, ?)`,
      [name.trim(), safe, type]
    );
    const { rows: idRows } = await pool.query(`SELECT LAST_INSERT_ID() AS insertId`);
    const newId = idRows[0]?.insertId;
    if (!newId) return res.status(500).json({ success: false, error: 'Insert failed: could not retrieve new ID' });
    const { rows } = await pool.query(`SELECT * FROM email_templates WHERE id = ?`, [newId]);
    if (!rows[0]) return res.status(500).json({ success: false, error: 'Template created but could not be retrieved' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('[POST /api/templates] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/templates/:id
router.put('/api/templates/:id', async (req, res) => {
  try {
    const { name, html_content, template_type } = req.body;
    if (!name || !html_content) return res.status(400).json({ success: false, error: 'name and html_content required' });
    const type = template_type === 'text' ? 'text' : 'html';
    const safe = type === 'html'
      ? String(html_content).replace(/<script[\s\S]*?<\/script>/gi, '')
      : String(html_content);
    await pool.query(
      `UPDATE email_templates SET name = ?, html_content = ?, template_type = ?, updated_at = NOW() WHERE id = ?`,
      [name.trim(), safe, type, req.params.id]
    );
    const { rows } = await pool.query(`SELECT * FROM email_templates WHERE id = ?`, [req.params.id]);
    if (!rows[0]) return res.status(404).json({ success: false, error: 'Template not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('[PUT /api/templates/:id] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/templates/:id
router.delete('/api/templates/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT name FROM email_templates WHERE id = ?`, [req.params.id]);
    if (!rows[0]) return res.status(404).json({ success: false, error: 'Template not found' });
    const PROTECTED = ['final templete', 'FOLLOW UP (VIRALKAR)', 'FOLLOW UP 2 (VIRALKAR)'];
    if (PROTECTED.includes(rows[0].name)) {
      return res.status(403).json({ success: false, error: `Template "${rows[0].name}" is protected and cannot be deleted.` });
    }
    await pool.query(`DELETE FROM email_templates WHERE id = ?`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/templates/:id] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/template-preview
router.get('/api/template-preview', async (req, res) => {
  try {
    const { id } = req.query;
    let lead;

    if (id) {
      const { rows } = await pool.query(`SELECT * FROM leads WHERE email = ?`, [id]);
      lead = rows[0];
    } else {
      // Latest pending lead, fallback to any lead
      const { rows } = await pool.query(`
        SELECT * FROM leads
        ORDER BY CASE WHEN status = 'Pending' THEN 0 ELSE 1 END, email
        LIMIT 1
      `);
      lead = rows[0];
    }

    if (!lead) {
      return res.send('<p style="font-family:sans-serif;padding:20px;color:#666">No leads available for preview. Upload a sheet first.</p>');
    }

    const html = usePreviewSafeImages(renderTemplate(lead));
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    res.status(500).send(`<p style="color:red">${err.message}</p>`);
  }
});

module.exports = router;
