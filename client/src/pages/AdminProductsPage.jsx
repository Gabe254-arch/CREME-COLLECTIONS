import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  FaTrash, FaEdit, FaFileCsv, FaPlus, FaBoxOpen, FaTag, FaStar, FaSearch
} from 'react-icons/fa';

const AdminProductsPage = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const itemsPerPage = 8;

  // ✅ Fetch product list
  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/products', {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });

      const safeProducts = Array.isArray(data.products) ? data.products : (Array.isArray(data) ? data : []);
      setProducts(safeProducts);
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to load products');
    }
  }, [userInfo.token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ❌ Delete Single
  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      toast.success('🗑️ Product deleted');
      fetchProducts();
    } catch {
      toast.error('❌ Failed to delete');
    }
  };

  // 🔁 Bulk Delete
  const bulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedProducts.length} selected products?`)) return;
    try {
      await Promise.all(selectedProducts.map(id =>
        axios.delete(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        })
      ));
      toast.success('✅ Bulk delete complete');
      setSelectedProducts([]);
      fetchProducts();
    } catch (err) {
      toast.error('❌ Bulk delete failed');
    }
  };

  // 📥 Export CSV
  const exportCSV = () => {
    const headers = 'Name,Price,Stock,Brand,Category\n';
    const rows = products.map(p =>
      [p.name, p.price, p.countInStock, p.brand, p.category?.name].join(',')
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'products.csv';
    link.click();
  };

  // 🔎 Search + Sort + Pagination
  const filtered = products
    .filter(p => [p.name, p.brand, p.category?.name].join(' ').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'price') return (a.price - b.price) * order;
      if (sortBy === 'name') return a.name.localeCompare(b.name) * order;
      return (new Date(a.createdAt) - new Date(b.createdAt)) * order;
    });

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="p-6">
      {/* 🧭 Header */}
      <h2 className="text-2xl font-bold text-orange-600 mb-5 flex items-center gap-2">
        <FaBoxOpen /> Product Management
      </h2>

      {/* 🛠️ Toolbar */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            className="border px-4 pl-10 py-2 rounded w-full"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border px-2 py-2 rounded">
          <option value="createdAt">Newest</option>
          <option value="price">Price</option>
          <option value="name">Name</option>
        </select>
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="border px-2 py-2 rounded">
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>

        <button onClick={exportCSV} className="bg-gray-800 text-white px-4 py-2 rounded flex items-center gap-2">
          <FaFileCsv /> Export CSV
        </button>

        <button
          onClick={bulkDelete}
          disabled={selectedProducts.length === 0}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Bulk Delete
        </button>

        <button
          onClick={() => navigate('/admin/product/new')}
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaPlus /> Add Product
        </button>
      </div>

      {/* 🧾 Product Grid */}
      {paginated.length === 0 ? (
        <p className="text-center text-gray-500">🚫 No products found.</p>
      ) : paginated.map((p) => (
        <div key={p._id} className="flex items-start border rounded p-4 mb-4 shadow-sm bg-white gap-4">
          <input
            type="checkbox"
            checked={selectedProducts.includes(p._id)}
            onChange={() =>
              setSelectedProducts(prev =>
                prev.includes(p._id)
                  ? prev.filter(id => id !== p._id)
                  : [...prev, p._id]
              )
            }
          />

          <img
            src={p.images?.[0] ? `http://localhost:5000${p.images[0]}` : '/default-product.png'}
            alt={p.name}
            className="w-24 h-24 object-cover rounded shadow"
            onClick={() => setImagePreview(p.images)}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/default-product.png';
            }}
          />

          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-800">{p.name}</h3>
            <p className="text-sm text-gray-600">
              <strong>Brand:</strong> {p.brand} | <strong>Category:</strong> {p.category?.name}
              <br />
              <strong>Stock:</strong>{' '}
              <span className={`px-2 py-1 rounded text-xs font-semibold ${p.countInStock < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-800'}`}>
                {p.countInStock < 5 ? `Low (${p.countInStock})` : `${p.countInStock}`}
              </span>
              <br />
              {p.isFeatured && (
                <span className="inline-flex items-center text-yellow-600 text-sm mt-1 gap-1">
                  <FaStar /> Featured
                </span>
              )}
              {p.isDealOfWeek && (
                <span className="inline-flex items-center text-pink-600 text-sm ml-4 gap-1">
                  <FaTag /> Deal of the Week
                </span>
              )}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/admin/product/${p._id}/edit`)}
              className="bg-yellow-500 text-white px-3 py-2 rounded flex items-center gap-1"
            >
              <FaEdit /> Edit
            </button>
            <button
              onClick={() => deleteProduct(p._id)}
              className="bg-red-600 text-white px-3 py-2 rounded flex items-center gap-1"
            >
              <FaTrash /> Delete
            </button>
          </div>
        </div>
      ))}

      {/* 🔄 Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 border rounded ${i + 1 === currentPage ? 'bg-orange-600 text-white' : 'bg-white text-gray-700'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* 🖼️ Image Preview Modal */}
      {Array.isArray(imagePreview) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50"
          onClick={() => setImagePreview(null)}
        >
          <div className="max-w-4xl max-h-[80vh] overflow-auto grid grid-cols-2 gap-4 p-4">
            {imagePreview.map((img, i) => (
              <img
                key={i}
                src={`http://localhost:5000${img}`}
                alt={`Preview ${i}`}
                className="w-full max-h-80 object-contain rounded"
              />
            ))}
          </div>
          <button className="mt-6 px-4 py-2 bg-white text-gray-800 rounded" onClick={() => setImagePreview(null)}>
            Close Preview
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
