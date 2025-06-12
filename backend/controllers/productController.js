const fs = require('fs');
const path = require('path');
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const AdminLog = require('../models/AdminLog');

// ================================================================
// ➕ CREATE Product (Supports file uploads + image URLs)
// ================================================================
exports.createProduct = asyncHandler(async (req, res) => {
  const {
    name, slug, brand, description, price, category, subcategory,
    countInStock, tags, sizes, colors, weight,
    isFeatured, isDealOfWeek, isActive
  } = req.body;

  // 🔐 Validation
  if (!name || !brand || !description || !price || !category) {
    return res.status(400).json({ message: 'All required fields must be filled.' });
  }

  // 🖼️ Collect uploaded images
  const uploadedFiles = req.files?.map(f => `/uploads/${f.filename}`) || [];

  // 🌐 Handle external URLs (imageUrls[] may be sent as string or array)
  const imageUrlsRaw = req.body.imageUrls || [];
  const imageUrls = Array.isArray(imageUrlsRaw) ? imageUrlsRaw : [imageUrlsRaw];

  const combinedImages = [...uploadedFiles, ...imageUrls];

  // 📦 Create new product
  const product = new Product({
    name,
    slug: slug?.toLowerCase().replace(/\s+/g, '-'),
    brand,
    description,
    price,
    category,
    subcategory,
    countInStock: countInStock || 0,
    tags: tags?.split(',').map(x => x.trim()) || [],
    sizes: sizes?.split(',').map(x => x.trim()) || [],
    colors: colors?.split(',').map(x => x.trim()) || [],
    weight,
    images: combinedImages,
    dimensions: {
      length: req.body['dimensions[length]'] || null,
      width: req.body['dimensions[width]'] || null,
      height: req.body['dimensions[height]'] || null,
    },
    isFeatured: isFeatured === 'true' || isFeatured === true,
    isDealOfWeek: isDealOfWeek === 'true' || isDealOfWeek === true,
    isActive: isActive !== 'false',
  });

  const saved = await product.save();

  // 🧠 Admin log
  await AdminLog.create({
    adminId: req.user._id,
    action: 'product-created',
    notes: `Created product "${saved.name}"`,
    targetProductId: saved._id,
    ipAddress: req.ip
  });

  res.status(201).json({ message: '✅ Product created successfully', product: saved });
});

// ================================================================
// ✏️ UPDATE Product (Supports replacing uploaded images)
// ================================================================
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  // Editable fields
  const editableFields = [
    'name', 'slug', 'brand', 'description', 'price', 'category',
    'subcategory', 'countInStock', 'tags', 'sizes', 'colors',
    'weight', 'isFeatured', 'isDealOfWeek', 'isActive'
  ];

  editableFields.forEach(field => {
    if (req.body[field] !== undefined) {
      product[field] = ['tags', 'sizes', 'colors'].includes(field)
        ? req.body[field].split(',').map(x => x.trim())
        : req.body[field];
    }
  });

  if (req.body['dimensions[length]']) {
    product.dimensions = {
      length: req.body['dimensions[length]'],
      width: req.body['dimensions[width]'],
      height: req.body['dimensions[height]']
    };
  }

  // 🧼 Cleanup old uploaded images if new files are present
  if (req.files?.length > 0) {
    for (const img of product.images || []) {
      if (!img.startsWith('http')) {
        const filePath = path.join(__dirname, '..', img);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    }
    const uploaded = req.files.map(f => `/uploads/${f.filename}`);
    const imageUrlsRaw = req.body.imageUrls || [];
    const imageUrls = Array.isArray(imageUrlsRaw) ? imageUrlsRaw : [imageUrlsRaw];
    product.images = [...uploaded, ...imageUrls];
  }

  const updated = await product.save();

  await AdminLog.create({
    adminId: req.user._id,
    action: 'product-updated',
    notes: `Updated product "${updated.name}"`,
    targetProductId: updated._id,
    ipAddress: req.ip
  });

  res.status(200).json({ message: '✅ Product updated', product: updated });
});

// ================================================================
// 📦 GET Products (Search + Filter + Sort + Paginate)
// ================================================================
exports.getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const keyword = req.query.keyword || '';
  const sortBy = req.query.sortBy || 'createdAt';
  const order = req.query.order === 'asc' ? 1 : -1;

  const filters = {
    ...(keyword && { name: { $regex: keyword, $options: 'i' } }),
    ...(req.query.category && { category: req.query.category }),
    ...(req.query.subcategory && { subcategory: req.query.subcategory }),
    ...(req.query.brand && { brand: req.query.brand }),
    ...(req.query.minPrice && { price: { $gte: Number(req.query.minPrice) } }),
    ...(req.query.maxPrice && { price: { ...filters?.price, $lte: Number(req.query.maxPrice) } }),
    ...(req.query.featured && { isFeatured: true }),
    ...(req.query.deal && { isDealOfWeek: true }),
    ...(req.query.active && { isActive: true })
  };

  const total = await Product.countDocuments(filters);
  const products = await Product.find(filters)
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug')
    .sort({ [sortBy]: order })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({ page, total, pages: Math.ceil(total / limit), products });
});

// ================================================================
// 🔍 GET Product By ID
// ================================================================
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// ================================================================
// 🌟 GET Top-Rated Products
// ================================================================
exports.getTopRatedProducts = asyncHandler(async (req, res) => {
  const top = await Product.find({ rating: { $gte: 4.2 } })
    .sort({ rating: -1, numReviews: -1 })
    .limit(10);
  res.json(top);
});

// ================================================================
// 🔥 GET Deals of the Week
// ================================================================
exports.getDealsOfTheWeek = asyncHandler(async (req, res) => {
  const deals = await Product.find({ isDealOfWeek: true })
    .populate('category', 'name slug')
    .populate('subcategory', 'name slug');
  res.json(deals);
});

// ================================================================
// ❌ DELETE Product + Images
// ================================================================
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  for (const img of product.images || []) {
    if (!img.startsWith('http')) {
      const filePath = path.join(__dirname, '..', img);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  }

  await product.deleteOne();

  await AdminLog.create({
    adminId: req.user._id,
    action: 'product-deleted',
    notes: `Deleted product "${product.name}"`,
    targetProductId: product._id,
    ipAddress: req.ip
  });

  res.json({ message: '✅ Product deleted successfully' });
});
