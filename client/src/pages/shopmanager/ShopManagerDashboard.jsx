import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/Navbar";


const ShopManagerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo?.role || userInfo.role !== 'shopmanager') {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const [prodRes, orderRes] = await Promise.all([
          axios.get('http://localhost:5000/api/products/mine', config),
          axios.get('http://localhost:5000/api/orders/mine', config),
        ]);
        setProducts(prodRes.data || []);
        setOrders(orderRes.data || []);
      } catch (err) {
        console.error('❌ Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userInfo, navigate]);

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-6">🧑‍💼 Shop Manager Dashboard</h2>

        {loading ? (
          <p className="text-gray-600">Loading your assigned data...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* 🛒 Products */}
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-xl font-semibold mb-4">📦 My Products</h3>
              <p className="text-sm text-gray-600 mb-2">
                You are managing <strong>{products.length}</strong> products.
              </p>
              <ul className="text-sm space-y-1">
                {products.slice(0, 5).map((p) => (
                  <li key={p._id} className="flex justify-between border-b py-1">
                    <span>{p.name}</span>
                    <span className="text-green-700">Ksh {p.price}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/shopmanager/products')}
                className="mt-4 text-blue-600 hover:underline text-sm"
              >
                View All Products →
              </button>
            </div>

            {/* 📋 Orders */}
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-xl font-semibold mb-4">📋 Assigned Orders</h3>
              <p className="text-sm text-gray-600 mb-2">
                You have <strong>{orders.length}</strong> recent orders.
              </p>
              <ul className="text-sm space-y-1">
                {orders.slice(0, 5).map((o) => (
                  <li key={o._id} className="flex justify-between border-b py-1">
                    <span>{o.customerName}</span>
                    <span>Ksh {o.totalPrice.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/shopmanager/orders')}
                className="mt-4 text-blue-600 hover:underline text-sm"
              >
                View All Orders →
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ShopManagerDashboard;
