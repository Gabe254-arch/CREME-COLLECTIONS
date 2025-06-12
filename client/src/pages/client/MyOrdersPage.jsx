import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaFileInvoice,
  FaClipboardList,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
} from 'react-icons/fa';
import axios from '../../api/axiosInstance';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userInfo?.token) return navigate('/login');
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get('/api/orders/myorders', config);
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sorted);
      } catch (err) {
        console.error('❌ Failed to fetch orders:', err.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate, userInfo?.token]);

  const downloadInvoice = async (orderId) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
        responseType: 'blob',
      };
      const { data } = await axios.get(`/api/orders/${orderId}/invoice`, config);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `order-${orderId}-invoice.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('❌ Invoice download error:', err.message);
      alert('Failed to generate invoice. Try again later.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 animate-fadeIn">
      <h2 className="text-3xl font-bold text-orange-600 flex items-center gap-2 mb-8">
        <FaClipboardList /> My Orders
      </h2>

      {loading ? (
        <p className="text-center text-gray-500 py-20 animate-pulse">🔄 Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <p className="text-xl font-medium">🚫 You haven’t placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-all duration-200"
            >
              {/* 🔢 Header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                <div className="text-sm text-gray-600">
                  Order ID:{' '}
                  <span className="text-blue-600 font-medium">{order._id}</span>
                </div>

                <div className="flex gap-4 mt-2 md:mt-0">
                  <button
                    onClick={() => downloadInvoice(order._id)}
                    className="text-sm text-orange-500 hover:underline flex items-center gap-1"
                  >
                    <FaFileInvoice /> Invoice
                  </button>
                  <button
                    onClick={() => navigate(`/account/orders/${order._id}`)}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <FaEye /> View Details
                  </button>
                </div>
              </div>

              {/* 🛍 Order Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {order.orderItems.map((item) => (
                  <div
                    key={item.product}
                    className="flex items-center gap-4 border p-2 rounded-md"
                  >
                    <img
                      src={
                        item.image?.startsWith('/uploads/')
                          ? `http://localhost:5000${item.image}`
                          : item.image || '/default-product.png'
                      }
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded shadow"
                      onError={(e) => (e.currentTarget.src = '/default-product.png')}
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Ksh {item.price.toLocaleString()} × {item.qty || item.quantity || 1}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 🔍 Status & Summary */}
              <div className="flex flex-wrap gap-6 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  {order.isPaid ? (
                    <FaCheckCircle className="text-green-600" />
                  ) : (
                    <FaTimesCircle className="text-red-500" />
                  )}
                  Payment: <strong>{order.isPaid ? 'Paid' : 'Pending'}</strong>
                </div>

                <div className="flex items-center gap-2">
                  {order.isDelivered ? (
                    <FaCheckCircle className="text-green-600" />
                  ) : (
                    <FaTruck className="text-yellow-600" />
                  )}
                  Delivery: <strong>{order.isDelivered ? 'Delivered' : 'In Progress'}</strong>
                </div>

                <div className="text-gray-500">
                  Placed on:{' '}
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="ml-auto font-bold text-orange-600">
                  Total: Ksh {order.totalPrice?.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
