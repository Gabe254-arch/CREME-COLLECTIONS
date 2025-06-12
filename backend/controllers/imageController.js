// ---------------------------------------------
// 📦 Image Controller – Full CRUD with Soft Delete
// ---------------------------------------------

const asyncHandler = require('express-async-handler');
const Image = require('../models/imageModel'); // ✅ Correct case
const fs = require('fs');
const path = require('path');

// ---------------------------------------------
// 📥 Get All Images (Admin Only)
// Optional filters: purpose, tag, includeDeleted
// ---------------------------------------------
exports.getAllImages = asyncHandler(async (req, res) => {
  const { purpose, tag, includeDeleted } = req.query;

  const query = includeDeleted === 'true' ? {} : { isDeleted: false };
  if (purpose) query.purpose = purpose;
  if (tag) query.tags = { $in: [tag.toLowerCase()] };

  const images = await Image.find(query).sort({ createdAt: -1 });
  res.status(200).json(images);
});

// ---------------------------------------------
// 🔍 Get Image by ID
// ---------------------------------------------
exports.getImageById = asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.id);
  if (!image || image.isDeleted) {
    res.status(404);
    throw new Error('Image not found or has been deleted');
  }
  res.status(200).json(image);
});

// ---------------------------------------------
// 🗑️ Soft Delete Image by ID
// ---------------------------------------------
exports.deleteImageById = asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.id);
  if (!image) {
    res.status(404);
    throw new Error('Image not found');
  }

  image.isDeleted = true;
  await image.save();
  res.status(200).json({ message: '🗑️ Image marked as deleted (soft delete)' });
});

// ---------------------------------------------
// ❌ Hard Delete (Permanently remove file + DB entry)
// ---------------------------------------------
exports.hardDeleteImage = asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.id);
  if (!image) {
    res.status(404);
    throw new Error('Image not found');
  }

  // Delete physical files
  const imagePath = path.join(__dirname, '..', image.original);
  const thumbPath = path.join(__dirname, '..', image.thumbnail);

  [imagePath, thumbPath].forEach(file => {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  });

  await image.deleteOne();
  res.status(200).json({ message: '✅ Image permanently deleted from DB and file system' });
});

// ---------------------------------------------
// ♻️ Restore Soft Deleted Image
// ---------------------------------------------
exports.restoreImage = asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.id);
  if (!image || !image.isDeleted) {
    res.status(404);
    throw new Error('Image not found or not soft deleted');
  }

  image.isDeleted = false;
  await image.save();
  res.status(200).json({ message: '✅ Image restored successfully' });
});

// ---------------------------------------------
// ✏️ Update Image Metadata (Alt, Tags, Purpose)
// ---------------------------------------------
exports.updateImageMeta = asyncHandler(async (req, res) => {
  const { alt, tags, purpose } = req.body;
  const image = await Image.findById(req.params.id);

  if (!image) {
    res.status(404);
    throw new Error('Image not found');
  }

  if (alt !== undefined) image.alt = alt;
  if (tags && Array.isArray(tags)) {
    image.tags = tags.map(t => t.trim().toLowerCase());
  }
  if (purpose) image.purpose = purpose;

  await image.save();
  res.status(200).json({ message: '✅ Image metadata updated', image });
});

// ---------------------------------------------
// 📊 Get All Distinct Image Purposes
// ---------------------------------------------
exports.getAllImagePurposes = asyncHandler(async (req, res) => {
  const purposes = await Image.distinct('purpose');
  res.status(200).json(purposes);
});
