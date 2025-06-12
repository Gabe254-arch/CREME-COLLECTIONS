import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import {
  FaCheckCircle, FaBoxOpen, FaUser, FaPhone,
  FaEnvelope, FaTruck, FaCreditCard, FaShoppingCart
} from 'react-icons/fa';

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      try {
        const { data } = await axios.get(`http://localhost:5000/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setOrder(data);
      } catch (err) {
        console.error('❌ Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <p className="text-center mt-10 animate-pulse text-gray-600">Loading order...</p>;
  if (!order) return <p className="text-center text-red-600 mt-10">❌ Order not found.</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 bg-white mt-6 rounded-lg shadow space-y-6 animate-fadeIn">
        {/* ✅ Header */}
        <div>
          <h2 className="text-2xl font-bold text-green-600 mb-2 flex items-center gap-2">
            <FaCheckCircle /> Thank you for your order!
          </h2>
          <p className="text-gray-600">Your order has been placed successfully. Below are your order details.</p>
        </div>

        {/* 🧾 Order Info */}
        <div>
          <h3 className="font-bold text-lg text-gray-700 mb-3 flex items-center gap-2">
            <FaBoxOpen /> Order #{order._id}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
            <p className="flex items-center gap-2"><FaUser className="text-orange-500" /><strong>Name:</strong> {order.customerName}</p>
            <p className="flex items-center gap-2"><FaPhone className="text-orange-500" /><strong>Phone:</strong> {order.phone}</p>
            <p className="flex items-center gap-2"><FaEnvelope className="text-orange-500" /><strong>Email:</strong> {order.email}</p>
            <p className="flex items-center gap-2"><FaTruck className="text-orange-500" /><strong>Shipping:</strong> {order.shippingAddress}</p>
            <p className="flex items-center gap-2"><FaCreditCard className="text-orange-500" /><strong>Payment:</strong> {order.paymentMethod}</p>
          </div>
        </div>

        {/* 🛍 Order Items */}
        <div>
          <h3 className="font-bold text-lg text-gray-700 mb-2 flex items-center gap-2">
            <FaShoppingCart /> Order Items
          </h3>
          <ul className="divide-y border-t text-sm text-gray-800">
            {order.orderItems.map((item, i) => (
              <li key={i} className="flex justify-between py-2">
                <span>{item.qty} × {item.name}</span>
                <span>Ksh {(item.qty * item.price).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 💰 Totals */}
        <div className="border-t pt-4 text-sm text-gray-800 space-y-1">
          <p className="flex justify-between">
            <span>Subtotal:</span>
            <span>Ksh {order.itemsPrice?.toLocaleString() || '0'}</span>
          </p>
          <p className="flex justify-between">
            <span>Delivery:</span>
            <span>Ksh {order.deliveryFee?.toLocaleString() || '0'}</span>
          </p>
          <p className="flex justify-between font-bold text-lg text-green-700">
            <span>Total:</span>
            <span>Ksh {order.totalPrice?.toLocaleString() || '0'}</span>
          </p>
        </div>

        {/* 🔁 Continue Shopping */}
        <div className="text-center mt-6">
          <Link
            to="/shop"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded shadow transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmationPage;
