// ---------------------------------------------
// 📤 Upload Controller – Advanced Image Handler
// ---------------------------------------------

const asyncHandler = require('express-async-handler');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp'); // 🧠 Image optimization
const Image = require('../models/imageModel'); // ✅ MongoDB schema

// ✅ Allowed MIME types
const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

// -----------------------------------------------------
// 📤 Single Image Upload with Thumbnail, Tags & Logging
// -----------------------------------------------------
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: '❌ No image file uploaded.',
    });
  }

  const mimeType = req.file.mimetype;
  if (!allowedMimeTypes.includes(mimeType)) {
    fs.unlinkSync(req.file.path); // Delete invalid file
    return res.status(415).json({
      success: false,
      message: `Unsupported image format: ${mimeType}`,
    });
  }

  const uploadsBase = '/uploads/';
  const originalPath = `${uploadsBase}${req.file.filename}`;
  const thumbnailFilename = `thumb-${req.file.filename}`;
  const thumbnailFullPath = path.join(__dirname, `../uploads/${thumbnailFilename}`);

  try {
    const metadata = await sharp(req.file.path).metadata();

    await sharp(req.file.path)
      .resize({ width: 400 })
      .jpeg({ quality: 80 })
      .toFile(thumbnailFullPath);

    const tags = req.body.tags
      ? req.body.tags.split(',').map(tag => tag.trim().toLowerCase())
      : [];

    const newImage = await Image.create({
      original: originalPath,
      thumbnail: `${uploadsBase}${thumbnailFilename}`,
      filename: req.file.filename,
      mimetype,
      sizeKB: parseFloat((req.file.size / 1024).toFixed(2)),
      dimensions: {
        width: metadata.width,
        height: metadata.height,
      },
      alt: req.body.alt || '',
      uploadedBy: req.user ? req.user._id : null,
      purpose: req.body.purpose || 'custom',
      tags,
    });

    res.status(201).json({
      success: true,
      message: '✅ Image uploaded successfully',
      image: newImage,
    });
  } catch (error) {
    console.error('❌ Image upload error:', error.message);
    res.status(500).json({
      success: false,
      message: '⚠️ Server error while uploading image',
      error: error.message,
    });
  }
});

// -----------------------------------------------------
// 👤 Upload Profile Avatar Image
// -----------------------------------------------------
const uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload an image.' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;

  res.status(200).json({
    success: true,
    message: '✅ Profile image uploaded',
    url: imageUrl,
  });
});

// -----------------------------------------------------
// 🖼 Upload Multiple Images (for Products)
// -----------------------------------------------------
const uploadMultipleImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No images received',
    });
  }

  const images = req.files.map(file => ({
    url: `/uploads/${file.filename}`,
    name: file.originalname,
    sizeKB: parseFloat((file.size / 1024).toFixed(2)),
    mimetype: file.mimetype,
  }));

  res.status(200).json({
    success: true,
    message: '✅ Images uploaded',
    images,
  });
});

// ✅ Export all handlers
module.exports = {
  uploadImage,
  uploadProfileImage,
  uploadMultipleImages,
};
