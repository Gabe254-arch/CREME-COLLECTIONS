// ---------------------------------------------
// 📦 Multer Middleware – Image Upload Handler
// ---------------------------------------------

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ---------------------------------------------
// 🛡 Allowed Image Types
// ---------------------------------------------
const allowedTypes = /jpeg|jpg|png|webp|gif|svg/;

// ---------------------------------------------
// 🗂 Ensure Upload Directory Exists
// ---------------------------------------------
const UPLOAD_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ---------------------------------------------
// ⚙️ Multer Storage Config
// - Saves images with unique timestamp names
// - Avoids file name collisions
// ---------------------------------------------
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, UPLOAD_DIR); // Folder where images are saved
  },
  filename(req, file, cb) {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext)
      .replace(/\s+/g, '-')     // replace spaces with -
      .replace(/[^a-zA-Z0-9-_]/g, '') // remove special chars
      .toLowerCase();

    cb(null, `${timestamp}-${baseName}${ext}`);
  },
});

// ---------------------------------------------
// 🛑 File Filter – Accepts only safe image types
// ---------------------------------------------
const fileFilter = (req, file, cb) => {
  const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeValid = allowedTypes.test(file.mimetype);

  if (extValid && mimeValid) {
    cb(null, true);
  } else {
    cb(new Error('❌ Only .jpeg, .jpg, .png, .webp, .gif, or .svg image files are allowed.'));
  }
};

// ---------------------------------------------
// 🔌 Multer Config Export
// - Max file size: 2MB
// ---------------------------------------------
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // ⛔ 2MB limit
  },
});

module.exports = upload;
