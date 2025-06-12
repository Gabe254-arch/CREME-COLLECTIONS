const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const connectDB = require('../config/db');

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminExists = await User.findOne({ email: 'admin@creme.com' });
    if (adminExists) {
      console.log('🚫 Admin already exists');
      process.exit();
    }

    const admin = new User({
      name: 'Admin User',
      email: 'admin@creme.com',
      password: 'admin123', // Will be hashed
      role: 'admin',
    });

    await admin.save();
    console.log('✅ Admin user created');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();
