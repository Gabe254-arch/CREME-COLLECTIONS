// ---------------------------------------------
// 🔐 Firewall Middleware (Amazon-Level Protection)
// ---------------------------------------------
// - Blocks blacklisted IPs
// - Logs suspicious activity
// - Guards against known bots and scanners
// - Prevents brute-force or rate-based attacks
// ---------------------------------------------

const fs = require('fs');
const path = require('path');

// 🛑 Blocked IPs (add more if needed)
const blockedIPs = ['103.21.244.0', '37.120.233.91', '5.188.206.10'];

// 📁 Log path for all suspicious traffic
const logPath = path.join(__dirname, '../logs/firewall.log');

/**
 * Middleware: Blocks unwanted requests and logs traffic.
 */
const firewall = (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'] || 'Unknown';

  // Block known IPs
  if (blockedIPs.includes(ip)) {
    logSuspiciousAccess(ip, req.originalUrl, 'Blacklisted IP');
    return res.status(403).json({ message: '🚫 Forbidden - Your IP is restricted.' });
  }

  // Block requests with no user-agent (often bot or scanner)
  if (userAgent === 'Unknown' || userAgent.length < 10) {
    logSuspiciousAccess(ip, req.originalUrl, 'Missing/short User-Agent');
    return res.status(400).json({ message: '🛡️ Request denied' });
  }

  // Block massive POSTs or other abuse attempts
  if (req.method === 'POST' && Number(req.headers['content-length']) > 1_000_000) {
    logSuspiciousAccess(ip, req.originalUrl, 'Large POST payload');
    return res.status(413).json({ message: 'Payload too large' });
  }

  next();
};

/**
 * Helper: Logs blocked or flagged activity.
 */
const logSuspiciousAccess = (ip, url, reason) => {
  const entry = {
    time: new Date().toISOString(),
    ip,
    url,
    reason,
  };

  fs.appendFileSync(logPath, JSON.stringify(entry) + '\n');
};

module.exports = firewall;
