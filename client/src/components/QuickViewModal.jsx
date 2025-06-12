// ✅ Enhanced QuickViewModal.jsx for Creme Collections
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductImage } from '../utils/getProductImage';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const QuickViewModal = ({ product, onClose, wishlist = [], toggleWishlist = () => {} }) => {
  if (!product) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 relative"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1, transition: { type: 'spring', stiffness: 200 } }}
          exit={{ scale: 0.95 }}
        >
          {/* ✖ Close button */}
          <button
            className="absolute top-3 right-4 text-red-500 font-bold text-xl hover:text-red-700"
            onClick={onClose}
            title="Close"
          >
            ×
          </button>

          <div className="flex flex-col sm:flex-row gap-6">
            {/* 🖼️ Product Image */}
            <img
              src={getProductImage(product.images)}
              alt={product.name}
              className="w-full sm:w-1/2 h-52 sm:h-64 object-cover rounded"
            />

            {/* 📦 Product Details */}
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                {/* ❤️ Wishlist Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  title="Add to Wishlist"
                  className="text-orange-500 hover:text-red-600 text-lg"
                >
                  {wishlist.find(item => item._id === product._id) ? <FaHeart /> : <FaRegHeart />}
                </button>
              </div>

              {product?.brand && (
                <p className="text-sm text-gray-600">Brand: <span className="font-medium text-gray-800">{product.brand}</span></p>
              )}
              {product?.subcategory?.name && (
                <p className="text-sm text-gray-600">Subcategory: <span className="font-medium text-gray-800">{product.subcategory.name}</span></p>
              )}
              <p className="text-sm text-gray-600">{product.description?.slice(0, 180) || 'No description available.'}</p>

              {/* 💰 Price */}
              <p className="text-lg font-bold text-orange-600">
                Ksh {product.price.toLocaleString()}
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="ml-2 text-xs line-through text-gray-400 font-normal">
                    Ksh {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </p>

              {/* 🛒 Add to Cart Button */}
              <button
                onClick={() => {
                  // TODO: 🔁 Replace with addToCart(product)
                  alert('🛒 Added to cart!');
                  onClose();
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickViewModal;
