import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaTrash, FaMoneyBillAlt, FaTruck, FaFilePdf, FaFileCsv, FaSync, FaSearch, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const ordersPerPage = 10;
  const containerRef = useRef();

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  // 🔁 Fetch orders from backend
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/orders/all', config);
      setOrders(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load orders');
      if ([401, 403].includes(err.response?.status)) navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate, userInfo.token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const markPaid = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/pay`, {}, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      toast.success('Order marked as Paid');
      fetchOrders();
    } catch {
      toast.error('Failed to mark as Paid');
    }
  };

  const markDelivered = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/deliver`, {}, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      toast.success('Order marked as Delivered');
      fetchOrders();
    } catch {
      toast.error('Failed to mark as Delivered');
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      toast.success('Order deleted');
      fetchOrders();
    } catch {
      toast.error('Failed to delete order');
    }
  };

  const exportToPDF = () => {
    html2canvas(containerRef.current).then(canvas => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const img = canvas.toDataURL('image/png');
      pdf.addImage(img, 'PNG', 10, 10, 190, 0);
      pdf.save('orders.pdf');
    });
  };

  const exportToCSV = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(orders);
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, 'orders.csv');
  };

  // 🔍 Filter + paginate
  const filteredOrders = orders.filter(order => {
    const match = order._id.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(search.toLowerCase());

    if (statusFilter === 'all') return match;
    if (statusFilter === 'paid') return match && order.isPaid;
    if (statusFilter === 'unpaid') return match && !order.isPaid;
    if (statusFilter === 'delivered') return match && order.isDelivered;
    if (statusFilter === 'pending') return match && !order.isDelivered;

    return match;
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice((page - 1) * ordersPerPage, page * ordersPerPage);

  return (
    <div ref={containerRef} className="p-6 bg-gray-100 min-h-screen space-y-6">
      {/* 🔲 Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-orange-600">Order Management</h2>
        <div className="flex gap-2">
          <button onClick={fetchOrders} className="btn-icon bg-gray-200 hover:bg-gray-300">
            <FaSync className="text-gray-700" />
          </button>
          <button onClick={exportToPDF} className="btn-icon bg-red-600 hover:bg-red-700">
            <FaFilePdf className="text-white" />
          </button>
          <button onClick={exportToCSV} className="btn-icon bg-green-600 hover:bg-green-700">
            <FaFileCsv className="text-white" />
          </button>
        </div>
      </div>

      {/* 🔍 Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-1/2">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            type="text"
            placeholder="Search by Order ID / Email"
            className="pl-10 pr-4 py-2 border rounded w-full focus:outline-orange-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-2 rounded focus:outline-orange-500"
        >
          <option value="all">All</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="delivered">Delivered</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* 🧾 Orders */}
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin border-4 border-orange-500 border-t-transparent rounded-full w-10 h-10 mx-auto" />
          <p className="mt-2 text-gray-600">Loading orders...</p>
        </div>
      ) : paginatedOrders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="grid gap-4">
          {paginatedOrders.map(order => (
            <div
              key={order._id}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition-all duration-300 border-l-4"
              style={{ borderColor: order.isPaid ? '#16a34a' : '#dc2626' }}
            >
              <div className="flex justify-between items-start flex-wrap">
                <div>
                  <Link to={`/admin/orders/${order._id}`} className="text-blue-600 font-semibold hover:underline">
                    #{order._id}
                  </Link>
                  <p className="text-sm text-gray-700 mt-1">
                    {order.user?.email || 'N/A'}<br />
                    {new Date(order.createdAt).toLocaleString()}<br />
                    <strong className="text-orange-600">Ksh {order.totalPrice.toLocaleString()}</strong>
                  </p>
                  <div className="mt-2 space-x-2 text-sm">
                    <span className={`px-2 py-1 rounded text-white ${order.isPaid ? 'bg-green-600' : 'bg-red-500'}`}>
                      {order.isPaid ? 'Paid' : 'Not Paid'}
                    </span>
                    <span className={`px-2 py-1 rounded text-white ${order.isDelivered ? 'bg-green-500' : 'bg-gray-600'}`}>
                      {order.isDelivered ? 'Delivered' : 'Pending'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-2 md:mt-0">
                  {!order.isPaid && (
                    <button onClick={() => markPaid(order._id)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1">
                      <FaMoneyBillAlt /> Mark Paid
                    </button>
                  )}
                  {!order.isDelivered && (
                    <button onClick={() => markDelivered(order._id)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center gap-1">
                      <FaTruck /> Mark Delivered
                    </button>
                  )}
                  {['admin', 'superadmin'].includes(userInfo.role) && (
                    <button onClick={() => deleteOrder(order._id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1">
                      <FaTrash /> Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ⏩ Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(prev => prev - 1)}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          >
            <FaChevronLeft />
          </button>
          <span className="text-sm text-gray-700">Page {page} of {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(prev => prev + 1)}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
