const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Promo title is required'],
      trim: true,
      maxlength: 100,
    },
    image: {
      type: String,
      required: [true, 'Promo image URL or path is required'],
    },
    link: {
      type: String,
      required: [true, 'Promo link is required'],
    },
    type: {
      type: String,
      enum: ['landscape', 'portrait'], // 📐 Allow filtering by design layout
      default: 'landscape',
    },
  },
  {
    timestamps: true, // ✅ Adds createdAt & updatedAt automatically
  }
);

module.exports = mongoose.model('Promo', promoSchema);
