const mongoose = require('mongoose');

// 🧠 AdminLog Schema: tracks admin/shop manager actions on orders, users, or products
const adminLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // 👤 Who performed the action
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'order-paid',
        'order-delivered',
        'product-created',
        'product-deleted',
        'user-suspended',
        'user-activated',
        'password-reset',
        'role-changed',
        'order-deleted',
      ],
    },
    targetOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    targetProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    notes: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('AdminLog', adminLogSchema);
