const fs = require('fs');
const path = require('path');

const FOLLOWUP_TEMPLATE_PATH = path.join(__dirname, '..', '..', '..', '..', '..', '..', '..', 'templates', 'followup_body.html');
// Resolved at require-time so path errors surface immediately
const _resolvedPath = (() => {
  // Walk up from backend/ until we find the templates folder
  let dir = __dirname;
  for (let i = 0; i < 10; i++) {
    const candidate = path.join(dir, 'templates', 'followup_body.html');
    if (fs.existsSync(candidate)) return candidate;
    dir = path.dirname(dir);
  }
  return FOLLOWUP_TEMPLATE_PATH; // fallback to original
})();

/**
 * Replace all supported template variables.
 * Extend this function as new variables are needed.
 */
function applyPersonalization(template, lead, campaign = {}) {
  const firstName = (lead.first_name || lead.name || '').split(' ')[0].trim() || 'there';
  const company   = (lead.company || '').trim() || 'your company';
  const unsubId   = encodeURIComponent(lead.email || '');
  const agentName = process.env.FROM_NAME || 'Seawind Team';

  return template
    .replace(/\{\{FirstName\}\}/g,    firstName)
    .replace(/\{\{customerName\}\}/g, firstName)
    .replace(/\{\{name\}\}/g,         firstName)
    // Handle all company variants: {{company}}, {{company | default(...)}}, {{ company }}, etc.
    .replace(/\{\{\s*company\s*(?:\|[^}]*)?\}\}/g, company)
    .replace(/\{\{agentName\}\}/g,    agentName)
    .replace(/\{\{unsubscribe\}\}/g,  unsubId)
    .replace(/\{\{inquiryId\}\}/g,    unsubId)
    // Strip any remaining unrecognised {{ }} so emails always send
    .replace(/\{\{[^}]*\}\}/g, '');
}

/**
 * Build the HTML + plain-text body for a follow-up email.
 *
 * Template priority:
 *   1. campaign.follow_up_template  (per-campaign DB override — future use)
 *   2. templates/followup_body.html on disk
 *   3. INLINE_FALLBACK              (always safe, no external deps)
 *
 * @param {object} lead     - { email, name, first_name, company, ... }
 * @param {object} campaign - { follow_up_template?, name? }
 * @param {number} step     - follow-up step (1, 2, …) reserved for future A/B use
 * @returns {{ html: string, text: string }}
 */
function buildFollowUpTemplate(lead, campaign = {}, step = 1) {
  const firstName = (lead.first_name || lead.name || '').split(' ')[0].trim() || 'there';

  let rawTemplate = campaign.follow_up_template || null;

  if (!rawTemplate && fs.existsSync(_resolvedPath)) {
    try { rawTemplate = fs.readFileSync(_resolvedPath, 'utf8'); } catch (_) {}
  }

  if (!rawTemplate) rawTemplate = INLINE_FALLBACK;

  const html = applyPersonalization(rawTemplate, lead, campaign);
  const text = `Hi ${firstName},\n\nJust following up on my previous email about our services at Seawind Solution.\n\nWould love to connect — feel free to reply directly.\n\nRegards,\nSeawind Solution Pvt. Ltd.\ninfo@seawindsolution.com`;

  return { html, text };
}

// ---------------------------------------------------------------------------
// Inline fallback — used only when no file template exists.
// Deliberately lightweight (1 image, 1 CTA) to stay out of spam.
// ---------------------------------------------------------------------------
const INLINE_FALLBACK = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Following up — Seawind Solution</title>
</head>
<body style="margin:0;padding:0;background-color:#eef2f7;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ebebeb;padding:20px 0;">
<tr><td align="center">
<table width="620" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;width:100%;border-collapse:collapse;">

  <!-- HEADER IMAGE -->
  <tr>
    <td align="center">
      <img src="https://www.india.seawindsolution.com/assets/front/images/startup-launch-kit-full.jpg"
           alt="Seawind Solution"
           style="width:100%;border-top-left-radius:32px;border-top-right-radius:32px;display:block;">
    </td>
  </tr>

  <!-- CONTENT -->
  <tr>
    <td style="background-color:#ffffff;padding:32px 28px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">

      <p style="margin:0 0 20px 0;font-size:16px;color:#1e293b;">Hi {{FirstName}},</p>

      <h1 style="margin:0 0 14px 0;font-size:20px;line-height:1.5;color:#0056ca;font-weight:700;">
        Building a strong brand identity starts with the right foundation.
      </h1>

      <p style="margin:0 0 14px 0;font-size:16px;line-height:1.8;color:#333;">
        I wanted to follow up on my previous email. At Seawind Solution, we help businesses
        create meaningful brand identities by combining strategic planning, premium design,
        and Vedic astrology insights.
      </p>

      <!-- Credential block -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0;">
        <tr>
          <td style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:20px 22px;">
            <p style="margin:0 0 8px 0;font-size:14px;color:#64748b;">In collaboration with</p>
            <p style="margin:0;font-size:20px;color:#004aad;font-weight:700;">Sri Vishwa Vora</p>
            <p style="margin:6px 0 14px 0;font-size:15px;color:#64748b;line-height:1.6;">
              Ashtang Jyotish Expert &amp; Business Consultant
            </p>
            <p style="margin:0;font-size:15px;line-height:1.8;color:#334155;">
              Bringing astrological guidance into branding decisions to align business identity
              with timing, colours, and direction.
            </p>
          </td>
        </tr>
      </table>

      <!-- Services -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px 0;">
        <tr>
          <td width="33%" style="padding:10px 10px 10px 0;vertical-align:top;">
            <p style="margin:0 0 4px 0;font-size:15px;font-weight:700;color:#004aad;">Strategy</p>
            <p style="margin:0;font-size:14px;color:#64748b;line-height:1.6;">Clear market positioning</p>
          </td>
          <td width="33%" style="padding:10px;vertical-align:top;border-left:1px solid #e2e8f0;">
            <p style="margin:0 0 4px 0;font-size:15px;font-weight:700;color:#004aad;">Design</p>
            <p style="margin:0;font-size:14px;color:#64748b;line-height:1.6;">Professional visual identity</p>
          </td>
          <td width="33%" style="padding:10px 0 10px 10px;vertical-align:top;border-left:1px solid #e2e8f0;">
            <p style="margin:0 0 4px 0;font-size:15px;font-weight:700;color:#004aad;">Alignment</p>
            <p style="margin:0;font-size:14px;color:#64748b;line-height:1.6;">Astrology-based guidance</p>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 24px 0;font-size:16px;line-height:1.8;color:#333;">
        If you are planning to build or refresh your brand identity, I would be happy to connect
        and discuss how this approach may support your business goals.
      </p>

      <!-- Single CTA -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center">
            <a href="https://india.seawindsolution.com/astrologer/vishwa-vora"
               style="display:inline-block;background-color:#004aad;color:#ffffff;padding:16px 40px;border-radius:12px;font-size:15px;font-weight:700;text-decoration:none;">
              Learn More
            </a>
          </td>
        </tr>
      </table>

      <p style="margin:24px 0 0 0;font-size:14px;line-height:1.8;color:#64748b;">
        You can reply directly to this email if you would like to know more.
      </p>

      <!-- SIGNATURE -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0"
             style="margin:24px 0 0 0;padding-top:20px;border-top:1px solid #e2e8f0;">
        <tr>
          <td>
            <p style="margin:0;font-size:14px;line-height:22px;color:#334155;">
              <strong>Regards,</strong><br>
              <strong style="color:#004aad;">Seawind Solution Pvt. Ltd.</strong><br><br>
              <a href="mailto:info@seawindsolution.com" style="color:#0049ac;">info@seawindsolution.com</a><br>
              <a href="https://www.seawindsolution.com" style="color:#0049ac;">www.seawindsolution.com</a>
            </p>
          </td>
        </tr>
      </table>

    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="background-color:#0049ac;padding:24px 20px;text-align:center;border-radius:0 0 28px 28px;">
      <p style="margin:0 0 6px 0;font-size:14px;font-weight:600;color:#ffffff;">Seawind Solution Pvt. Ltd.</p>
      <p style="margin:0 0 6px 0;font-size:13px;color:#bfdbfe;line-height:1.6;">
        B-1103, Mondeal Heights, Near Novotel Hotel, SG Highway, Ahmedabad, Gujarat, 380015, India
      </p>
      <p style="margin:8px 0 0 0;font-size:12px;color:#93c5fd;">
        &copy; 2009&ndash;2026 Seawind Solution Pvt. Ltd. |
        <a href="https://lmsapi.seawindsolution.com/api/public/unsubscribe/{{unsubscribe}}"
           style="color:#bfdbfe;text-decoration:underline;">Unsubscribe</a>
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;

module.exports = { buildFollowUpTemplate, applyPersonalization };
