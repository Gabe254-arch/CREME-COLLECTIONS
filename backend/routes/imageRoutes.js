const express = require('express');
const router = express.Router();
const {
  getAllImages,
  deleteImageById,
} = require('../controllers/imageController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// 🔐 Admin-only routes
router.get(
  '/',
  protect,
  authorizeRoles('admin', 'superadmin'),
  getAllImages
);

router.delete(
  '/:id',
  protect,
  authorizeRoles('admin', 'superadmin'),
  deleteImageById
);

module.exports = router;
