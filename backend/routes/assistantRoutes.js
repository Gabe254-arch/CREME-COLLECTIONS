// routes/assistantRoutes.js
const express = require('express');
const router = express.Router();

/**
 * @route POST /api/ai/assistant
 * @desc Smart AI-style FAQ assistant route
 * @access Public
 */
router.post('/assistant', (req, res) => {
  const { question, userId } = req.body;
  const lowerQ = question.toLowerCase();

  let reply = "🤖 Sorry, I don't understand that yet. Try asking about orders, payment, or support.";

  if (lowerQ.includes('order') && lowerQ.includes('track')) {
    reply = '📦 You can track your order under My Orders > View Details. We’ll also notify you once it’s shipped.';
  } else if (lowerQ.includes('refund')) {
    reply = '💸 Refunds are issued within 3–5 business days after approval. Please contact support for help.';
  } else if (lowerQ.includes('shipping')) {
    reply = '🚚 We ship within Nairobi in 1 day and outside Nairobi in 2–3 days. Delivery fee is calculated at checkout.';
  } else if (lowerQ.includes('payment')) {
    reply = '💳 We accept M-Pesa, Card, and Cash on Delivery. Choose your preferred method during checkout.';
  } else if (lowerQ.includes('support') || lowerQ.includes('help')) {
    reply = '📞 For urgent help, reach out via WhatsApp or call our support line at 0712-345-678.';
  } else if (lowerQ.includes('wishlist')) {
    reply = '❤️ You can save items to your wishlist by clicking the heart icon. View them anytime in your account.';
  } else if (lowerQ.includes('invoice')) {
    reply = '🧾 You can download your order invoices from the My Orders page by clicking “Invoice”.';
  } else if (lowerQ.includes('account') || lowerQ.includes('profile')) {
    reply = '👤 To update your account, go to Dashboard > Profile. You can edit your name, password, or image there.';
  }

  res.json({ success: true, userId, reply });
});

module.exports = router;
