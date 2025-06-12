import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * 🔥 FlashSale – Curated short-term offers displayed in a modern responsive grid
 */
const FlashSale = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products?deal=flash-sale');
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('❌ Flash sale load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashSale();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-400 animate-pulse text-sm">
        Loading Flash Deals...
      </div>
    );
  }

  if (!products.length) return null;

  return (
    <section className="bg-white py-10 px-4 sm:px-6 md:px-10 lg:px-20">
      {/* 🔖 Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-orange-600 tracking-tight">
          🔥 Flash Sale
        </h2>
        <button
          onClick={() => navigate('/shop?deal=flash-sale')}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View All Deals →
        </button>
      </div>

      {/* 🛒 Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map(product => {
          const imgSrc = product.images?.[0]
            ? `http://localhost:5000${product.images[0]}`
            : '/default-product.png';

          const discount = product.originalPrice > product.price
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : null;

          return (
            <div
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
              className="group bg-white rounded-lg border border-gray-200 shadow hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
            >
              {/* 📸 Image */}
              <div className="relative h-44 overflow-hidden rounded-t-lg">
                <img
                  src={imgSrc}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = '/default-product.png';
                  }}
                />
                {discount && (
                  <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded shadow">
                    -{discount}%
                  </span>
                )}
              </div>

              {/* 📝 Info */}
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-800 truncate">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {product.description?.substring(0, 60)}...
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-orange-600 font-bold text-sm">
                    Ksh {Number(product.price).toLocaleString()}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-gray-400 line-through">
                      Ksh {Number(product.originalPrice).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FlashSale;
