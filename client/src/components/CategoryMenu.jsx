import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CategoryMenu = () => {
  const [categories, setCategories] = useState([]);
  const [hoveredCatId, setHoveredCatId] = useState(null);
  const [subcategories, setSubcategories] = useState({});
  const navigate = useNavigate();

  // 🚀 Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/categories');
        setCategories(data || []);
      } catch (err) {
        console.error('❌ Failed to load categories:', err.message);
      }
    };
    fetchCategories();
  }, []);

  // 🎯 Handle mouse hover
  const handleMouseEnter = async (cat) => {
    setHoveredCatId(cat._id);
    if (!subcategories[cat._id]) {
      try {
        const { data } = await axios.get(`/api/subcategories?category=${cat._id}`);
        setSubcategories((prev) => ({ ...prev, [cat._id]: data }));
      } catch (err) {
        console.error('❌ Failed to fetch subcategories:', err.message);
        setSubcategories((prev) => ({ ...prev, [cat._id]: [] }));
      }
    }
  };

  const handleMouseLeave = () => {
    setHoveredCatId(null);
  };

  return (
    <div className="relative z-50 bg-white border-b border-gray-200 px-4 md:px-8 lg:px-16 shadow-sm">
      <div className="flex gap-6 overflow-x-auto scrollbar-hide">
        {categories.map((cat) => (
          <div
            key={cat._id}
            onMouseEnter={() => handleMouseEnter(cat)}
            onMouseLeave={handleMouseLeave}
            className="relative group"
          >
            <button
              onClick={() => navigate(`/shop/${cat.slug}`)}
              className="text-sm font-semibold text-gray-800 hover:text-orange-600 px-3 py-2 transition rounded"
            >
              {cat.name}
            </button>

            {/* 🧭 Subcategory Mega Menu */}
            {hoveredCatId === cat._id && subcategories[cat._id]?.length > 0 && (
              <div
                className="absolute left-0 top-full mt-2 bg-white border border-gray-200 shadow-xl rounded-lg p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 min-w-[320px] max-w-screen-xl z-[9999]"
                style={{ minHeight: '200px' }}
              >
                {subcategories[cat._id].map((sub) => (
                  <div
                    key={sub._id}
                    onClick={() => navigate(`/shop/${cat.slug}/${sub.slug}`)}
                    className="cursor-pointer text-sm text-gray-700 hover:text-orange-600"
                  >
                    {sub.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;
