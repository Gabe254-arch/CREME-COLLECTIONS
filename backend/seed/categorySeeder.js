const mongoose = require('mongoose');
const dotenv = require('dotenv');
const slugify = require('slugify');
const path = require('path');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');

// ✅ Load .env file from backend folder
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('🟢 MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

const seedCategories = async () => {
  try {
    console.log('\n🔄 Starting category & subcategory seeding...');
    console.log('🧹 Clearing existing categories and subcategories...');

    await Category.deleteMany();
    await SubCategory.deleteMany();

    const categoriesData = [
      { name: 'Electronics', description: 'Phones, laptops, and tech gadgets' },
      { name: 'Fashion', description: 'Men and women clothing & accessories' },
      { name: 'Health & Beauty', description: 'Skin, hair, wellness, supplements' },
      { name: 'Home Appliances', description: 'Kitchen, living, electronics' },
      { name: 'Baby Products', description: 'Newborn and toddler essentials' },
      { name: 'Computing', description: 'Desktops, laptops, accessories' },
      { name: 'Phones & Tablets', description: 'Smartphones, iPads, accessories' },
    ];

    // Generate slug and clean names
    const categories = categoriesData.map((cat) => ({
      ...cat,
      slug: slugify(cat.name, { lower: true, strict: true }),
    }));

    const createdCategories = await Category.insertMany(categories);

    const subcategories = [
      { name: 'Smartphones', category: createdCategories[0]._id },
      { name: 'Laptops', category: createdCategories[0]._id },
      { name: 'Men Clothing', category: createdCategories[1]._id },
      { name: 'Women Clothing', category: createdCategories[1]._id },
      { name: 'Skincare', category: createdCategories[2]._id },
      { name: 'Kitchen Appliances', category: createdCategories[3]._id },
    ];

    const createdSubcategories = await SubCategory.insertMany(subcategories);

    console.log('\n✅ Seeding Completed');
    console.log('📂 Categories created:', createdCategories.length);
    console.log('📂 Subcategories created:', createdSubcategories.length);
    console.log('🏁 Seeder finished at:', new Date().toLocaleTimeString());
    console.log('----------------------------------------------\n');

    process.exit();
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seedCategories();
