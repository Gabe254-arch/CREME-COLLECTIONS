const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const SubCategory = require('../models/SubCategory');
const AdminLog = require('../models/AdminLog');
const Product = require('../models/Product');
const Category = require('../models/Category'); // ✅ Needed for getSubCategoriesByCategorySlug

// ==========================================================
// 📦 GET all subcategories (filter + pagination)
// ==========================================================
exports.getSubCategoriesByCategorySlug = asyncHandler(async (req, res) => {
  const filter = {};
  const sortBy = req.query.sort || 'displayOrder';

  if (req.query.category) filter.category = req.query.category;
  if (req.query.active === 'true') filter.isActive = true;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  const [subcategories, total] = await Promise.all([
    SubCategory.find(filter)
      .populate('category', 'name slug')
      .sort({ [sortBy]: 1, name: 1 })
      .skip(skip)
      .limit(limit),
    SubCategory.countDocuments(filter),
  ]);

  res.status(200).json({ success: true, subcategories, page, total });
});

// ==========================================================
// 🔍 GET single subcategory by ID
// ==========================================================
exports.getSubCategoryById = asyncHandler(async (req, res) => {
  const subcategory = await SubCategory.findById(req.params.id)
    .populate('category', 'name slug');

  if (!subcategory) {
    return res.status(404).json({ success: false, message: '❌ Subcategory not found' });
  }

  res.status(200).json({ success: true, subcategory });
});

// ==========================================================
// 🔁 GET subcategories by category slug (for UI filters)
// ==========================================================
exports.getSubCategoriesByCategorySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const category = await Category.findOne({ slug });
  if (!category) {
    return res.status(404).json({
      success: false,
      message: '❌ Category slug not found',
    });
  }

  const subcategories = await SubCategory.find({
    category: category._id,
    isActive: true,
  }).sort({ name: 1 });

  res.status(200).json({ success: true, subcategories });
});

// ==========================================================
// ➕ CREATE a new subcategory
// ==========================================================
exports.createSubCategory = asyncHandler(async (req, res) => {
  const {
    name = '',
    category,
    description = '',
    image = '',
    displayOrder = 0,
  } = req.body;

  const trimmedName = name.trim();
  const trimmedDesc = description.trim();
  const trimmedImage = image.trim();

  if (!trimmedName || !category) {
    return res.status(400).json({ success: false, message: '❌ Name and category are required' });
  }

  const existing = await SubCategory.findOne({ name: trimmedName, category });
  if (existing) {
    return res.status(400).json({ success: false, message: '❌ Subcategory already exists in this category' });
  }

  const slug = slugify(trimmedName, { lower: true, strict: true });

  const newSub = await SubCategory.create({
    name: trimmedName,
    slug,
    category,
    description: trimmedDesc,
    image: trimmedImage,
    displayOrder,
    isActive: true,
    createdBy: req.user._id,
  });

  await AdminLog.create({
    adminId: req.user._id,
    action: 'subcategory-created',
    notes: `Created subcategory "${newSub.name}"`,
    targetSubCategoryId: newSub._id,
    ipAddress: req.ip,
  });

  res.status(201).json({ success: true, message: '✅ Subcategory created', subcategory: newSub });
});

// ==========================================================
// ✏️ UPDATE subcategory
// ==========================================================
exports.updateSubCategory = asyncHandler(async (req, res) => {
  const subcategory = await SubCategory.findById(req.params.id);
  if (!subcategory) {
    return res.status(404).json({ success: false, message: '❌ Subcategory not found' });
  }

  const fields = ['name', 'description', 'image', 'category', 'isActive', 'displayOrder'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      const value = typeof req.body[field] === 'string' ? req.body[field].trim() : req.body[field];
      subcategory[field] = value;
    }
  });

  if (req.body.name) {
    subcategory.slug = slugify(req.body.name, { lower: true, strict: true });
  }

  subcategory.updatedBy = req.user._id;
  const updated = await subcategory.save();

  await AdminLog.create({
    adminId: req.user._id,
    action: 'subcategory-updated',
    notes: `Updated subcategory "${updated.name}"`,
    targetSubCategoryId: updated._id,
    ipAddress: req.ip,
  });

  res.status(200).json({ success: true, message: '✅ Subcategory updated', subcategory: updated });
});

// ==========================================================
// ❌ DELETE subcategory (if not in use)
// ==========================================================
exports.deleteSubCategory = asyncHandler(async (req, res) => {
  const subcategory = await SubCategory.findById(req.params.id);
  if (!subcategory) {
    return res.status(404).json({ success: false, message: '❌ Subcategory not found' });
  }

  const usageCount = await Product.countDocuments({ subcategory: subcategory._id });
  if (usageCount > 0) {
    return res.status(400).json({
      success: false,
      message: '❌ Cannot delete: Subcategory is linked to existing products',
    });
  }

  await subcategory.deleteOne();

  await AdminLog.create({
    adminId: req.user._id,
    action: 'subcategory-deleted',
    notes: `Deleted subcategory "${subcategory.name}"`,
    targetSubCategoryId: subcategory._id,
    ipAddress: req.ip,
  });

  res.status(200).json({ success: true, message: '✅ Subcategory deleted' });
});


module.exports = {
  getSubCategoryById,
  getSubCategoriesByCategorySlug,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
