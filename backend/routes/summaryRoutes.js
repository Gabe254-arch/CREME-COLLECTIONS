// backend/routes/summaryRoutes.js

const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const fs = require('fs');
const path = require('path');

const seoLogPath = path.join(__dirname, '../logs/seo-keywords.log');
const trafficLogPath = path.join(__dirname, '../logs/traffic.log');

// 🧠 GET summary analytics for admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const seoData = fs.existsSync(seoLogPath)
      ? fs.readFileSync(seoLogPath, 'utf-8').split('\n').filter(Boolean)
      : [];

    const trafficData = fs.existsSync(trafficLogPath)
      ? fs.readFileSync(trafficLogPath, 'utf-8').split('\n').filter(Boolean)
      : [];

    const seoKeywords = seoData.map((line) => line.split('::')[0].trim());
    const routesAccessed = trafficData.map((line) => line.split('::')[0].trim());

    res.status(200).json({
      status: '✅ Summary loaded',
      seoKeywordsCount: seoKeywords.length,
      trafficEvents: routesAccessed.length,
      topSEO: seoKeywords.slice(-10).reverse(),
      topRoutes: routesAccessed.slice(-10).reverse(),
    });
  } catch (error) {
    console.error('❌ Failed to load summary:', error.message);
    res.status(500).json({ message: 'Summary error', error: error.message });
  }
});

module.exports = router;
