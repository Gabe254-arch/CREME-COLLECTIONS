// middleware/trafficLogger.js

const fs = require('fs');
const path = require('path');
const trafficLogPath = path.join(__dirname, '../logs/traffic.log');

/**
 * 📊 Traffic Logger Middleware
 * Logs incoming requests by IP, route, and browser for insight into user activity.
 * Use for analytics dashboards and monitoring suspicious behavior patterns.
 */
const trafficLogger = (req, res, next) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown Browser';
    const route = req.originalUrl || req.url;
    const method = req.method;

    const logLine = `[${new Date().toISOString()}] ${method} ${route} :: ${ip} :: ${userAgent}\n`;

    fs.appendFile(trafficLogPath, logLine, (err) => {
      if (err) console.warn('⚠️ Traffic log failed:', err.message);
    });

    next();
  } catch (err) {
    console.error('❌ trafficLogger error:', err.message);
    next(); // Avoid blocking core app
  }
};

module.exports = trafficLogger;
