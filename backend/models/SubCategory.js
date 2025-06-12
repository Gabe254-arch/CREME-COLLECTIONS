const mongoose = require('mongoose');
const slugify = require('slugify');

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Subcategory name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Associated category is required'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: String,
      default: '', // 🖼️ Optional image thumbnail or banner
    },

    // 🧑‍💼 Track creator and modifier for auditing
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // ⚙️ Custom status & sorting
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },

    // 📊 Optional analytics field (useful for sorting by engagement)
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 🔄 Auto-generate slug and format name
subCategorySchema.pre('save', function (next) {
  if (this.name) {
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
  }

  if (!this.slug && this.name) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }

  next();
});

// 📌 Enforce unique slugs and optimize queries
subCategorySchema.index({ slug: 1 }, { unique: true });
subCategorySchema.index({ name: 1 }); // For faster lookup by name

// 🔗 Virtual category name reference (optional API bonus)
subCategorySchema.virtual('categoryName', {
  ref: 'Category',
  localField: 'category',
  foreignField: '_id',
  justOne: true,
  options: { select: 'name slug' },
});

// ✅ Final export (safe for hot reloads)
module.exports = mongoose.models.SubCategory || mongoose.model('SubCategory', subCategorySchema);
