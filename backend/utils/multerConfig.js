// backend/utils/multerConfig.js

// -----------------------------------------------------
// 🔧 Core Dependencies
// -----------------------------------------------------
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// -----------------------------------------------------
// 📁 Upload Directory Setup
// -----------------------------------------------------
// Automatically create /uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Ensures nested folders are also created
  console.log('📂 Uploads directory created:', uploadDir);
}

// -----------------------------------------------------
// 🗃️ Multer Storage Engine Configuration
// -----------------------------------------------------
const storage = multer.diskStorage({
  // 🔽 Define the destination folder for uploaded files
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Files will be saved in `/uploads`
  },

  // 🏷️ Define custom filename: originalname + timestamp
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // Get extension (.jpg)
    const baseName = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, '-')   // Replace spaces with hyphens
      .toLowerCase();         // Make lowercase
    const timestamp = Date.now();
    cb(null, `${baseName}-${timestamp}${ext}`); // e.g. productname-1688999.jpg
  },
});

// -----------------------------------------------------
// 🔐 File Filter: Allow Only Image MIME Types
// -----------------------------------------------------
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // ✅ Accept file
  } else {
    // ❌ Reject file and return a custom error
    cb(
      new Error(
        '❌ Invalid file type. Only JPEG, PNG, JPG, and WEBP images are allowed.'
      ),
      false
    );
  }
};

// -----------------------------------------------------
// 📦 Export: Upload Middleware with Limits & Filters
// -----------------------------------------------------
const upload = multer({
  storage,           // Disk storage config
  fileFilter,        // Image-only filter
  limits: {
    fileSize: 10 * 1024 * 1024, // ⛔ Max file size: 10MB
  },
});

module.exports = upload;
