// backend/routes/invoiceRoutes.js
const express = require('express');
const router = express.Router();
const { generateInvoice } = require('../controllers/invoiceController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:id', protect, generateInvoice);

module.exports = router;
