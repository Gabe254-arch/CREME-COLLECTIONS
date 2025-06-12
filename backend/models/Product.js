const mongoose = require('mongoose');

// ------------------------------------------------------------
// 🔧 Helper Function: Generate Unique SKU
// ------------------------------------------------------------
const generateSKU = () => {
  const prefix = 'SKU';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
};

// ------------------------------------------------------------
// 🧱 Product Schema
// ------------------------------------------------------------
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },

    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
    },

    sku: {
      type: String,
      unique: true,
      default: generateSKU,
    },

    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
    },

    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be a positive number'],
    },

    countInStock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock must be a positive number'],
      default: 0,
    },

    weight: {
      type: String,
      default: '',
    },

    dimensions: {
      length: { type: String, default: '' },
      width: { type: String, default: '' },
      height: { type: String, default: '' },
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product must belong to a category'],
    },

    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory',
    },

    tags: [{ type: String }],
    sizes: [{ type: String }],
    colors: [{ type: String }],

    images: [{ type: String }], // ✅ Now supports multiple images

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isDealOfWeek: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ------------------------------------------------------------
// 📌 Auto-generate SKU before save (fallback safety)
// ------------------------------------------------------------
productSchema.pre('save', function (next) {
  if (!this.sku) {
    this.sku = generateSKU();
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
