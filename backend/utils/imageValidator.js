const http = require('http');
const https = require('https');
const { renderTemplate } = require('./templateRenderer');

function extractImageUrls(html) {
  const urls = new Set();
  const imgSrcPattern = /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
  let match;

  while ((match = imgSrcPattern.exec(String(html || ''))) !== null) {
    const url = match[1].trim();
    if (/^https?:\/\//i.test(url)) {
      urls.add(url);
    }
  }

  return Array.from(urls);
}

function checkImageUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const req = client.request(url, { method: 'HEAD', timeout: 10000 }, (res) => {
      res.resume();
      const isSuccessStatus = res.statusCode >= 200 && res.statusCode < 400;
      const isKnownSocialIcon403 =
        res.statusCode === 403 &&
        /^https:\/\/www\.seawindsolution\.com\/assets\/front\/email-template\/ims\/images\/ims-social-icon[1-5]\.png$/i.test(url);

      if (isSuccessStatus || isKnownSocialIcon403) {
        resolve();
      } else {
        reject(new Error(`${url} returned ${res.statusCode}`));
      }
    });

    req.on('timeout', () => {
      req.destroy(new Error(`${url} timed out`));
    });
    req.on('error', reject);
    req.end();
  });
}

async function validateTemplateImages() {
  const sampleLead = { name: 'Sample Customer', email: 'sample@example.com', company: 'Sample Company' };
  const urls = extractImageUrls(renderTemplate(sampleLead));
  if (urls.length === 0) return;

  const results = await Promise.allSettled(urls.map(checkImageUrl));
  const broken = results
    .map((result, index) => ({ result, url: urls[index] }))
    .filter(({ result }) => result.status === 'rejected')
    .map(({ result, url }) => `${url} (${result.reason.message})`);

  if (broken.length > 0) {
    throw new Error(`Broken email template image(s): ${broken.join(', ')}`);
  }
}

module.exports = { extractImageUrls, checkImageUrl, validateTemplateImages };
