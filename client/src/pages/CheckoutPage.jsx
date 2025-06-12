import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  FaShoppingCart,
  FaUser,
  FaTruck,
  FaPhone,
  FaEnvelope,
  FaCreditCard,
  FaCheckCircle,
} from 'react-icons/fa';

const CheckoutPage = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const [shipping, setShipping] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Pay on Delivery');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const itemsPrice = cartItems.reduce((sum, item) => sum + item.price * (item.qty || item.quantity || 1), 0);
  const deliveryFee = shipping.toLowerCase().includes('nairobi') ? 500 : 1000;
  const totalPrice = itemsPrice + deliveryFee;

  useEffect(() => {
    if (cartItems.length === 0) navigate('/cart');
  }, [cartItems, navigate]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

    if (!userInfo?.token) {
      alert('❌ You must be logged in to place an order.');
      return;
    }

    const order = {
      customerName,
      phone,
      email,
      shippingAddress: shipping,
      paymentMethod,
      orderItems: cartItems.map(item => ({
        product: item._id,
        name: item.name,
        qty: item.qty || item.quantity || 1,
        price: item.price,
      })),
      itemsPrice,
      deliveryFee,
      totalPrice,
    };

    try {
      setProcessing(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post('http://localhost:5000/api/orders', order, config);
      alert('✅ Order placed successfully!');
      localStorage.removeItem('cartItems');
      navigate(`/orders/${data._id}`);
    } catch (err) {
      console.error('❌ Checkout failed:', err.response?.data || err.message);
      alert('❌ Failed to place order.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
        {/* 📋 Checkout Form */}
        <form onSubmit={handleCheckout} className="bg-white shadow-md p-6 rounded-lg space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaShoppingCart /> Checkout Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <div className="flex items-center gap-2">
                <FaUser />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="flex-1 p-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <div className="flex items-center gap-2">
                <FaPhone />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  pattern="^(07\d{8})$"
                  title="Phone number must start with 07 and have 10 digits"
                  className="flex-1 p-2 border border-gray-300 rounded"
                  placeholder="e.g. 0712345678"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <div className="flex items-center gap-2">
                <FaEnvelope />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 p-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Shipping Address</label>
              <div className="flex items-start gap-2">
                <FaTruck className="mt-2" />
                <textarea
                  value={shipping}
                  onChange={(e) => setShipping(e.target.value)}
                  required
                  placeholder="e.g. Westlands, Nairobi – Apartment 4B"
                  className="flex-1 p-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Payment Method</label>
              <div className="flex items-center gap-2">
                <FaCreditCard />
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded"
                >
                  <option value="Pay on Delivery">Pay on Delivery</option>
                  <option value="M-Pesa">M-Pesa</option>
                  <option value="Card">Card</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={processing}
            className={`bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded shadow ${
              processing ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {processing ? 'Processing...' : (
              <>
                <FaCheckCircle className="inline mr-2" />
                Place Order Now
              </>
            )}
          </button>
        </form>

        {/* 📦 Order Summary */}
        <div className="bg-gray-100 p-6 rounded-lg shadow space-y-4">
          <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
            <FaShoppingCart /> Order Summary
          </h3>

          <ul className="divide-y text-sm text-gray-700">
            {cartItems.map(item => (
              <li key={item._id} className="py-2 flex justify-between">
                <span>{(item.qty || item.quantity || 1)} × {item.name}</span>
                <span>Ksh {(item.price * (item.qty || item.quantity || 1)).toLocaleString()}</span>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t text-gray-800 space-y-1 text-sm">
            <p className="flex justify-between">
              <span>Subtotal:</span>
              <span>Ksh {itemsPrice.toLocaleString()}</span>
            </p>
            <p className="flex justify-between">
              <span>Delivery:</span>
              <span>Ksh {deliveryFee.toLocaleString()}</span>
            </p>
            <p className="flex justify-between font-bold text-lg text-green-700">
              <span>Total:</span>
              <span>Ksh {totalPrice.toLocaleString()}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
