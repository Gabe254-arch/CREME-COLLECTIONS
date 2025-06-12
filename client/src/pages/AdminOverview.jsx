import React, { useEffect, useState, useRef } from 'react';
import {
  FaChartLine, FaUsers, FaBox, FaClipboardList, FaCheckCircle,
  FaExclamationTriangle, FaMoneyBillWave, FaDownload
} from 'react-icons/fa';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const BASE_URL = 'http://localhost:5000';
const COLORS = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#17a2b8'];

const AdminOverview = () => {
  const dashboardRef = useRef();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const token = userInfo?.token;

  const [summary, setSummary] = useState({});
  const [revenueChart, setRevenueChart] = useState([]);
  const [categoryPie, setCategoryPie] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [adminLogs, setAdminLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !['admin', 'superadmin'].includes(userInfo.role)) {
      toast.error('Access denied');
      return;
    }

    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [usersRes, ordersRes, productsRes, categoriesRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/users`, config),
          axios.get(`${BASE_URL}/api/orders/all`, config),
          axios.get(`${BASE_URL}/api/products`, config),
          axios.get(`${BASE_URL}/api/categories`, config),
        ]);

        const users = usersRes.data;
        const orders = ordersRes.data;
        const products = productsRes.data.products || productsRes.data;
        const categories = categoriesRes.data;

        const paidOrders = orders.filter(o => o.isPaid);
        const revenue = paidOrders.reduce((sum, o) => sum + o.totalPrice, 0);
        const avgOrder = paidOrders.length ? revenue / paidOrders.length : 0;
        const lowStock = products.filter(p => p.countInStock < 5).length;

        // Revenue by Day
        const revenueByDay = {};
        const topMap = {};
        const today = new Date().toLocaleDateString();
        let dailyOrders = 0;
        let dailyRevenue = 0;

        paidOrders.forEach(order => {
          const date = new Date(order.paidAt).toLocaleDateString();
          revenueByDay[date] = (revenueByDay[date] || 0) + order.totalPrice;
          if (date === today) {
            dailyOrders++;
            dailyRevenue += order.totalPrice;
          }
          order.orderItems.forEach(item => {
            topMap[item.product] = topMap[item.product] || { name: item.name, qty: 0 };
            topMap[item.product].qty += item.qty;
          });
        });

        const top = Object.values(topMap).sort((a, b) => b.qty - a.qty).slice(0, 5);

        // Category Pie
        const categoryCount = {};
        products.forEach(p => {
          const cat = p.category?.name || 'Uncategorized';
          categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        });

        setSummary({
          users: users.length,
          orders: orders.length,
          revenue,
          avgOrder,
          products: products.length,
          lowStock,
          categories: categories.length,
          paidOrders: paidOrders.length,
          unpaidOrders: orders.length - paidOrders.length,
          deliveredOrders: orders.filter(o => o.isDelivered).length,
          undeliveredOrders: orders.filter(o => !o.isDelivered).length,
          dailyOrders,
          dailyRevenue,
        });

        setRevenueChart(Object.entries(revenueByDay).map(([day, revenue]) => ({ day, revenue })));
        setCategoryPie(Object.entries(categoryCount).map(([name, value]) => ({ name, value })));
        setTopProducts(top);
        setAdminLogs([
          { admin: 'Gabriel', role: 'superadmin', action: 'Updated product data', date: 'Today' },
          { admin: 'David', role: 'admin', action: 'Reviewed low stock', date: 'Yesterday' },
        ]);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token, userInfo.role]);

  const exportPDF = () => {
    html2canvas(dashboardRef.current).then(canvas => {
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(img, 'PNG', 10, 10, 190, 0);
      pdf.save('overview.pdf');
    });
  };

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([summary]);
    XLSX.utils.book_append_sheet(wb, ws, 'Overview');
    XLSX.writeFile(wb, 'overview.xlsx');
  };

  return (
    <div ref={dashboardRef} className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header + Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaChartLine className="text-blue-500" /> Admin Dashboard Overview
        </h2>
        <div className="flex gap-3">
          <button onClick={exportPDF} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
            Export PDF
          </button>
          <button onClick={exportExcel} className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">
            Export Excel
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
        {[
          { label: 'Users', value: summary.users, icon: <FaUsers className="text-orange-500" /> },
          { label: 'Orders', value: summary.orders, icon: <FaClipboardList className="text-purple-500" /> },
          { label: 'Revenue', value: `Ksh ${summary.revenue?.toLocaleString()}`, icon: <FaMoneyBillWave className="text-green-600" /> },
          { label: 'Low Stock', value: summary.lowStock, icon: <FaExclamationTriangle className="text-red-500" /> },
          { label: 'Products', value: summary.products, icon: <FaBox className="text-blue-600" /> },
          { label: 'Categories', value: summary.categories, icon: <FaClipboardList className="text-gray-500" /> }
        ].map(({ label, value, icon }, i) => (
          <div key={i} className="bg-white p-4 rounded shadow text-center">
            <div className="text-sm text-gray-600">{label}</div>
            <div className="text-lg font-bold flex justify-center items-center gap-2">{icon} {value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-3">Revenue Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#28a745" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-3">Product Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryPie}
                dataKey="value"
                nameKey="name"
                cx="50%" cy="50%" outerRadius={90}
                label
              >
                {categoryPie.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Logs and Top Sellers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Admin Logs */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-3">Admin Activity Logs</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            {adminLogs.map((log, i) => (
              <li key={i}>
                <strong>{log.admin}</strong> ({log.role}) – {log.action} on{' '}
                <span className="text-gray-500">{log.date}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-3">Top-Selling Products</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            {topProducts.map((p, i) => (
              <li key={i}>{i + 1}. <strong>{p.name}</strong> — {p.qty} sold</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
