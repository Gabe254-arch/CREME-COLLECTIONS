const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// ---------------------------------------------
// 🔐 Middleware: Protect Routes (JWT Required)
// ---------------------------------------------
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // ✅ 1. Check for Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // ✅ 2. Decode and verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ 3. Attach user to request (excluding password)
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: '❌ User not found' });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error('❌ JWT verification failed:', err.message);
      return res.status(401).json({ message: '❌ Invalid or expired token' });
    }
  } else {
    return res.status(401).json({ message: '❌ No token provided in request' });
  }
});

// ---------------------------------------------
// 👑 Admin-Only Middleware (Admin & SuperAdmin)
// ---------------------------------------------
const adminOnly = (req, res, next) => {
  if (!req.user || !['admin', 'superadmin'].includes(req.user.role)) {
    return res.status(403).json({
      message: '⛔ Access restricted to admin or superadmin',
    });
  }
  next();
};

// ---------------------------------------------
// 🧰 Role-Based Authorization Middleware
// Usage: authorizeRoles('admin', 'shopmanager')
// ---------------------------------------------
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `⛔ Access denied. Requires one of the following roles: ${roles.join(', ')}`,
      });
    }
    next();
  };
};

// ---------------------------------------------
// 🛠 Export All Middleware
// ---------------------------------------------
module.exports = {
  protect,
  adminOnly,
  authorizeRoles,
};
