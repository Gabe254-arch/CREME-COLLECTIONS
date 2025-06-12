// backend/seed/productTaxonomySeeder.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../config/db');

// 🧬 Load Models
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');

// 🌍 Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

if (!process.env.MONGO_URI) {
  console.error('❌ Missing MONGO_URI in .env file. Check your configuration.');
  process.exit(1);
}

console.log('🔐 Mongo URI Loaded Successfully');

// 🔌 Connect to MongoDB
connectDB();

const seedTaxonomy = async () => {
  try {
    console.log('🧹 Clearing existing Category and SubCategory data...');
    await SubCategory.deleteMany();
    await Category.deleteMany();

    // 📦 Master Category + Subcategory structure
    const categories = [
      {
        name: 'Phones & Tablets',
        slug: 'phones-tablets',
        description: 'Latest smartphones, tablets and accessories.',
        subcategories: ['Smartphones', 'Feature Phones', 'Tablets', 'Tablet Accessories'],
      },
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'High quality televisions, speakers and audio equipment.',
        subcategories: ['Televisions', 'Home Theaters', 'Speakers', 'Projectors'],
      },
      {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Stylish and affordable fashion for all ages.',
        subcategories: ['Men Clothing', 'Women Clothing', 'Kids Clothing', 'Shoes', 'Watches'],
      },
      {
        name: 'Health & Beauty',
        slug: 'health-beauty',
        description: 'Fragrances, makeup and personal care essentials.',
        subcategories: ['Fragrances', 'Makeup', 'Hair Care', 'Skin Care', 'Massage & Relaxation'],
      },
      {
        name: 'Appliances',
        slug: 'appliances',
        description: 'Essential home appliances and kitchen equipment.',
        subcategories: ['Refrigerators', 'Cookers', 'Washing Machines', 'Microwaves', 'Fans & Air Conditioners'],
      },
      {
        name: 'Computing',
        slug: 'computing',
        description: 'Computers, laptops and accessories for productivity.',
        subcategories: ['Laptops', 'Desktops', 'Monitors', 'Printers', 'Computer Accessories'],
      },
      {
        name: 'Baby Products',
        slug: 'baby-products',
        description: 'All you need for your little ones.',
        subcategories: ['Diapers', 'Baby Gear', 'Toys', 'Feeding'],
      },
      {
        name: 'Gaming',
        slug: 'gaming',
        description: 'Consoles, games and accessories for gamers.',
        subcategories: ['Consoles', 'Video Games', 'Controllers', 'Gaming Chairs'],
      },
      {
        name: 'Home & Furniture',
        slug: 'home-furniture',
        description: 'Modern furniture and home improvement products.',
        subcategories: ['Beds & Mattresses', 'Living Room Furniture', 'Home Decor', 'Lighting'],
      },
      {
        name: 'Automotive',
        slug: 'automotive',
        description: 'Car tools, accessories and maintenance items.',
        subcategories: ['Car Electronics', 'Tyres & Batteries', 'Interior Accessories', 'Car Tools'],
      },
    ];

    // 🔁 Seed each category and its subcategories
    for (const cat of categories) {
      const createdCat = await Category.create({
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        // image: '', // Optional: future support
      });

     const slugify = require('slugify'); // 🧠 Add this at the top if not present

const subcats = cat.subcategories.map((sub) => ({
  name: sub,
  slug: slugify(sub.toLowerCase()), // ✅ Add slug field
  category: createdCat._id,
}));


      await SubCategory.insertMany(subcats);

      console.log(`✅ Seeded: ${cat.name} with ${subcats.length} subcategories.`);
    }

    console.log('\n🎉 Taxonomy seeding complete. Categories and subcategories are now in your DB.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during taxonomy seeding:', err.message);
    process.exit(1);
  }
};

// 🚀 Run the seeder
seedTaxonomy();
