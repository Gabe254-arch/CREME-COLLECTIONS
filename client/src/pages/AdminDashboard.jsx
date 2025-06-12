import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import RevenueChart from '../components/RevenueChart';
import {
  FaUserFriends,
  FaBoxOpen,
  FaMoneyBillWave,
  FaBolt,
  FaStar,
  FaSignOutAlt,
  FaArrowLeft,
  FaClipboardList,
  FaPlusCircle,
  FaUserCog,
  FaWarehouse,
  FaUserShield,
} from 'react-icons/fa';
import AdminCoreLayout from '../layouts/AdminCoreLayout';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const [stats, setStats] = useState({ orders: 0, revenue: 0, users: 0 });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!userInfo?.token || !['admin', 'superadmin', 'shopmanager'].includes(userInfo.role)) {
      alert('🚫 Access denied: Admins only.');
      navigate('/login');
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const ordersRes = await axios.get('http://localhost:5000/api/orders/all', config);

        let usersRes = { data: [] };
        if (['admin', 'superadmin'].includes(userInfo.role)) {
          usersRes = await axios.get('http://localhost:5000/api/users', config);
        }

        const paidOrders = ordersRes.data.filter((o) => o.isPaid);
        const totalRevenue = paidOrders.reduce((acc, cur) => acc + cur.totalPrice, 0);

        setStats({
          orders: ordersRes.data.length,
          revenue: totalRevenue,
          users: usersRes.data.length || 0,
        });

        setChartData([
          { day: 'Mon', total: totalRevenue * 0.1 },
          { day: 'Tue', total: totalRevenue * 0.15 },
          { day: 'Wed', total: totalRevenue * 0.2 },
          { day: 'Thu', total: totalRevenue * 0.1 },
          { day: 'Fri', total: totalRevenue * 0.25 },
          { day: 'Sat', total: totalRevenue * 0.15 },
          { day: 'Sun', total: totalRevenue * 0.05 },
        ]);
      } catch (err) {
        console.error('❌ Failed to fetch admin stats:', err.message);
        alert('Failed to load admin data.');
      }
    };

    if (userInfo?.token) fetchStats();
  }, [userInfo.token]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <AdminCoreLayout>
      <div style={layout.main}>
        {/* 🔝 Top Controls */}
        <div style={styles.topBar}>
          <button onClick={() => navigate('/')} style={styles.backBtn}>
            <FaArrowLeft /> Back to Home
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Greeting */}
        <h2 style={styles.pageTitle}>Welcome, {userInfo.name || 'Admin'}!</h2>
        <p style={styles.roleInfo}>
          <FaUserShield style={{ marginRight: '6px' }} />
          Your role: <strong>{userInfo.role}</strong>
        </p>

        {/* KPIs */}
        <div style={styles.kpiGrid}>
          <KPIBox title="Total Revenue" icon={<FaMoneyBillWave />} value={`Ksh ${stats.revenue.toLocaleString()}`} />
          <KPIBox title="Total Orders" icon={<FaBoxOpen />} value={stats.orders} />
          {['admin', 'superadmin'].includes(userInfo.role) && (
            <KPIBox title="Total Users" icon={<FaUserFriends />} value={stats.users} />
          )}
        </div>

        {/* Revenue Chart */}
        <div style={styles.sectionBox}>
          <RevenueChart data={chartData} />
        </div>

        {/* Top Products */}
        <div style={styles.sectionBox}>
          <h3 style={styles.sectionTitle}>
            <FaStar style={{ marginRight: '6px' }} />
            Top Selling Products
          </h3>
          <ul style={styles.linkList}>
            <li>Samsung Galaxy A54 - 134 Units</li>
            <li>JBL Bluetooth Speaker - 98 Units</li>
            <li>Nike Air Max - 83 Units</li>
          </ul>
        </div>

        {/* Low Stock */}
        <div style={styles.sectionBox}>
          <h3 style={styles.sectionTitle}>
            <FaBolt style={{ marginRight: '6px' }} />
            Low Stock Alerts
          </h3>
          <ul style={styles.linkList}>
            <li>HP Laptop - Only 3 left</li>
            <li>iPhone 13 Case - Only 2 left</li>
          </ul>
        </div>

        {/* Links */}
        <div style={styles.sectionBox}>
          <h3 style={styles.sectionTitle}>Quick Navigation</h3>
          <ul style={styles.linkList}>
            <li><Link to="/admin/orders"><FaClipboardList /> View All Orders</Link></li>
            <li><Link to="/admin/products"><FaWarehouse /> Manage Products</Link></li>
            {['admin', 'superadmin'].includes(userInfo.role) && (
              <>
                <li><Link to="/admin/users"><FaUserCog /> Manage Users</Link></li>
                <li><Link to="/admin/product/new"><FaPlusCircle /> Add New Product</Link></li>
              </>
            )}
          </ul>
        </div>

        {/* Profile */}
        <div style={styles.sectionBox}>
          <h3>Profile Info</h3>
          <p><strong>Name:</strong> {userInfo.name}</p>
          <p><strong>Email:</strong> <input value={userInfo.email} readOnly style={styles.emailField} /></p>
          <p style={{ fontSize: '0.9rem', color: '#999' }}>
            Email changes must be requested from Super Admin.
          </p>
        </div>

        {/* Super Admin Logs */}
        {userInfo.role === 'superadmin' && (
          <div style={styles.sectionBox}>
            <h3>Recent Activity (Super Admin)</h3>
            <p style={{ color: '#666' }}>Logs coming soon...</p>
          </div>
        )}
      </div>
    </AdminCoreLayout>
  );
};

// KPI card
const KPIBox = ({ title, value, icon }) => (
  <div style={styles.kpiCard}>
    <div style={styles.kpiIcon}>{icon}</div>
    <h4 style={{ marginBottom: '0.5rem' }}>{title}</h4>
    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>{value}</p>
  </div>
);

// Styling
const layout = {
  main: {
    flex: 1,
    padding: '2rem',
    backgroundColor: '#f9f9f9',
  },
};

const styles = {
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#007bff',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '1rem',
  },
  logoutBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '5px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  pageTitle: {
    fontSize: '1.8rem',
    marginBottom: '0.5rem',
  },
  roleInfo: {
    color: '#666',
    marginBottom: '2rem',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  kpiCard: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  kpiIcon: {
    fontSize: '1.5rem',
    color: '#007bff',
    marginBottom: '0.5rem',
  },
  sectionBox: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
  },
  sectionTitle: {
    marginBottom: '1rem',
    color: '#444',
  },
  linkList: {
    listStyle: 'none',
    paddingLeft: 0,
    lineHeight: 2,
  },
  emailField: {
    border: '1px solid #ccc',
    padding: '0.3rem',
    borderRadius: '4px',
    width: '100%',
    maxWidth: '300px',
  },
};

export default AdminDashboard;
