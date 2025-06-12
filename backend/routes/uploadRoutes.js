// ---------------------------------------------
// 📁 Upload Routes – Handles all image uploads via Multer
// ---------------------------------------------

const express = require('express');
const router = express.Router();

// 📤 Controller functions
const {
  uploadImage,
  uploadProfileImage,
  uploadMultipleImages,
} = require('../controllers/uploadController');

// 🔐 Middleware
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// -----------------------------------------------------
// 📌 POST /api/upload
// 🔒 Access: Any logged-in user
// 🎯 Upload single image (product, banners, etc.)
// -----------------------------------------------------
router.post(
  '/upload',
  protect,
  upload.single('image'),
  uploadImage
);

// -----------------------------------------------------
// 👤 POST /api/upload/profile
// 🔒 Access: Any logged-in user
// 🎯 Upload profile avatar image
// -----------------------------------------------------
router.post(
  '/profile',
  protect,
  upload.single('image'),
  uploadProfileImage
);

// -----------------------------------------------------
// 🖼️ POST /api/upload/multiple
// 🔒 Access: Admins & Shop Managers
// 🎯 Upload multiple product images (max: 5)
// -----------------------------------------------------
router.post(
  '/multiple',
  protect,
  upload.array('images', 5),
  uploadMultipleImages
);

module.exports = router;
