import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

const ProductCard = ({ product, onAddToCart }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [qty, setQty] = useState(1);

  // ✅ Load wishlist status from localStorage
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    setIsWishlisted(wishlist.some(item => item._id === product._id));
  }, [product._id]);

  // ✅ Toggle wishlist item
  const toggleWishlist = (e) => {
    e.stopPropagation();
    const wishlist = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    const exists = wishlist.find(item => item._id === product._id);
    const updated = exists
      ? wishlist.filter((item) => item._id !== product._id)
      : [...wishlist, product];
    localStorage.setItem('wishlistItems', JSON.stringify(updated));
    setIsWishlisted(!exists);
  };

  // ✅ Quantity control
  const handleQtyChange = (delta) => {
    setQty(prev => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (product.countInStock && next > product.countInStock) return product.countInStock;
      return next;
    });
  };

  // ✅ Determine image source
  const imageSrc = product?.images?.[0]
    ? product.images[0].startsWith('http')
      ? product.images[0]
      : `${BASE_URL}${product.images[0]}`
    : `${BASE_URL}/uploads/default-product.png`;

  return (
    <div className="relative bg-white rounded-lg border shadow-md hover:shadow-lg transition duration-300 group overflow-hidden p-3 flex flex-col justify-between">
      {/* ❤️ Wishlist Button */}
      <button
        onClick={toggleWishlist}
        className="absolute top-2 right-2 z-10 text-xl text-orange-500 hover:text-red-500 transition"
        title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
      >
        {isWishlisted ? <FaHeart /> : <FaRegHeart />}
      </button>

      {/* 🖼️ Product Image */}
      <Link to={`/product/${product._id}`} className="block">
        <img
          src={imageSrc}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `${BASE_URL}/uploads/default-product.png`;
          }}
          className="h-44 w-full object-contain p-2 transition group-hover:scale-105 duration-200"
        />
      </Link>

      {/* 📄 Product Info */}
      <div className="mt-2 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/product/${product._id}`} className="block text-sm font-semibold text-gray-800 hover:text-orange-600 truncate">
            {product.name}
          </Link>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {product.description?.slice(0, 80) || 'No description available.'}
          </p>

          <div className="mt-2 text-sm font-bold text-orange-600">
            Ksh {(product.price * qty).toLocaleString()}
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="ml-2 line-through text-gray-400 text-xs font-normal">
                Ksh {(product.originalPrice * qty).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* 🔢 Quantity Controls */}
        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() => handleQtyChange(-1)}
            className="px-2 py-1 border text-sm rounded hover:bg-gray-100"
          >−</button>
          <span className="text-sm">{qty}</span>
          <button
            onClick={() => handleQtyChange(1)}
            className="px-2 py-1 border text-sm rounded hover:bg-gray-100"
          >+</button>
        </div>

        {/* 🛒 Add to Cart */}
        <button
          onClick={() => onAddToCart?.({ ...product, quantity: qty })}
          className="mt-3 w-full bg-orange-500 text-white text-sm py-2 rounded hover:bg-orange-600 transition"
        >
          Add to Cart
        </button>
      </div>

      {/* 🔖 Badges */}
      {product?.isFeatured && (
        <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-sm">
          Featured
        </span>
      )}
      {product?.countInStock <= 5 && (
        <span className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded shadow-sm">
          Low Stock
        </span>
      )}
    </div>
  );
};

export default ProductCard;
