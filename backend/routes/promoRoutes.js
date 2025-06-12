const express = require('express');
const router = express.Router();

const {
  getPromos,
  getPortraitPromos,
  createPromo,
} = require('../controllers/promoController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// 🔍 Public Routes
router.get('/', getPromos);                 // All banners
router.get('/portrait', getPortraitPromos); // Portrait-only banners

// 🔐 Admin Routes
router.post(
  '/',
  protect,
  authorizeRoles('admin', 'superadmin'),
  createPromo
);

module.exports = router;
