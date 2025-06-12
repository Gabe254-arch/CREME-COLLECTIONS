import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaHeart,
  FaShoppingCart,
  FaUserCircle,
  FaSearch,
} from 'react-icons/fa';

const Navbar = () => {
  const [keyword, setKeyword] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 🔄 Load cart, wishlist & user
  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || null;

    const count = cartItems.reduce((total, item) => total + (item.qty || item.quantity || 1), 0);

    setCartCount(count);
    setWishlistCount(wishlistItems.length);
    setUser(userInfo);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/shop?search=${encodeURIComponent(keyword.trim())}`);
      setKeyword('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
    window.location.reload();
  };

  const renderRoleLinks = () => {
    if (!user) return null;
    switch (user.role) {
      case 'admin':
        return <Link to="/admin" className="hover:text-orange-500">Admin</Link>;
      case 'superadmin':
        return <Link to="/superadmin" className="hover:text-orange-500">SuperAdmin</Link>;
      case 'shopmanager':
        return <Link to="/shopmanager" className="hover:text-orange-500">Shop Manager</Link>;
      default:
        return <Link to="/account" className="hover:text-orange-500">My Account</Link>;
    }
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50 transition-all duration-300 border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-5 animate-fadeIn">
        {/* 🔗 Brand Links */}
        <div className="flex items-center gap-6 text-orange-600 font-bold text-lg">
          <Link to="/" className="hover:text-orange-500 transition">Creme</Link>
          <Link to="/shop" className="hover:text-orange-500 transition">Shop</Link>
          {renderRoleLinks()}
        </div>

        {/* 🔍 Search */}
        <form onSubmit={handleSearch} className="flex-1 mx-4 hidden sm:flex relative">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search products..."
            className="w-full border border-gray-300 rounded-full px-4 py-2 pr-10 text-sm focus:outline-orange-500"
          />
          <button type="submit" className="absolute right-3 top-2 text-gray-500 hover:text-orange-500">
            <FaSearch />
          </button>
        </form>

        {/* 👤 User & Icons */}
        <div className="flex items-center gap-4 text-gray-800 text-sm relative">
          {!user ? (
            <>
              <Link to="/login" className="hover:text-orange-600 transition">Login</Link>
              <Link to="/register" className="hover:text-orange-600 transition">Register</Link>
            </>
          ) : (
            <>
              <span className="hidden sm:block text-gray-700 font-medium">
                <FaUserCircle className="inline text-lg mr-1" />
                {user.name.split(' ')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 font-medium"
              >
                Logout
              </button>
            </>
          )}

          {/* 💖 Wishlist */}
          <Link to="/wishlist" className="relative hover:text-orange-600 transition">
            <FaHeart className="text-lg" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* 🛒 Cart */}
          <Link to="/cart" className="relative hover:text-orange-600 transition">
            <FaShoppingCart className="text-lg" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* 🔍 Mobile Search Bar */}
      <div className="sm:hidden px-5 pb-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search..."
            className="w-full border px-3 py-2 rounded-full text-sm focus:outline-orange-400"
          />
          <button type="submit" className="text-orange-600 text-lg">
            <FaSearch />
          </button>
        </form>
      </div>
    </header>
  );
};

export default Navbar;
