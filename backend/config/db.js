// backend/config/db.js
const mongoose = require('mongoose');

// ---------------------------------------------
// 🌐 MongoDB Connection Handler
// ---------------------------------------------
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('❌ MONGO_URI is not defined in .env file');
    }

    const conn = await mongoose.connect(uri); // ✅ Clean — no deprecated options

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
