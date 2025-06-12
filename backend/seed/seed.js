const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const seed = async () => {
  try {
    // Clear DB
    await User.deleteMany();
    await Category.deleteMany();

    // Password Hashing
    const hash = await bcrypt.hash('123456', 10);

    // Seed Users
    const users = [
      {
        name: 'Gabriel Dev',
        email: 'super@creme.com',
        password: hash,
        role: 'superadmin',
      },
      {
        name: 'Main Admin',
        email: 'admin@creme.com',
        password: hash,
        role: 'admin',
      },
      {
        name: 'Branch Manager',
        email: 'manager@creme.com',
        password: hash,
        role: 'shopmanager',
      },
    ];
    await User.insertMany(users);

    // Seed Categories
    const categories = [
      { name: 'Electronics', description: 'Devices and gadgets' },
      { name: 'Fashion', description: 'Clothing and accessories' },
      { name: 'Home Appliances', description: 'Items for household use' },
      { name: 'Beauty & Fragrance', description: 'Cosmetics and perfumes' },
      { name: 'Phones & Tablets', description: 'Mobile devices' },
      { name: 'Computing', description: 'Laptops, desktops, and accessories' },
      { name: 'Toys, Kids & Babies', description: 'All for children' },
      { name: 'Automotive', description: 'Car accessories and tools' },
    ];
    await Category.insertMany(categories);

    console.log('✅ Database seeded successfully');
    process.exit();
  } catch (error) {
    console.error(`❌ Seeding failed: ${error}`);
    process.exit(1);
  }
};

seed();
