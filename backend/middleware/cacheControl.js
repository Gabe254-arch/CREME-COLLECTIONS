// ---------------------------------------------
// 📦 Smart Cache Control Middleware (Amazon-Grade)
// ---------------------------------------------
// - Optimizes API response caching
// - Reduces server load
// - Helps with SEO and performance
// ---------------------------------------------

/**
 * Sets intelligent Cache-Control headers based on request path.
 * Adjusts cache duration for assets, API, and critical routes.
 */
const cacheControl = (req, res, next) => {
  const url = req.originalUrl;

  // 🖼️ Static uploads (images, assets) - cache for 7 days
  if (url.startsWith('/uploads/')) {
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
  }

  // 🔁 API responses - short cache for GETs only
  else if (url.startsWith('/api/') && req.method === 'GET') {
    res.setHeader('Cache-Control', 'public, max-age=60'); // 1 min
  }

  // 📄 Public assets (frontend build) - aggressive cache
  else if (url.match(/\.(js|css|woff|woff2|ttf|svg|ico)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // 🧾 Default fallback
  else {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  }

  next();
};

module.exports = cacheControl;
