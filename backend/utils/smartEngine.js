const os = require('os');
const fs = require('fs');
const path = require('path');
const { version } = require('../../package.json');

// 🔐 Block specific IPs or suspicious patterns
const blockedIPs = ['103.21.244.0', '37.120.233.91'];

function firewall(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (blockedIPs.includes(ip)) {
    return res.status(403).json({ message: '🚫 Forbidden' });
  }

  // 🚀 Log traffic
  logTraffic(req);

  next();
}

// 📈 Log traffic for analytics
function logTraffic(req) {
  const logPath = path.join(__dirname, '../logs/traffic.log');
  const entry = {
    timestamp: new Date().toISOString(),
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    method: req.method,
    url: req.originalUrl,
    userAgent: req.headers['user-agent'],
    referrer: req.headers['referer'] || 'Direct',
  };

  fs.appendFileSync(logPath, JSON.stringify(entry) + '\n');
}

// 📊 Auto Metadata for API Routes
function seoMeta(req, res, next) {
  res.setHeader('X-App-Version', version);
  res.setHeader('X-Robots-Tag', 'index, follow');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  next();
}

module.exports = {
  firewall,
  logTraffic,
  seoMeta,
};
