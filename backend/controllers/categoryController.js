const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const AdminLog = require('../models/AdminLog');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');

// ========================================================================
// 🔍 GET All Categories — Optional keyword filter
// ========================================================================
exports.getCategories = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};

  const categories = await Category.find(keyword).sort({ name: 1 });
  res.status(200).json(categories);
});

// ========================================================================
// 🔁 GET Categories with Nested Subcategories
// ========================================================================
exports.getCategoriesWithSubcategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 }).lean();

  const populated = await Promise.all(
    categories.map(async (cat) => {
      const subcategories = await SubCategory.find({ category: cat._id }).sort({ name: 1 });
      return { ...cat, subcategories };
    })
  );

  res.status(200).json(populated);
});

// ========================================================================
// 🔍 GET Category by Slug (Optional route for frontend /shop/:slug)
// ========================================================================
exports.getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) {
    return res.status(404).json({ message: '❌ Category not found' });
  }
  res.status(200).json(category);
});

// ========================================================================
// ➕ CREATE Category — With slug + audit log
// ========================================================================
exports.createCategory = asyncHandler(async (req, res) => {
  const { name, description, image } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ message: '❌ Category name is required' });
  }

  const nameExists = await Category.findOne({ name: new RegExp(`^${name}$`, 'i') });
  if (nameExists) {
    return res.status(400).json({ message: '❌ Category already exists' });
  }

  const safeSlug = slugify(name, { lower: true, strict: true });

  const category = await Category.create({
    name: name.trim(),
    slug: safeSlug,
    description: description?.trim() || '',
    image: image || '',
    createdBy: req.user?._id || null,
  });

  await AdminLog.create({
    adminId: req.user?._id,
    action: 'category-created',
    notes: `Created category "${category.name}"`,
    targetCategoryId: category._id,
    ipAddress: req.ip,
  });

  res.status(201).json({ message: '✅ Category created successfully', category });
});

// ========================================================================
// ✏️ UPDATE Category — Auto-slug refresh + log
// ========================================================================
exports.updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, image } = req.body;

  const category = await Category.findById(id);
  if (!category) {
    return res.status(404).json({ message: '❌ Category not found' });
  }

  if (name && name !== category.name) {
    category.name = name;
    category.slug = slugify(name, { lower: true, strict: true });
  }

  if (description !== undefined) category.description = description;
  if (image !== undefined) category.image = image;

  const updated = await category.save();

  await AdminLog.create({
    adminId: req.user?._id,
    action: 'category-updated',
    notes: `Updated category "${category.name}"`,
    targetCategoryId: category._id,
    ipAddress: req.ip,
  });

  res.status(200).json({ message: '✅ Category updated', category: updated });
});

// ========================================================================
// ❌ DELETE Category — Permanent delete + audit trail
// ========================================================================
exports.deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    return res.status(404).json({ message: '❌ Category not found' });
  }

  await category.deleteOne();

  await AdminLog.create({
    adminId: req.user?._id,
    action: 'category-deleted',
    notes: `Deleted category "${category.name}"`,
    targetCategoryId: category._id,
    ipAddress: req.ip,
  });

  res.status(200).json({ message: '✅ Category deleted successfully' });
});
