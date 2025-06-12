import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import {
  FaClipboardList,
  FaCheckCircle,
  FaTruck,
  FaMoneyBill,
  FaShoppingCart,
  FaArrowLeft,
  FaFilePdf,
  FaUser,
  FaPhone,
  FaEnvelope,
} from 'react-icons/fa';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      if (!userInfo?.token) {
        setError('Access denied. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`/api/orders/${id}`, config);
        setOrder(data);
      } catch (err) {
        console.error('❌ Failed to fetch order:', err);
        setError('Failed to load order. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const getStatusClass = (condition) => condition ? 'text-green-600 font-semibold' : 'text-gray-400';

  if (loading)
    return <div className="text-center text-gray-500 py-20 animate-pulse">Loading order details...</div>;

  if (error)
    return <div className="text-center text-red-500 py-20">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-fadeIn">
      <h2 className="text-2xl md:text-3xl font-bold text-orange-600 mb-6 flex items-center gap-2">
        <FaShoppingCart /> Order Summary
      </h2>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded shadow mb-6">
        <div className="flex flex-col gap-2">
          <h4 className="font-semibold text-gray-800">Order Status</h4>
          <div className="flex gap-6 text-sm mt-2">
            <div className={`flex items-center gap-2 ${getStatusClass(true)}`}>
              <FaCheckCircle /> Ordered
            </div>
            <div className={`flex items-center gap-2 ${getStatusClass(order.isPaid)}`}>
              <FaMoneyBill /> {order.isPaid ? 'Paid' : 'Pending'}
            </div>
            <div className={`flex items-center gap-2 ${getStatusClass(order.isDelivered)}`}>
              <FaTruck /> {order.isDelivered ? 'Delivered' : 'In Progress'}
            </div>
          </div>
        </div>

        <div className="text-sm space-y-1 text-gray-700">
          <p>Placed on: <span className="font-medium">{new Date(order.createdAt).toLocaleString()}</span></p>
          <p>Payment Method: <span className="font-semibold text-gray-800">{order.paymentMethod}</span></p>
          {order?.user && (
            <p className="text-xs text-gray-500">User: {order.user.name} ({order.user.email})</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded shadow">
          <h4 className="font-semibold text-gray-800 mb-2">Shipping Address</h4>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {typeof order.shippingAddress === 'object'
              ? [
                  order.shippingAddress.fullName,
                  order.shippingAddress.address,
                  order.shippingAddress.city,
                  order.shippingAddress.county,
                  `Phone: ${order.shippingAddress.phone}`,
                ].filter(Boolean).join(', ')
              : order.shippingAddress}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h4 className="font-semibold text-gray-800 mb-2">Order Items</h4>
          <ul className="divide-y">
            {order.orderItems.map((item) => (
              <li key={item.product} className="py-2 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    Ksh {item.price.toLocaleString()} × {item.qty}
                  </p>
                </div>
                <p className="text-sm font-bold text-orange-600">
                  Ksh {(item.price * item.qty).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded shadow p-6 flex justify-between items-center mb-10">
        <span className="text-xl font-semibold text-gray-800">Total:</span>
        <span className="text-2xl font-bold text-orange-600">
          Ksh {order.totalPrice.toLocaleString()}
        </span>
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => navigate('/shop')}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaArrowLeft /> Continue Shopping
        </button>

        <button
          onClick={() => navigate('/account/orders')}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded flex items-center gap-2"
        >
          <FaClipboardList /> My Orders
        </button>

        <a
          href={`http://localhost:5000/api/orders/${order._id}/invoice`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaFilePdf /> Download Invoice
        </a>
      </div>
    </div>
  );
};

export default OrderDetailPage;