const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getMyOrders,
  createOrder,
  getOrderById,
  markAsPaid,
  markAsDelivered,
  downloadInvoice,
  getInvoiceHistory,
} = require('../controllers/orderController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// ---------------------------------------------------
// 🛒 Create New Order (Client Only)
// ---------------------------------------------------
router.post('/', protect, createOrder);

// ---------------------------------------------------
// 👤 Get Orders for Logged-in User (Client)
// ---------------------------------------------------
router.get('/myorders', protect, getMyOrders);

// ---------------------------------------------------
// 📦 Fetch All Orders (Admin / Shop Manager / Super Admin)
// ---------------------------------------------------
router.get(
  '/all',
  protect,
  authorizeRoles('admin', 'shopmanager', 'superadmin'),
  getAllOrders
);

// ---------------------------------------------------
// 🗂 View Invoice History — MUST COME BEFORE /:id
// ---------------------------------------------------
router.get('/invoice-history', protect, getInvoiceHistory);

// ---------------------------------------------------
// 📄 Download Invoice — MUST COME BEFORE /:id
// ---------------------------------------------------
router.get('/:id/invoice', protect, downloadInvoice);

// ---------------------------------------------------
// 💳 Mark Order as Paid
// ---------------------------------------------------
router.put(
  '/:id/pay',
  protect,
  authorizeRoles('admin', 'shopmanager', 'superadmin'),
  markAsPaid
);

// ---------------------------------------------------
// 🚚 Mark Order as Delivered
// ---------------------------------------------------
router.put(
  '/:id/deliver',
  protect,
  authorizeRoles('admin', 'shopmanager', 'superadmin'),
  markAsDelivered
);

// ---------------------------------------------------
// 🔍 Get Order by ID (Client / Admin Access)
// ---------------------------------------------------
router.get('/:id', protect, getOrderById);

module.exports = router;
