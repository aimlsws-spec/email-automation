const { google } = require("googleapis");
const pool = require("../db");

function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Missing Google OAuth2 credentials in .env (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI).");
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

/**
 * Gets Gmail service for a specific sender email by fetching refresh token from DB.
 */
async function getGmailService(email) {
  if (!email) throw new Error("getGmailService requires an email");

  const { rows } = await pool.query(
    "SELECT refresh_token FROM sender_accounts WHERE email = ? AND is_connected = 1",
    [email]
  );

  if (rows.length === 0) {
    throw new Error(`No connected Gmail account found for ${email}. Please connect it first.`);
  }

  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({
    refresh_token: rows[0].refresh_token,
  });

  return google.gmail({ version: "v1", auth: oauth2Client });
}

async function verifyGmailAuth(email) {
  const gmail = await getGmailService(email);
  return gmail.users.getProfile({ userId: "me" });
}

module.exports = { getOAuth2Client, getGmailService, verifyGmailAuth };
