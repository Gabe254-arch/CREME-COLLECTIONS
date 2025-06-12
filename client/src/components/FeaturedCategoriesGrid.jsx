import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaTags } from 'react-icons/fa';

const FeaturedCategoriesGrid = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/categories');
        setCategories(data);
      } catch (error) {
        console.error('❌ Failed to fetch categories:', error);
      }
    };

    fetchCats();
  }, []);

  return (
    <div className="py-8">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FaTags className="text-orange-500" />
        Explore Categories
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link
            to={`/shop/${cat.slug}`}
            key={cat._id}
            className="group rounded-lg bg-white shadow-md hover:shadow-xl transition overflow-hidden relative"
          >
            <img
              src={cat.image || '/default-category.jpg'}
              alt={cat.name}
              className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute bottom-0 w-full bg-black bg-opacity-40 text-white text-center py-2 text-sm font-semibold group-hover:bg-opacity-60">
              {cat.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCategoriesGrid;
