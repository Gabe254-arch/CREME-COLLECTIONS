import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        const fetched = Array.isArray(data) ? data : data.products || [];
        setProducts(fetched);
      } catch (error) {
        console.error('❌ Failed to load products:', error.message);
        setError('⚠️ Unable to load products at the moment. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const exists = cart.find((item) => item._id === product._id);
    const updatedCart = exists
      ? cart.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        )
      : [...cart, { ...product, qty: 1 }];
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    alert('🛒 Added to Cart!');
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-10">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
        🛍️ Featured Products
      </h2>

      {loading && <p className="text-gray-500">⏳ Loading products...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.map((product) => {
            const image = product.images?.[0]
              ? `http://localhost:5000${product.images[0]}`
              : '/default-product.png';

            return (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col hover:scale-[1.02] duration-200"
              >
                <img
                  src={image}
                  alt={product.name}
                  className="w-full h-48 object-cover bg-gray-100 rounded-t-md"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/default-product.png';
                  }}
                />
                <div className="p-3 flex flex-col flex-grow">
                  <h3 className="text-sm font-semibold text-gray-800 truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 h-[36px] overflow-hidden line-clamp-2 mt-1">
                    {product.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through mr-2">
                          Ksh {Number(product.originalPrice).toLocaleString()}
                        </span>
                      )}
                      <span className="text-orange-600 font-bold">
                        Ksh {Number(product.price).toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 rounded"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HomePage;
