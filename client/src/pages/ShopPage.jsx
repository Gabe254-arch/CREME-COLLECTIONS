// ✅ Creme Collections | ShopPage.jsx — Fully Upgraded with Enhanced Filters & Wishlist UX
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Meta from '../components/Meta';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';
import QuickViewModal from '../components/QuickViewModal';
import FloatingAssistant from '../components/FloatingAssistant';
import { getProductImage } from '../utils/getProductImage';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { FiFilter } from 'react-icons/fi';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('wishlistItems')) || []);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [quickView, setQuickView] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { categorySlug, subSlug } = useParams();
  const params = new URLSearchParams(location.search);
  const category = params.get('category') || categorySlug || '';
  const subcategory = params.get('subcategory') || subSlug || '';
  const itemsPerPage = 8;

  useEffect(() => {
    axios.get('/api/categories')
      .then(res => setCategories(res.data || []))
      .catch(err => console.error('❌ Categories fetch error:', err.message));
  }, []);

  useEffect(() => {
    if (!category) return setSubcategories([]);
    axios.get(`/api/subcategories?category=${category}`)
      .then(res => setSubcategories(res.data || []))
      .catch(() => setSubcategories([]));
  }, [category]);

  useEffect(() => {
    axios.get('/api/products')
      .then(res => setProducts(Array.isArray(res.data) ? res.data : res.data.products || []))
      .catch(err => console.error('❌ Products fetch error:', err.message));
  }, []);

  useEffect(() => {
    let result = products.filter(p => {
      const matchSearch = !searchQuery || p.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = !category || [p.category?.slug, p.category?.name].includes(category);
      const matchSub = !subcategory || [p.subcategory?.slug, p.subcategory?.name].includes(subcategory);
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchSearch && matchCat && matchSub && matchPrice;
    });

    if (sortBy === 'priceLow') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'priceHigh') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'nameAZ') result.sort((a, b) => a.name.localeCompare(b.name));
    else result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFiltered(result);
    setBrands([...new Set(result.map(p => p.brand).filter(Boolean))]);
    setCurrentPage(1);
  }, [products, searchQuery, category, subcategory, priceRange, sortBy]);

  const handleWishlistToggle = (e, product) => {
    e.stopPropagation();
    const exists = wishlist.find(item => item._id === product._id);
    const updated = exists ? wishlist.filter(p => p._id !== product._id) : [...wishlist, product];
    setWishlist(updated);
    localStorage.setItem('wishlistItems', JSON.stringify(updated));
  };

  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);


const handleAddToCart = (product) => {
  const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
  const exists = cart.find((item) => item._id === product._id);

  const updatedCart = exists
    ? cart.map((item) =>
        item._id === product._id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    : [...cart, { ...product, quantity: 1 }];

  localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  alert(`${product.name} added to cart 🛒`);
};



  return (
    <>
      <Navbar />
      <Meta title="Creme Collections | Kenya's Premier Online Shop" description="Explore top deals on electronics, fashion and more!" />
      <Breadcrumbs category={category} subcategory={subcategory} />

      <div className="max-w-[1400px] mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* 🔍 Filter Sidebar */}
        <aside className={`w-full md:w-64 bg-white shadow p-4 rounded space-y-6 ${showFilters || window.innerWidth >= 768 ? '' : 'hidden'}`}>
          {/* ✅ Category Filters */}
          <div>
            <h4 className="font-semibold text-orange-600 mb-2">Category</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat._id}
                  onClick={() => navigate(`/shop/${cat.slug}`)}
                  className={`px-3 py-1 rounded-md border text-sm ${category === cat.slug ? 'bg-orange-500 text-white' : 'bg-gray-100 text-blue-700 hover:bg-orange-100'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            {/* 🔽 Subcategories */}
            {category && subcategories.length > 0 && (
              <div className="mt-4">
                <h5 className="text-sm font-medium mb-1">Subcategories</h5>
                <div className="flex flex-wrap gap-2">
                  {subcategories.map(sub => (
                    <button
                      key={sub._id}
                      onClick={() => navigate(`/shop/${category}/${sub.slug}`)}
                      className={`px-2 py-1 text-xs border rounded ${sub.slug === subcategory ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-orange-100'}`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ✅ Brand Filter */}
          <div>
            <h4 className="font-semibold text-orange-600 mb-2">Brands</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              {brands.map((b, i) => (
                <li key={i} className="capitalize">🧾 {b}</li>
              ))}
            </ul>
          </div>

          {/* ✅ Price Filter */}
          <div>
            <h4 className="font-semibold text-orange-600 mb-2">Price Range</h4>
            <input type="number" placeholder="Min" value={priceRange[0]} onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])} className="w-full mb-2 border px-2 py-1 rounded" />
            <input type="number" placeholder="Max" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], +e.target.value])} className="w-full border px-2 py-1 rounded" />
          </div>
        </aside>

        {/* 🛍️ Main Product Grid */}
        <main className="flex-1">
          {/* Top Filters */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <div className="flex items-center gap-2 w-full">
              <button onClick={() => setShowFilters(!showFilters)} className="md:hidden inline-flex items-center gap-1 border px-3 py-2 text-sm rounded text-orange-600">
                <FiFilter /> Filters
              </button>
              <input type="text" placeholder="Search products..." className="border px-4 py-2 rounded w-full" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border px-3 py-2 rounded text-sm">
              <option value="newest">Newest</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="nameAZ">Name: A → Z</option>
            </select>
          </div>

          {/* Grid or No Result */}
          {paginated.length === 0 ? (
            <p className="text-gray-500">No products match your filters.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginated.map(product => (
                <div key={product._id} className="bg-white p-4 rounded shadow hover:shadow-lg transition relative cursor-pointer group" onClick={() => setQuickView(product)}>
                  <img src={getProductImage(product.images)} alt={product.name} className="w-full h-48 object-cover rounded" />
                  <h4 className="mt-2 font-semibold text-gray-800 truncate">{product.name}</h4>
                  <p className="text-sm mt-1">
                    <span className="text-orange-600 font-bold">Ksh {product.price.toLocaleString()}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="ml-2 line-through text-gray-400 text-xs">Ksh {product.originalPrice.toLocaleString()}</span>
                    )}
                  </p>
                  <button onClick={(e) => handleWishlistToggle(e, product)} title="Add to Wishlist" className="absolute top-2 right-2 text-orange-500 hover:text-red-600 z-10">
                    {wishlist.find(item => item._id === product._id) ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-orange-500 text-white' : 'text-gray-700'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>

      {quickView && (
  <QuickViewModal
    product={quickView}
    onClose={() => setQuickView(null)}
    wishlist={wishlist}
    toggleWishlist={(p) => handleWishlistToggle(new Event('click'), p)}
  />
)}

      <FloatingAssistant />
      <Footer />
    </>
  );
};

export default ShopPage;
