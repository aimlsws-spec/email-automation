const pool = require('../db');
const { getOAuth2Client } = require('../config/gmail');

async function connectGoogleAccount(req, res) {
  const email = req.params.email;
  console.log("[OAuth] Initiation request for:", email);

  if (!email) {
    console.error("[OAuth] Missing email in connect request");
    return res.status(400).send('Email required');
  }

  try {
    const oauth2Client = getOAuth2Client();
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      include_granted_scopes: true,
      scope: (process.env.GMAIL_SCOPES || '').split(' '),
      state: email
    });

    console.log(`[OAuth] Redirecting to Google Auth for ${email}. AuthURL: ${authUrl}`);
    res.redirect(authUrl);
  } catch (err) {
    console.error('[OAuth] Initiation error:', err);
    res.status(500).json({ success: false, message: 'OAuth initiation failed: ' + err.message });
  }
}

async function googleCallback(req, res) {
  console.log('[OAuth Callback] Received request. Params:', req.query);

  const { code, state: email } = req.query;

  if (!code || !email) {
    console.error('[OAuth Callback] Invalid params: Missing code or state (email)');
    return res.redirect('http://localhost:5173/dashboards/send-emails?error=invalid_callback');
  }

  try {
    const oauth2Client = getOAuth2Client();
    console.log(`[OAuth Callback] Exchanging code for tokens for: ${email}`);
    const { tokens } = await oauth2Client.getToken(code);

    console.log('[OAuth Callback] Token response received. Refresh token present:', !!tokens.refresh_token);

    if (!tokens.refresh_token) {
      console.error('[OAuth Callback] Refresh token missing from Google response.');
      return res.redirect('http://localhost:5173/dashboards/send-emails?error=no_refresh_token');
    }

    console.log(`[OAuth Callback] Saving tokens to DB for ${email}`);
    const dbResult = await pool.query(
      `INSERT INTO sender_accounts (email, refresh_token, is_connected, updated_at)
       VALUES (?, ?, 1, NOW())
       ON DUPLICATE KEY UPDATE
         refresh_token = VALUES(refresh_token),
         is_connected = 1,
         updated_at = NOW()`,
      [email, tokens.refresh_token]
    );

    console.log('[OAuth Callback] DB Update successful. Row count:', dbResult.rowCount);
    res.redirect('http://localhost:5173/dashboards/send-emails?success=connected');

  } catch (err) {
    console.error('[OAuth Callback] Exception occurred:', err.message);
    res.redirect(`http://localhost:5173/dashboards/send-emails?error=${encodeURIComponent(err.message)}`);
  }
}

module.exports = { connectGoogleAccount, googleCallback };
