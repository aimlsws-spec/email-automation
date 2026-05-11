const path = require('path');
const fs = require('fs');
const { escapeHtml, escapeRegExp } = require('./stringHelpers');
const { resolveSubjectForLead } = require('../services/emailService');

// Resolve pythonProjectDir the same way server.js does.
// __dirname here is backend/utils/, so we go one level up to reach backend/,
// which is the same starting point server.js uses via its own __dirname.
const _backendDir = path.resolve(__dirname, '..');
function _findPythonProjectDir() {
  if (process.env.PYTHON_PROJECT_DIR) return process.env.PYTHON_PROJECT_DIR;
  let current = _backendDir;
  while (current && current !== path.dirname(current)) {
    if (fs.existsSync(path.join(current, 'gmail_oauth.py'))) return current;
    current = path.dirname(current);
  }
  return path.resolve(_backendDir, '../../../../../..');
}
const pythonProjectDir = _findPythonProjectDir();

// PORT is needed by usePreviewSafeImages at request time; resolved same way as server.js.
const PORT = process.env.PORT || 4000;

const TEMPLATE_PATH = path.join(
  pythonProjectDir,
  'templates', 'initial_body.html'
);
const FOLLOWUP_TEMPLATE_PATH = path.join(
  pythonProjectDir,
  'templates', 'followup_body.html'
);
const FOLLOWUP_SUBJECT_PATH = path.join(
  pythonProjectDir,
  'templates', 'followup_subject.txt'
);
const AGENT_NAME = 'Seawind Team';
const TEST_SEND_LIMIT = 500;

const IMAGE_URLS = {
  logo: 'cid:logo@seawind',
  web: 'cid:web@seawind',
  ecommerce: 'cid:ecommerce@seawind',
};

const EMAIL_ASSET_PATHS = {
  'cid:logo@seawind': 'logo.png',
  'cid:web@seawind': 'web.png',
  'cid:ecommerce@seawind': 'ecommerce.png',
};

function normalizeImageUrls(html) {
  // Disabled to allow high-res external icons from template
  return String(html || '');
  /*
  return String(html || '')
    .replace(/src="[^"]*web-icon\.png"/g, `src="${IMAGE_URLS.web}"`)
    .replace(/src="[^"]*E-commerce-icon\.png"/g, `src="${IMAGE_URLS.ecommerce}"`);
  */
}

function usePreviewSafeImages(html) {
  let finalHtml = String(html || '');

  for (const [cid, filename] of Object.entries(EMAIL_ASSET_PATHS)) {
    if (cid === IMAGE_URLS.logo) continue;
    finalHtml = finalHtml.replace(
      new RegExp(escapeRegExp(cid), 'g'),
      `http://localhost:${PORT}/email-assets/${filename}`
    );
  }

  return finalHtml;
}

function renderTemplate(lead) {
  const html = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  const trustLine = [
    '<p style="font-size: 12px; line-height: 1.6; color: #333333; margin: 0 0 18px;">',
    'You are receiving this email because we found your business contact information publicly available and believe our IT services may be relevant to your company.',
    '</p>',
  ].join('');

  const finalHtml = html
    .replace(/\{\{\s*customerName\s*\}\}/g, escapeHtml(lead.name || ''))
    .replace(/\{\{\s*agentName\s*\}\}/g, AGENT_NAME)
    .replace(/\{\{\s*company\s*(?:\|\s*default\([^)]+\)\s*)?\}\}/g, escapeHtml(lead.company || 'your company'))
    .replace(/color:\s*#33(?=[;\s"])/g, 'color: #333333')
    .replace(/\.\.\/unsubscribe\/\{\{\s*inquiryId\s*\}\}/g, 'https://seawindsolution.com/unsubscribe/{{inquiryId}}')
    .replace(/\{\{\s*inquiryId\s*\}\}/g, encodeURIComponent(lead.email || ''))
    .replace(
      /<\/td>\s*<\/tr>\s*<tr>\s*<td style="background: #0049ac;/,
      `${trustLine}\n              </td>\n            </tr>\n            <tr>\n              <td style="background: #0049ac;`,
    );

  return normalizeImageUrls(finalHtml);
}

function replaceTemplateVars(template, lead) {
  const company = (lead.company || '').trim() || 'your business';
  return String(template || "")
    .replace(/\{\{\s*FirstName\s*\}\}/g,    escapeHtml(lead.name || ""))
    .replace(/\{\{\s*customerName\s*\}\}/g, escapeHtml(lead.name || ""))
    .replace(/\{\{\s*name\s*\}\}/g,         escapeHtml(lead.name || ""))
    .replace(/\{\{\s*company\s*(?:\|[^}]*)?\}\}/g, escapeHtml(company))
    .replace(/\{\{\s*agentName\s*\}\}/g,    AGENT_NAME)
    .replace(/\{\{\s*inquiryId\s*\}\}/g,    encodeURIComponent(lead.email || ""))
    .replace(/\{\{[^}]*\}\}/g, '');
}

function renderFollowupTemplate(lead) {
  const html = fs.existsSync(FOLLOWUP_TEMPLATE_PATH)
    ? fs.readFileSync(FOLLOWUP_TEMPLATE_PATH, "utf8")
    : `<p>Hi {{FirstName}},</p><p>Just following up on my previous email.</p><p>Thanks,<br>{{agentName}}</p>`;

  return normalizeImageUrls(replaceTemplateVars(html, lead));
}

function renderFollowupSubject(lead) {
  const template = fs.existsSync(FOLLOWUP_SUBJECT_PATH)
    ? fs.readFileSync(FOLLOWUP_SUBJECT_PATH, "utf8")
    : "Re: {{company}}";

  return replaceTemplateVars(template, lead).trim();
}

function renderSubject(lead, manualSubject = null) {
  const template = (manualSubject && typeof manualSubject === 'string' && manualSubject.trim() !== '' && manualSubject !== 'undefined' && manualSubject !== 'null')
    ? manualSubject
    : (() => {
        const subjectPath = path.join(pythonProjectDir, 'templates', 'initial_subject.txt');
        return fs.existsSync(subjectPath)
          ? fs.readFileSync(subjectPath, 'utf8')
          : 'Quick question about {{company}}';
      })();
  return resolveSubjectForLead(template, lead);
}

module.exports = {
  TEMPLATE_PATH,
  FOLLOWUP_TEMPLATE_PATH,
  AGENT_NAME,
  TEST_SEND_LIMIT,
  normalizeImageUrls,
  usePreviewSafeImages,
  renderTemplate,
  replaceTemplateVars,
  renderFollowupTemplate,
  renderFollowupSubject,
  renderSubject,
};
