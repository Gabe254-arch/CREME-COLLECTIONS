const express = require('express');
const router = express.Router();
const { subscribe, exportSubscribers } = require('../controllers/newsletterController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// 📩 Public
router.post('/subscribe', subscribe);

// 🔐 Admin Only Export
router.get('/export', protect, authorizeRoles('admin', 'superadmin'), exportSubscribers);

module.exports = router;
