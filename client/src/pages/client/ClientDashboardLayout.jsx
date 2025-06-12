import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  FaUserCircle,
  FaClipboardList,
  FaHeart,
  FaAddressBook,
  FaHeadset,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBell
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ClientDashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (!storedUser?.token) {
      navigate('/login');
    } else {
      setUserInfo(storedUser);
      if (location.pathname === '/account') {
        navigate('/account/orders');
      }
    }
  }, [navigate, location.pathname]);

  useEffect(() => {
    // 📡 Simulate fetching notifications from backend
    const sampleNotifications = [
      { id: 1, message: '🎉 Order #2323 has been shipped!' },
      { id: 2, message: '🔥 New deal on electronics just dropped!' },
      { id: 3, message: '📦 Your wishlist item is back in stock!' },
    ];
    setNotifications(sampleNotifications);
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('userInfo');
      navigate('/login');
    }
  };

  const navLinks = [
    { to: '/account/profile', icon: <FaUserCircle />, label: 'Profile' },
    { to: '/account/orders', icon: <FaClipboardList />, label: 'My Orders' },
    { to: '/account/wishlist', icon: <FaHeart />, label: 'Wishlist' },
    { to: '/account/address', icon: <FaAddressBook />, label: 'Address Book' },
    { to: '/account/support', icon: <FaHeadset />, label: 'Support' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-800 relative font-sans">
      <button
        className="absolute top-4 left-4 md:hidden z-50 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded shadow-md focus:outline-none"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      <aside
        className={`fixed z-40 top-0 left-0 h-full bg-white shadow-lg p-6 w-64 transition-transform duration-300 ease-in-out transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:block`}
      >
        <h1 className="text-2xl font-bold text-orange-600 mb-10 tracking-tight">
          Creme <span className="text-[#002147]">Dashboard</span>
        </h1>

        <nav className="space-y-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-orange-100 transition-all ${
                  isActive
                    ? 'bg-orange-200 text-orange-700 font-semibold'
                    : 'text-gray-700'
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-10 border-t border-gray-200 pt-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-red-600 hover:text-red-700 hover:font-medium transition-all"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 bg-gray-50 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            Welcome back, <strong>{userInfo?.name}</strong>
          </div>
          <div className="relative">
            <FaBell className="text-orange-600 text-xl animate-bounce" />
            {notifications.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {notifications.length}
              </span>
            )}
          </div>
        </div>

        <AnimatePresence>
          {notifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="bg-white shadow-md rounded-md p-4 mb-6 space-y-2 border-l-4 border-orange-500"
            >
              {notifications.map((note) => (
                <div
                  key={note.id}
                  className="text-sm text-gray-700 flex justify-between items-center"
                >
                  <span>{note.message}</span>
                  <button
                    onClick={() =>
                      setNotifications((prev) =>
                        prev.filter((n) => n.id !== note.id)
                      )
                    }
                    className="text-xs text-red-500 hover:text-red-600"
                  >
                    Dismiss
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <Outlet />
      </main>
    </div>
  );
};

export default ClientDashboardLayout;
