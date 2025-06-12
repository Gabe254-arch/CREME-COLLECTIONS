const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true, // 🔐 Ensure no duplicate category names
    },
    description: {
      type: String,
      required: [true, 'Category description is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: {
      type: String, // 🖼 Used for category thumbnail or banner
      default: '',  // Default empty string if not provided
    },

    // 🧑‍💼 Admin Tracking (optional but powerful)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// 🔄 Auto-generate slug & capitalize name before saving
categorySchema.pre('save', function (next) {
  // Capitalize name (e.g., "electronics" => "Electronics")
  this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();

  // Generate slug if not already set
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  next();
});

// 📌 Index slug for faster queries & enforce uniqueness
categorySchema.index({ slug: 1 }, { unique: true });

// 🔗 Virtual: Related subcategories (optional for dashboards)
categorySchema.virtual('subcategories', {
  ref: 'Subcategory',
  localField: '_id',
  foreignField: 'category',
});

// ✅ Export model safely (prevents overwrite in dev)
module.exports = mongoose.models.Category || mongoose.model('Category', categorySchema);
