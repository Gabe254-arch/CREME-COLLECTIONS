// ---------------------------------------------
// 🧠 Admin ActionLog Schema (Enterprise-Level Audit Trail)
// Logs all admin/shopmanager activities with contextual data
// ---------------------------------------------

const mongoose = require('mongoose');

const actionLogSchema = new mongoose.Schema(
  {
    // 🔐 Actor (Admin or Shop Manager performing the action)
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // 🎯 Target User (affected user, if any)
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // 🛒 Target Order (if related to order actions)
    targetOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },

    // 📦 Target Product (if related to product actions)
    targetProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },

    // ✅ Core Action Performed
    action: {
      type: String,
      required: true,
      enum: [
        // 🧑‍💼 User Management
        'login', 'logout', 'reset-password', 'suspend', 'activate', 'change-role', 'delete',

        // 🛍️ Product Management
        'product-uploaded', 'product-deleted', 'product-updated',

        // 📦 Order Management
        'order-paid', 'order-delivered', 'order-edited',

        // 🛠️ System Config / Marketing
        'settings-changed', 'banner-uploaded', 'newsletter-sent',

        // 📁 Miscellaneous
        'custom-action',
      ],
    },

    // 📝 Additional description, reason, or AI-generated summary
    notes: {
      type: String,
      default: '',
      trim: true,
    },

    // 🌍 IP Address of user
    ipAddress: {
      type: String,
      default: '',
    },

    // 🖥️ User Agent (Device/Browser info)
    userAgent: {
      type: String,
      default: '',
    },

    // 🌎 Optional: Country/Region (geo from middleware or headers)
    location: {
      type: String,
      default: '',
    },

    // 🏷️ Optional tags to label/group logs (e.g., ["security", "critical"])
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
  },
  {
    timestamps: true, // Automatically handles createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ---------------------------------------------
// 🧠 Virtual Field for Human-Readable Summary
// ---------------------------------------------
actionLogSchema.virtual('summary').get(function () {
  return `${this.action} by ${this.adminId}`;
});

module.exports = mongoose.model('ActionLog', actionLogSchema);
