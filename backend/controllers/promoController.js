const asyncHandler = require('express-async-handler');
const Promo = require('../models/Promo');

// 🔍 GET /api/promos - All active banners (landscape + portrait)
exports.getPromos = asyncHandler(async (req, res) => {
  const promos = await Promo.find().sort({ createdAt: -1 });
  res.json(promos);
});

// 🧭 GET /api/promos/portrait - Portrait banners only
exports.getPortraitPromos = asyncHandler(async (req, res) => {
  const portraitPromos = await Promo.find({ type: 'portrait' }).sort({ createdAt: -1 });
  res.json(portraitPromos);
});

// ➕ POST /api/promos - Create banner
exports.createPromo = asyncHandler(async (req, res) => {
  const { title, image, link, type } = req.body;

  if (!title || !image || !link) {
    return res.status(400).json({ message: 'All fields (title, image, link) are required.' });
  }

  const promo = new Promo({
    title,
    image,
    link,
    type: type || 'landscape'  // Default to 'landscape' if not provided
  });

  await promo.save();

  res.status(201).json({ message: '✅ Promo created successfully', promo });
});
