const mongoose = require('mongoose');

// ---------------------------------------------
// 🧠 Image Schema for Creme Collections
// ---------------------------------------------
const imageSchema = new mongoose.Schema(
  {
    // 🌄 Full path to the original image
    original: {
      type: String,
      required: true,
      trim: true,
    },

    // 🖼️ Path to auto-generated thumbnail
    thumbnail: {
      type: String,
      default: '',
      trim: true,
    },

    // 📎 Filename as uploaded
    filename: {
      type: String,
      required: true,
      trim: true,
    },

    // 🧾 MIME type (e.g., image/png)
    mimetype: {
      type: String,
      required: true,
    },

    // 📏 File size (in KB)
    sizeKB: {
      type: Number,
      required: true,
    },

    // 📐 Dimensions of the image
    dimensions: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },

    // 🧠 Accessibility ALT tag
    alt: {
      type: String,
      default: '',
      trim: true,
    },

    // 👤 Uploader (user reference)
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // 🎯 Purpose of image usage
    purpose: {
      type: String,
      enum: ['product', 'profile', 'banner', 'promo', 'brand', 'custom'],
      default: 'custom',
    },

    // 🏷️ Smart search support
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],

    // 🗑️ Soft deletion support
    isDeleted: {
      type: Boolean,
      default: false,
    },

    // 🔄 Image versioning (for updates)
    version: {
      type: Number,
      default: 1,
    },

    // 📌 Optional admin notes
    notes: {
      type: String,
      default: '',
      trim: true,
    },

    // ⏳ Optional expiry support
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 🔗 Computed full URL for direct access
imageSchema.virtual('url').get(function () {
  return `${process.env.BASE_URL || 'http://localhost:5000'}${this.original}`;
});

// 📂 Optional: TTL Index for auto-cleanup (if needed)
imageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Image', imageSchema);
