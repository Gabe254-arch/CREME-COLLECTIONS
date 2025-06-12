import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FeaturedCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('/api/categories')
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  return (
    <div className="flex overflow-x-auto py-4 space-x-4 bg-white shadow rounded px-3">
      {categories.map(cat => (
        <Link
          key={cat._id}
          to={`/shop/${cat.slug}`}
          className="text-sm text-gray-700 hover:text-orange-600 whitespace-nowrap"
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
};

export default FeaturedCategories;
