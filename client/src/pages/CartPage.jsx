import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const cleaned = items.filter(item => item._id && item.price);
    const enriched = cleaned.map(item => ({
      ...item,
      qty: item.qty || item.quantity || 1
    }));
    localStorage.setItem('cartItems', JSON.stringify(enriched));
    setCartItems(enriched);
  }, []);

  const updateQty = (id, type) => {
    const updated = cartItems.map(item => {
      if (item._id === id) {
        const currentQty = item.qty || 1;
        const newQty = type === 'add' ? currentQty + 1 : Math.max(currentQty - 1, 1);
        return { ...item, qty: newQty };
      }
      return item;
    });
    localStorage.setItem('cartItems', JSON.stringify(updated));
    setCartItems(updated);
  };

  const handleRemove = (id) => {
    const updated = cartItems.filter(item => item._id !== id);
    localStorage.setItem('cartItems', JSON.stringify(updated));
    setCartItems(updated);
  };

  const total = cartItems.reduce((acc, item) => acc + (item.price * (item.qty || 1)), 0);

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">🛒 Your Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <div className="text-gray-600 text-center">
            <p className="mb-4">Your cart is currently empty.</p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
            >
              🛍️ Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {cartItems.map(item => (
              <div
                key={item._id}
                className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-4 rounded shadow border"
              >
                <div className="flex items-center gap-4 w-full md:w-2/3">
                  {/* 🖼️ Image */}
                  <img
                    src={
                      item.images?.[0]
                        ? item.images[0].startsWith('/uploads/')
                          ? `http://localhost:5000${item.images[0]}`
                          : item.images[0]
                        : `/default-product.png`
                    }
                    alt={item.name}
                    className="w-[70px] h-[70px] object-cover rounded shadow"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/default-product.png';
                    }}
                  />

                  {/* 📝 Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Ksh {item.price.toLocaleString()} each
                    </p>

                    {/* ➕➖ Quantity */}
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        onClick={() => updateQty(item._id, 'subtract')}
                        className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        −
                      </button>
                      <span className="font-medium">{item.qty || 1}</span>
                      <button
                        onClick={() => updateQty(item._id, 'add')}
                        className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* 💰 Item total + Remove */}
                <div className="text-right w-full md:w-1/3">
                  <p className="text-lg font-semibold text-green-600">
                    Ksh {(item.price * (item.qty || 1)).toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="text-red-600 text-sm mt-2 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* ✅ Cart Total */}
            <div className="text-right mt-10 border-t pt-6">
              <p className="text-xl font-bold text-gray-800">
                🧮 Total: Ksh {total.toLocaleString()}
              </p>
              <button
                onClick={() => navigate('/checkout')}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded shadow"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
