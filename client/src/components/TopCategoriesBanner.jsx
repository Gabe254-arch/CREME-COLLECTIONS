import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MdCategory } from 'react-icons/md';

const TopCategoriesBanner = () => {
  const [topCategories, setTopCategories] = useState([]);

  useEffect(() => {
    const fetchTopCategories = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/categories/top');
        setTopCategories(data);
      } catch (err) {
        console.error('❌ Failed to fetch top categories:', err.message);
      }
    };

    fetchTopCategories();
  }, []);

  return (
    <div className="bg-white px-4 md:px-10 lg:px-20 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <MdCategory className="text-orange-500" />
          Top Categories
        </h2>
        <Link
          to="/shop"
          className="text-sm text-orange-600 hover:underline font-medium"
        >
          Browse All
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {topCategories.map((cat) => (
          <Link
            to={`/shop/${cat.slug}`}
            key={cat._id}
            className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg shadow hover:shadow-md hover:bg-white transition"
          >
            <img
              src={cat.icon || '/default-category.png'}
              alt={cat.name}
              className="w-16 h-16 object-contain"
            />
            <span className="text-sm font-medium text-gray-700">{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopCategoriesBanner;
