import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';

const ShopManagerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get('http://localhost:5000/api/orders/mine', config);
        setOrders(data || []);
      } catch (err) {
        console.error('❌ Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo.token]);

  const filteredOrders = orders.filter(o =>
    o.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusUpdate = async (id, field) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const updatedField = field === 'isPaid' ? { isPaid: true } : { isDelivered: true };

      await axios.put(`http://localhost:5000/api/orders/${id}/status`, updatedField, config);
      setOrders(prev =>
        prev.map(order =>
          order._id === id ? { ...order, ...updatedField } : order
        )
      );
    } catch (err) {
      alert('Status update failed');
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">📋 Assigned Orders</h2>

        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by customer name"
          className="w-full mb-6 p-2 border border-gray-300 rounded"
        />

        {loading ? (
          <p>Loading orders...</p>
        ) : filteredOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map(order => (
              <div key={order._id} className="bg-white p-4 rounded shadow space-y-2 border">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      #{order._id.slice(-6).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {order.customerName} – {order.phone}
                    </p>
                    <p className="text-sm text-gray-500">{order.shippingAddress}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-green-700 font-semibold">
                      Ksh {order.totalPrice.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-3 space-y-1 text-sm">
                  {order.orderItems.map(item => (
                    <div
                      key={item.product}
                      className="flex justify-between text-gray-700"
                    >
                      <span>{item.qty} × {item.name}</span>
                      <span>Ksh {(item.qty * item.price).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 flex justify-between items-center text-sm text-gray-700">
                  <div className="space-y-1">
                    <p>
                      Payment:{' '}
                      <span className={order.isPaid ? 'text-green-600 font-semibold' : 'text-red-600 font-medium'}>
                        {order.isPaid ? '✅ Paid' : '❌ Unpaid'}
                      </span>
                    </p>
                    <p>
                      Delivery:{' '}
                      <span className={order.isDelivered ? 'text-green-600 font-semibold' : 'text-red-600 font-medium'}>
                        {order.isDelivered ? '✅ Delivered' : '❌ Pending'}
                      </span>
                    </p>
                  </div>

                  <div className="text-right space-y-1">
                    {!order.isPaid && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'isPaid')}
                        className="text-sm bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                      >
                        Approve Payment
                      </button>
                    )}
                    {!order.isDelivered && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'isDelivered')}
                        className="text-sm bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 ml-2"
                      >
                        Confirm Delivery
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ShopManagerOrders;
