const express = require('express');
const router = express.Router();
const pool = require('../db');
const { renderTemplate, usePreviewSafeImages } = require('../utils/templateRenderer');

const uid = (req) => req.user.id;

const PROTECTED_TEMPLATES = ['final templete', 'FOLLOW UP (VIRALKAR)', 'FOLLOW UP 2 (VIRALKAR)'];

router.get('/api/templates', async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT id, name, template_type, created_at, updated_at FROM email_templates WHERE user_id = ? ORDER BY updated_at DESC`, [uid(req)]);
    const data = rows.map((row) => ({ ...row, is_protected: PROTECTED_TEMPLATES.includes(row.name) }));
    res.json({ success: true, data });
  } catch (err) {
    console.error('[GET /api/templates] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/api/templates/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM email_templates WHERE id = ? AND user_id = ?`, [req.params.id, uid(req)]);
    if (!rows[0]) return res.status(404).json({ success: false, error: 'Template not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('[GET /api/templates/:id] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/api/templates', async (req, res) => {
  try {
    const userId = uid(req);
    const { name, html_content, template_type } = req.body;
    if (!name || !html_content) return res.status(400).json({ success: false, error: 'name and html_content required' });
    const type = template_type === 'text' ? 'text' : 'html';
    const safe = type === 'html' ? String(html_content).replace(/<script[\s\S]*?<\/script>/gi, '') : String(html_content);
    await pool.query(`INSERT INTO email_templates (name, html_content, template_type, user_id) VALUES (?, ?, ?, ?)`, [name.trim(), safe, type, userId]);
    const { rows: idRows } = await pool.query(`SELECT LAST_INSERT_ID() AS insertId`);
    const newId = idRows[0]?.insertId;
    if (!newId) return res.status(500).json({ success: false, error: 'Insert failed' });
    const { rows } = await pool.query(`SELECT * FROM email_templates WHERE id = ?`, [newId]);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('[POST /api/templates] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/api/templates/:id', async (req, res) => {
  try {
    const userId = uid(req);
    const { name, html_content, template_type } = req.body;
    if (!name || !html_content) return res.status(400).json({ success: false, error: 'name and html_content required' });
    const type = template_type === 'text' ? 'text' : 'html';
    const safe = type === 'html' ? String(html_content).replace(/<script[\s\S]*?<\/script>/gi, '') : String(html_content);
    await pool.query(`UPDATE email_templates SET name = ?, html_content = ?, template_type = ?, updated_at = NOW() WHERE id = ? AND user_id = ?`, [name.trim(), safe, type, req.params.id, userId]);
    const { rows } = await pool.query(`SELECT * FROM email_templates WHERE id = ?`, [req.params.id]);
    if (!rows[0]) return res.status(404).json({ success: false, error: 'Template not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('[PUT /api/templates/:id] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/api/templates/:id', async (req, res) => {
  try {
    const userId = uid(req);
    const { rows } = await pool.query(`SELECT name FROM email_templates WHERE id = ? AND user_id = ?`, [req.params.id, userId]);
    if (!rows[0]) return res.status(404).json({ success: false, error: 'Template not found' });
    if (PROTECTED_TEMPLATES.includes(rows[0].name)) {
      return res.status(403).json({ success: false, error: `Template "${rows[0].name}" is protected` });
    }
    await pool.query(`DELETE FROM email_templates WHERE id = ?`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/templates/:id] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
