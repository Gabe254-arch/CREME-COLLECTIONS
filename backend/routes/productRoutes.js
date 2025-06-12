const express = require('express');
const router = express.Router();

const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getDealsOfTheWeek,
  getTopRatedProducts // ✅ NEW
} = require('../controllers/productController');

const { importProductsFromCSV } = require('../controllers/productImportController');

const upload = require('../utils/multerConfig'); // 🖼️ For image uploads
const multer = require('multer');
const csvUpload = multer({ dest: 'uploads/' }); // 📄 For CSV import

// =======================================================
// ✅ Public Routes (open to all users)
// =======================================================

// 📦 Get all products (search, filter, paginate)
router.get('/', getProducts);

// 🔥 Deals of the Week
router.get('/deals', getDealsOfTheWeek);

// 🌟 Top Rated Products
router.get('/top-rated', getTopRatedProducts); // ✅ NEW route

// 🔍 Single Product by ID
router.get('/:id', getProductById);

// =======================================================
// 🔐 Admin / Shop Manager Routes
// =======================================================

// ➕ Create New Product (with image upload)
router.post(
  '/',
  protect,
  authorizeRoles('superadmin', 'admin', 'shopmanager'),
  upload.array('images', 10),
  createProduct
);

// ✏️ Update Product
router.put(
  '/:id',
  protect,
  authorizeRoles('superadmin', 'admin', 'shopmanager'),
  upload.array('images', 10),
  updateProduct
);

// ❌ Delete Product
router.delete(
  '/:id',
  protect,
  authorizeRoles('superadmin', 'admin', 'shopmanager'),
  deleteProduct
);

// 📥 Import Products from CSV (Admin only)
router.post(
  '/import-csv',
  protect,
  authorizeRoles('superadmin', 'admin'),
  csvUpload.single('file'),
  importProductsFromCSV
);

// 🔁 Optional: Bulk delete (future)
// router.post('/bulk-delete', protect, authorizeRoles('admin'), bulkDeleteProducts);

// ✅ Export router
module.exports = router;
