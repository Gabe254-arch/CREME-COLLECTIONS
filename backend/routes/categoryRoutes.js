// routes/categoryRoutes.js

const express = require('express');
const router = express.Router();

// 🧩 Category controller methods
const {
  getCategories,
  getCategoriesWithSubcategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

// 🧩 Subcategory controller method used here
const {
  getSubCategoriesByCategorySlug,
} = require('../controllers/subCategoryController');

// 🔐 Auth middleware for protected routes
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// -----------------------------------
// 📦 Category Routes
// -----------------------------------

// ✅ GET /api/categories - Fetch all categories (with optional search)
router.get('/', getCategories);

// ✅ GET /api/categories/subcategories/:slug - Subcategories by category slug
router.get('/subcategories/:slug', getSubCategoriesByCategorySlug);

// ✅ GET /api/categories/with-subcategories - Full nested category > subcategories
router.get('/with-subcategories', getCategoriesWithSubcategories);

// ✅ GET /api/categories/slug/:slug - Single category by slug
router.get('/slug/:slug', getCategoryBySlug);

// ✅ POST /api/categories - Create category (admin only)
router.post(
  '/',
  protect,
  authorizeRoles('admin', 'superadmin'),
  createCategory
);

// ✅ PUT /api/categories/:id - Update category (admin only)
router.put(
  '/:id',
  protect,
  authorizeRoles('admin', 'superadmin'),
  updateCategory
);

// ✅ DELETE /api/categories/:id - Delete category (admin only)
router.delete(
  '/:id',
  protect,
  authorizeRoles('admin', 'superadmin'),
  deleteCategory
);

// -----------------------------------
// 📤 Export router
// -----------------------------------
module.exports = router;
