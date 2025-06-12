// middleware/aiSEOEngine.js

const fs = require('fs');
const path = require('path');
const keywordsFile = path.join(__dirname, '../logs/seo-keywords.log');

/**
 * 🧠 AI SEO Engine Middleware
 * Logs keywords from requests that can be used to optimize SEO content, auto-train AI responses,
 * or feed analytics dashboards to improve organic traffic performance.
 */
const aiSEOEngine = (req, res, next) => {
  try {
    const userAgent = req.headers['user-agent'] || 'unknown';
    const url = req.originalUrl || req.url;

    // Keywords to extract from URL for training (e.g., product names or search terms)
    const keyword = decodeURIComponent(url)
      .replace(/\/api\/|\/shop\/|[^a-zA-Z0-9\s-]/g, ' ')
      .trim()
      .toLowerCase();

    const logEntry = `[${new Date().toISOString()}] ${keyword} :: ${userAgent}\n`;

    // Append keyword to log file (no duplicates stored in real time)
    if (keyword && keyword.length > 2) {
      fs.appendFile(keywordsFile, logEntry, (err) => {
        if (err) console.warn('⚠️ SEO log write failed:', err.message);
      });
    }

    next();
  } catch (error) {
    console.error('❌ aiSEOEngine failed:', error.message);
    next(); // Allow app to continue even on error
  }
};

module.exports = aiSEOEngine;
