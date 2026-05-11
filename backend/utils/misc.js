const crypto = require('crypto');

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeout(promise, ms = 15000, label = "TIMEOUT") {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(label)), ms)
    )
  ])
}

function nextSendDelayMs() {
  return 15 * 1000;
}

function getTrackingBaseUrl(req) {
  return (
    process.env.TRACKING_BASE_URL ||
    (req ? `${req.protocol}://${req.get("host")}` : "")
  );
}

function appendOpenTrackingPixel(html, trackingId, baseUrl) {
  if (!trackingId) return String(html || "");
  if (!baseUrl) return String(html || "");
  const pixel = `<img src="${baseUrl}/t/open/${encodeURIComponent(trackingId)}.gif" width="1" height="1" alt="" style="display:none!important;max-height:0;max-width:0;opacity:0;overflow:hidden;" />`;
  return `${String(html || "")}\n${pixel}`;
}

function createTrackingId() {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : crypto.randomBytes(16).toString("hex");
}

module.exports = {
  delay,
  withTimeout,
  nextSendDelayMs,
  getTrackingBaseUrl,
  appendOpenTrackingPixel,
  createTrackingId,
};
