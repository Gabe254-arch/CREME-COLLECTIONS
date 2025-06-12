import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const ShopManagerProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get('http://localhost:5000/api/products/mine', config);
        setProducts(data || []);
      } catch (err) {
        console.error('❌ Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [userInfo.token]);

  const handleUpdate = async (id, field, value) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      await axios.put(`http://localhost:5000/api/products/${id}`, { [field]: value }, config);
      const updated = products.map(p => p._id === id ? { ...p, [field]: value } : p);
      setProducts(updated);
    } catch (err) {
      alert('Update failed');
    }
  };

  const handleImageUpload = async (id, file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'multipart/form-data',
        },
      };
      const { data } = await axios.post(
        `http://localhost:5000/api/products/${id}/upload`,
        formData,
        config
      );
      const updated = products.map(p =>
        p._id === id ? { ...p, images: [data.path] } : p
      );
      setProducts(updated);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Image upload failed');
    }
  };

  const exportCSV = () => {
    const headers = 'Name,Brand,Price,Stock\n';
    const rows = products
      .map(p => [p.name, p.brand, p.price, p.countInStock].join(','))
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'assigned-products.csv';
    link.click();
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">📦 Assigned Products</h2>
          <button
            onClick={exportCSV}
            className="text-sm bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            📁 Export CSV
          </button>
        </div>

        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full mb-6 p-2 border border-gray-300 rounded"
        />

        {loading ? (
          <p>Loading products...</p>
        ) : filtered.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map(product => (
              <div key={product._id} className="bg-white p-4 rounded shadow space-y-3">
                <div className="flex justify-between">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <span
                    className={`text-sm px-2 py-1 rounded ${
                      product.countInStock < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {product.countInStock < 5 ? 'Low Stock' : 'In Stock'}
                  </span>
                </div>

                <img
                  src={product.images?.[0] ? `http://localhost:5000${product.images[0]}` : '${import.meta.env.BASE_URL}default-product.png'}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded"
                />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm">Price (Ksh)</label>
                    <input
                      type="number"
                      value={product.price}
                      onChange={e => handleUpdate(product._id, 'price', e.target.value)}
                      className="border px-2 py-1 rounded w-24"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <label className="text-sm">Stock Qty</label>
                    <input
                      type="number"
                      value={product.countInStock}
                      onChange={e => handleUpdate(product._id, 'countInStock', e.target.value)}
                      className="border px-2 py-1 rounded w-24"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <label className="text-sm">Brand</label>
                    <input
                      type="text"
                      value={product.brand}
                      onChange={e => handleUpdate(product._id, 'brand', e.target.value)}
                      className="border px-2 py-1 rounded w-32"
                    />
                  </div>

                  <div className="mt-2">
                    <label className="text-sm block">Upload New Image:</label>
                    <input
                      type="file"
                      onChange={e => handleImageUpload(product._id, e.target.files[0])}
                      className="text-sm"
                    />
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

export default ShopManagerProducts;
