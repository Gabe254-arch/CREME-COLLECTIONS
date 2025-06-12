const fs = require('fs');
const path = require('path');
const asyncHandler = require('express-async-handler');
const Newsletter = require('../models/Newsletter');

// 📩 Subscribe user to newsletter
exports.subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  const exists = await Newsletter.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: 'This email is already subscribed' });
  }

  await Newsletter.create({ email });
  res.status(201).json({ message: '✅ You are now subscribed to our newsletter!' });
});

// 📦 Export all subscribers as CSV
exports.exportSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Newsletter.find().sort({ createdAt: -1 });

  const csv = ['Email,Subscribed At'];
  subscribers.forEach(s => {
    csv.push(`${s.email},${s.createdAt.toISOString()}`);
  });

  const exportPath = path.join(__dirname, '../exports/newsletter_subscribers_export.csv');
  fs.writeFileSync(exportPath, csv.join('\n'));

  res.download(exportPath);
});

// 📦 Export all subscribers as JSON
exports.exportSubscribersJSON = asyncHandler(async (req, res) => {
  const subscribers = await Newsletter.find().sort({ createdAt: -1 });
  res.json(subscribers);
});