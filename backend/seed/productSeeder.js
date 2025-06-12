// backend/seed/productSeeder.js

const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const slugify = require('slugify');
const { faker } = require('@faker-js/faker');

// 🔌 Load environment variables early
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// 🧬 Models
const connectDB = require('../config/db');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Product = require('../models/Product');

// 🔌 Connect to MongoDB
connectDB();

const seedProducts = async () => {
  try {
    console.log('🧹 Clearing existing product data...');
    await Product.deleteMany();

    // 🔍 Load taxonomy from DB
    const categories = await Category.find({});
    const subcategories = await SubCategory.find({});

    if (!categories.length || !subcategories.length) {
      throw new Error('No categories or subcategories found. Run taxonomy seeder first.');
    }

    const defaultImage = '${import.meta.env.BASE_URL}default-product.png';

    const totalPerSubcategory = 10;

    // 🧰 Randomizer Utility
    const getRandomElements = (arr, n) =>
      [...arr].sort(() => 0.5 - Math.random()).slice(0, n);

    const allSizes = ['S', 'M', 'L', 'XL', 'XXL'];
    const allColors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Gray'];
    const allTags = ['bestseller', 'limited', 'discounted', 'trending', 'popular'];

    console.log('🚀 Seeding products by subcategory...');

    for (const category of categories) {
      const relatedSubs = subcategories.filter(
        (sub) => sub.category.toString() === category._id.toString()
      );

      for (const sub of relatedSubs) {
        for (let i = 0; i < totalPerSubcategory; i++) {
          const name = `${faker.commerce.productName()} ${faker.word.adjective()}`;
          const product = new Product({
            name,
            slug: slugify(name.toLowerCase()),
            brand: faker.company.name(),
            description: faker.commerce.productDescription(),
            price: faker.number.int({ min: 1500, max: 150000 }),
            category: category._id,
            subcategory: sub._id,
            countInStock: faker.number.int({ min: 3, max: 25 }),
            images: [defaultImage],
            tags: getRandomElements(allTags, 2),
            sizes: getRandomElements(allSizes, 3),
            colors: getRandomElements(allColors, 3),
            weight: faker.number.float({ min: 0.5, max: 10, precision: 0.01 }),
            dimensions: {
              length: faker.number.int({ min: 10, max: 100 }),
              width: faker.number.int({ min: 10, max: 100 }),
              height: faker.number.int({ min: 10, max: 100 }),
            },
            isFeatured: i % 3 === 0,
            isDealOfWeek: i % 5 === 0,
            isActive: true,
          });

          await product.save();
        }

        console.log(`✅ Seeded ${totalPerSubcategory} products → ${category.name} / ${sub.name}`);
      }
    }

    console.log('\n🎉 Product seeding complete. Browse /shop to verify!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding products:', err.message);
    process.exit(1);
  }
};

seedProducts();
