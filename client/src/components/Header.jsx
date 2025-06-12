import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/authContext';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Header = () => {
  const { cartItems } = useCart();
  const { userInfo, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const itemCount = cartItems.reduce((acc, item) => acc + (item.quantity || item.qty || 1), 0);
  const role = userInfo?.role;

  const getDashboardLink = () => {
    switch (role) {
      case 'admin':
      case 'superadmin':
        return '/admin';
      case 'shopmanager':
        return '/shopmanager';
      default:
        return '/account';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    const newTheme = darkMode ? 'light' : 'dark';
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark', !darkMode);
    localStorage.setItem('theme', newTheme);
  };

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/categories/with-subcategories');
        setCategories(data);
      } catch (err) {
        console.error('❌ Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <header
      className={`transition-all duration-300 sticky top-0 z-50 shadow-md ${
        isScrolled ? 'bg-orange-600 text-white' : 'bg-orange-500 text-black'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center gap-3">
        {/* 🔗 Logo & Hamburger */}
        <div className="flex items-center gap-4">
          <button className="md:hidden" onClick={toggleMobileMenu}>
            <i className="fas fa-bars text-xl"></i>
          </button>
          <Link
            to="/"
            className="text-xl font-extrabold tracking-wide flex items-center gap-2 hover:text-white transition"
          >
            <img src="/logo192.png" alt="logo" className="w-6 h-6" />
            Creme
          </Link>
        </div>

        {/* 🌐 Main Navigation (Desktop) */}
        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
          <Link to="/shop" className="hover:text-white transition">
            Shop
          </Link>
          {role && (
            <Link to={getDashboardLink()} className="hover:text-white transition">
              <i className="fas fa-tools mr-1"></i> Dashboard
            </Link>
          )}
          {isAuthenticated && (
            <Link to="/account/orders" className="hover:text-white transition">
              <i className="fas fa-box-open mr-1"></i> My Orders
            </Link>
          )}
          <button
            onClick={toggleTheme}
            className="hover:text-white transition"
            title="Toggle dark mode"
          >
            <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
        </div>

        {/* 🔐 Auth / Cart */}
        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="bg-white text-black px-3 py-1 rounded hover:bg-orange-100 flex items-center gap-1 transition"
              >
                <i className="fas fa-sign-in-alt"></i> Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-black px-3 py-1 rounded hover:bg-orange-100 flex items-center gap-1 transition"
              >
                <i className="fas fa-user-plus"></i> Register
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm flex items-center gap-2 font-semibold">
                <i className="fas fa-user-circle"></i> {userInfo?.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center gap-2 transition"
              >
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </>
          )}
          <Link
            to="/cart"
            className="relative bg-white text-black px-3 py-1 rounded hover:bg-orange-100 flex items-center gap-1 transition"
          >
            <i className="fas fa-shopping-cart"></i> Cart
            <span className="ml-1 text-orange-600 font-bold">({itemCount})</span>
          </Link>
        </div>
      </div>

      {/* 📱 Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-orange-600 text-white px-4 py-4 space-y-4">
          <Link to="/shop" onClick={toggleMobileMenu} className="block font-medium">
            <i className="fas fa-store mr-2"></i> Shop
          </Link>

          {categories.map((cat) => (
            <div key={cat._id}>
              <p className="font-semibold">{cat.name}</p>
              <ul className="ml-4 space-y-1">
                {cat.subcategories.map((sub) => (
                  <li key={sub._id}>
                    <Link
                      to={`/shop/${cat.slug}/${sub.slug}`}
                      className="block hover:underline"
                      onClick={toggleMobileMenu}
                    >
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {role && (
            <Link to={getDashboardLink()} onClick={toggleMobileMenu} className="block">
              <i className="fas fa-tachometer-alt mr-2"></i> Dashboard
            </Link>
          )}
          {isAuthenticated && (
            <Link to="/account/orders" onClick={toggleMobileMenu} className="block">
              <i className="fas fa-box-open mr-2"></i> My Orders
            </Link>
          )}
          <button onClick={toggleTheme} className="block w-full text-left">
            <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} mr-2`}></i>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
