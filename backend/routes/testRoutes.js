// ---------------------------------------------
// 🔐 Authenticated Testing Routes (Role-Based)
// ---------------------------------------------

const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// ---------------------------------------------
// 🛡️ Route: Super Admin Access Only
// ✅ Only users with role 'superadmin' can access
// ---------------------------------------------
router.get(
  '/superadmin-only',
  protect,
  authorizeRoles('superadmin'),
  (req, res) => {
    res.json({
      message: '✅ Welcome, Super Admin!',
      user: req.user,
    });
  }
);

// ---------------------------------------------
// 🧑‍💼 Route: Admin + ShopManager + SuperAdmin
// ✅ Accessible by admin roles only (multi-role)
// ---------------------------------------------
router.get(
  '/admin-area',
  protect,
  authorizeRoles('shopmanager', 'admin', 'superadmin'),
  (req, res) => {
    res.json({
      message: `✅ Welcome to Admin Area, ${req.user.role}!`,
      user: req.user,
    });
  }
);

// ---------------------------------------------
// 🙋 Route: Authenticated User Profile
// ✅ Any logged-in user can access
// ---------------------------------------------
router.get('/profile', protect, (req, res) => {
  res.json({
    message: '👤 Your Profile Info',
    user: req.user,
  });
});

// ---------------------------------------------
// 🚀 Export Router
// ---------------------------------------------
module.exports = router;
