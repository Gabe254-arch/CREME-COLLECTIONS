const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  source: {
    type: String,
    default: 'website', // Could be 'popup', 'footer', 'checkout', etc.
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed', 'bounced'],
    default: 'active',
  },
  tags: {
    type: [String],
    default: [],
  }
}, {
  timestamps: true, // ✅ Automatically includes createdAt & updatedAt
});

module.exports = mongoose.model('NewsletterSubscriber', subscriberSchema);
