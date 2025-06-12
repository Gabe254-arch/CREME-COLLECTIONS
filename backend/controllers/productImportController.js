const csv = require('csv-parser');
const fs = require('fs');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

// @desc    Import products from a CSV file into MongoDB
// @route   POST /api/products/import-csv
// @access  Protected - Admin/Superadmin only
exports.importProductsFromCSV = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '⚠️ CSV file is required.' });
  }

  const products = [];

  // Read uploaded CSV file
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => {
      // ✅ Map each row to your MongoDB schema
      products.push({
        name: row.Name?.trim() || 'Unnamed Product',
        price: Number(row.Price) || 0,
        brand: row.Brand?.trim() || 'Unbranded',
        stock: Number(row.Stock) || 0,
        category: row.Category?.trim() || 'Uncategorized',
        // Optionally include more fields if you add them in your model
      });
    })
    .on('end', async () => {
      try {
        // Insert all products at once
        await Product.insertMany(products);
        return res.status(200).json({
          message: `✅ Successfully imported ${products.length} products.`,
        });
      } catch (err) {
        console.error('❌ Insert Error:', err.message);
        return res.status(500).json({ message: 'Failed to import products.' });
      }
    })
    .on('error', (err) => {
      console.error('❌ File Read Error:', err.message);
      return res.status(500).json({ message: 'Failed to process CSV file.' });
    });
});
