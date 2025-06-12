import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductImage } from '../../utils/getProductImage';
import { FaHeartBroken, FaTrashAlt, FaHeart } from 'react-icons/fa';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    setWishlistItems(items);
  }, []);

  const handleRemove = (id) => {
    const updated = wishlistItems.filter((item) => item._id !== id);
    localStorage.setItem('wishlistItems', JSON.stringify(updated));
    setWishlistItems(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-orange-600 mb-8 flex items-center gap-2">
        <FaHeart className="text-orange-500" /> My Wishlist
      </h2>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <FaHeartBroken className="text-5xl text-orange-400 mx-auto mb-4" />
          <p className="text-lg">You haven’t saved any products yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => {
            const hasDiscount =
              item.originalPrice && item.originalPrice > item.price;
            const discountPercentage = hasDiscount
              ? Math.round(
                  ((item.originalPrice - item.price) / item.originalPrice) * 100
                )
              : 0;

            return (
              <div
                key={item._id}
                onClick={() => navigate(`/product/${item._id}`)}
                className="relative bg-white rounded-lg shadow-sm hover:shadow-lg transition p-4 cursor-pointer flex flex-col group"
              >
                {/* 🏷 Discount Badge */}
                {hasDiscount && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded z-10">
                    -{discountPercentage}%
                  </div>
                )}

                {/* 🖼 Product Image */}
                <img
                  src={getProductImage(item.images)}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded mb-4"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/default-product.png';
                  }}
                />

                {/* 📝 Info */}
                <h4 className="text-gray-900 font-semibold line-clamp-1">
                  {item.name}
                </h4>

                <p className="text-sm mt-1">
                  <span className="text-orange-600 font-bold">
                    Ksh {item.price.toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <span className="ml-2 text-xs line-through text-gray-400">
                      Ksh {item.originalPrice.toLocaleString()}
                    </span>
                  )}
                </p>

                {/* ❌ Remove Button */}
                <div className="mt-auto text-right pt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(item._id);
                    }}
                    className="text-sm text-red-600 hover:underline flex items-center gap-1"
                  >
                    <FaTrashAlt /> Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
