// components/AdminSidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaChartBar, FaUsers, FaClipboardList, FaCogs,
  FaBoxOpen, FaPlusCircle, FaSun, FaMoon, FaFileAlt, FaThLarge
} from 'react-icons/fa';

const AdminSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    if (window.innerWidth < 768) setCollapsed(true);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const role = userInfo?.role;

  const navItems = [
    { label: 'Overview', icon: <FaChartBar />, path: '/admin/overview', roles: ['admin', 'superadmin'] },
    { label: 'Dashboard', icon: <FaThLarge />, path: '/admin', roles: ['admin', 'superadmin', 'shopmanager'] },
    { label: 'Orders', icon: <FaClipboardList />, path: '/admin/orders', roles: ['admin', 'superadmin', 'shopmanager'] },
    { label: 'Products', icon: <FaBoxOpen />, path: '/admin/products', roles: ['admin', 'superadmin', 'shopmanager'] },
    { label: 'Add Product', icon: <FaPlusCircle />, path: '/admin/product/new', roles: ['admin', 'superadmin', 'shopmanager'] },
    { label: 'Users', icon: <FaUsers />, path: '/admin/users', roles: ['admin', 'superadmin'] },
    { label: 'Logs', icon: <FaFileAlt />, path: '/admin/logs', roles: ['admin', 'superadmin'] },
    { label: 'Log Summary', icon: <FaCogs />, path: '/admin/summary', roles: ['admin', 'superadmin'] },
  ];

  useEffect(() => {
    document.body.className = isDark ? 'dark-mode' : '';
    localStorage.setItem('darkMode', isDark);
  }, [isDark]);

  return (
    <aside
      style={{
        ...styles.sidebar,
        width: collapsed ? '60px' : '240px',
        backgroundColor: isDark ? '#1f1f1f' : '#ffffff',
        color: isDark ? '#f0f0f0' : '#333',
      }}
    >
      <div style={styles.topBar}>
        {!collapsed && <h2 style={styles.brand}>🧠 Admin Panel</h2>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={styles.toggleBtn}
          aria-label="Toggle Sidebar"
        >
          {collapsed ? '👉' : '👈'}
        </button>
      </div>

      <div style={styles.menuScroll}>
        <ul style={styles.navList}>
          {navItems
            .filter(item => item.roles.includes(role))
            .map(item => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  title={item.label}
                  style={{
                    ...styles.navLink,
                    ...(location.pathname === item.path ? styles.active : {}),
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    color: isDark ? '#ccc' : '#444',
                  }}
                >
                  <span className="mr-2">{item.icon}</span>
                  {!collapsed && item.label}
                </Link>
              </li>
            ))}
        </ul>
      </div>

      <div style={styles.footer}>
        <button
          onClick={() => setIsDark(prev => !prev)}
          style={styles.darkToggle}
          title="Toggle Theme"
        >
          {isDark ? <><FaSun className="mr-1" /> Light Mode</> : <><FaMoon className="mr-1" /> Dark Mode</>}
        </button>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    minHeight: '100vh',
    position: 'sticky',
    top: 0,
    transition: 'width 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflowY: 'auto',
    borderRight: '1px solid #eee',
    zIndex: 50,
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
  },
  brand: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.3rem',
    cursor: 'pointer',
    color: '#888',
  },
  menuScroll: {
    flex: 1,
    padding: '0 0.5rem',
  },
  navList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.7rem 1rem',
    textDecoration: 'none',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    fontSize: '0.95rem',
    marginBottom: '0.3rem',
  },
  active: {
    backgroundColor: '#e6f1ff',
    fontWeight: 'bold',
    color: '#007bff',
  },
  footer: {
    textAlign: 'center',
    padding: '1rem',
  },
  darkToggle: {
    background: '#007bff',
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '5px',
    color: '#fff',
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    cursor: 'pointer',
  },
};

export default AdminSidebar;
