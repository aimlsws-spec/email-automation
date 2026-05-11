-- ============================================================================
-- INSERT FOLLOW-UP TEMPLATES
-- ============================================================================
-- Run this after the main migration to create the required templates

USE automate_mail;

-- Template 1: FOLLOW UP (VIRALKAR)
-- INSERT IGNORE: never overwrite an existing template with this placeholder HTML
INSERT IGNORE INTO email_templates (name, html_content, created_at, updated_at)
VALUES (
  'FOLLOW UP (VIRALKAR)',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="padding:40px 30px;">
              <p style="font-size:16px;line-height:1.6;color:#333;margin:0 0 20px;">
                Hi {{name}},
              </p>
              <p style="font-size:16px;line-height:1.6;color:#333;margin:0 0 20px;">
                I wanted to follow up on my previous email about how we can help {{company}} with IT solutions.
              </p>
              <p style="font-size:16px;line-height:1.6;color:#333;margin:0 0 20px;">
                We specialize in:
              </p>
              <ul style="font-size:16px;line-height:1.8;color:#333;margin:0 0 20px;padding-left:20px;">
                <li>Custom software development</li>
                <li>Cloud infrastructure setup</li>
                <li>Mobile app development</li>
                <li>IT consulting and support</li>
              </ul>
              <p style="font-size:16px;line-height:1.6;color:#333;margin:0 0 20px;">
                Would you be available for a quick 15-minute call this week to discuss how we can support your goals?
              </p>
              <p style="font-size:16px;line-height:1.6;color:#333;margin:0 0 20px;">
                Best regards,<br>
                {{agentName}}
              </p>
              <hr style="border:none;border-top:1px solid #eee;margin:30px 0;">
              <p style="font-size:12px;line-height:1.4;color:#999;margin:0;">
                <a href="https://seawindsolution.com/unsubscribe/{{unsubscribe}}" style="color:#999;text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>',
  NOW(),
  NOW()
);

-- Template 2: FOLLOW UP 2 (VIRALKAR)
-- INSERT IGNORE: never overwrite an existing template with this placeholder HTML
INSERT IGNORE INTO email_templates (name, html_content, created_at, updated_at)
VALUES (
  'FOLLOW UP 2 (VIRALKAR)',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="padding:40px 30px;">
              <p style="font-size:16px;line-height:1.6;color:#333;margin:0 0 20px;">
                Hi {{name}},
              </p>
              <p style="font-size:16px;line-height:1.6;color:#333;margin:0 0 20px;">
                Just checking in again regarding our IT services for {{company}}.
              </p>
              <p style="font-size:16px;line-height:1.6;color:#333;margin:0 0 20px;">
                I understand you''re busy, so I''ll keep this brief. We''ve helped companies like yours:
              </p>
              <ul style="font-size:16px;line-height:1.8;color:#333;margin:0 0 20px;padding-left:20px;">
                <li>Reduce IT costs by 30-40%</li>
                <li>Improve system uptime to 99.9%</li>
                <li>Accelerate digital transformation</li>
                <li>Scale infrastructure seamlessly</li>
              </ul>
              <p style="font-size:16px;line-height:1.6;color:#333;margin:0 0 20px;">
                If this sounds relevant, I''d love to share some case studies and discuss how we can help.
              </p>
              <p style="font-size:16px;line-height:1.6;color:#333;margin:0 0 20px;">
                Are you open to a brief conversation?
              </p>
              <p style="font-size:16px;line-height:1.6;color:#333;margin:0 0 20px;">
                Thanks,<br>
                {{agentName}}
              </p>
              <hr style="border:none;border-top:1px solid #eee;margin:30px 0;">
              <p style="font-size:12px;line-height:1.4;color:#999;margin:0;">
                <a href="https://seawindsolution.com/unsubscribe/{{unsubscribe}}" style="color:#999;text-decoration:underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>',
  NOW(),
  NOW()
);

-- Verify templates were created
SELECT id, name, created_at FROM email_templates WHERE name LIKE '%VIRALKAR%';

-- ============================================================================
-- TEMPLATES INSERTED SUCCESSFULLY
-- ============================================================================
