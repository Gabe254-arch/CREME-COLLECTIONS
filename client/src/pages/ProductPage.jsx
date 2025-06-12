import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SeoHelmet from '../components/SeoHelmet';
import ProductCard from '../components/ProductCard';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('description');
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);

        // Set the main image
        const defaultImage = data.images?.[0]
          ? `http://localhost:5000${data.images[0]}`
          : '/default-product.png';
        setActiveImage(defaultImage);

        // Fetch related products by category
        if (data.category?._id) {
          const res = await axios.get(`http://localhost:5000/api/products/category/${data.category._id}`);
          const related = res.data.filter((p) => p._id !== data._id);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('❌ Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const exists = cart.find((item) => item._id === product._id);

    const updatedCart = exists
      ? cart.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + qty } : item
        )
      : [...cart, { ...product, qty }];

    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    navigate('/cart');
  };

  if (loading) return <p className="text-center py-10">Loading product...</p>;

  const metaTitle = `${product.name} | Buy Online in Kenya - Creme Collections`;
  const metaDescription =
    product.description?.slice(0, 160) ||
    'Get the best product deals in Kenya only at Creme Collections.';
  const metaImage = activeImage;
  const metaUrl = `https://www.cremecollections.shop/product/${id}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      {/* SEO */}
      <SeoHelmet
        title={metaTitle}
        description={metaDescription}
        url={metaUrl}
        image={metaImage}
        type="product"
      />

      {/* Product Section */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* 🖼 Image Preview */}
        <div className="bg-white rounded shadow p-6">
          <div className="flex items-center justify-center mb-4">
            <Zoom>
              <img
                src={activeImage}
                alt={product.name}
                className="w-full max-h-[420px] object-contain rounded border"
                onError={(e) => (e.currentTarget.src = '/default-product.png')}
              />
            </Zoom>
          </div>

          {/* 🔁 Thumbnails */}
          <div className="flex gap-2 overflow-x-auto">
            {product.images?.map((img, idx) => {
              const fullImg = `http://localhost:5000${img}`;
              return (
                <img
                  key={idx}
                  src={fullImg}
                  alt={`thumb-${idx}`}
                  onClick={() => setActiveImage(fullImg)}
                  className={`w-20 h-20 object-contain rounded border cursor-pointer transition ${
                    fullImg === activeImage
                      ? 'border-orange-500 ring-2 ring-orange-300'
                      : 'hover:border-gray-400'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-5">
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>

          {/* 💰 Price */}
          <div className="text-xl">
            {product.originalPrice > product.price && (
              <span className="line-through text-gray-400 mr-2">
                Ksh {product.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-red-600 font-bold">
              Ksh {product.price.toLocaleString()}
            </span>
          </div>

          {/* 📦 Meta Info */}
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>Brand:</strong> {product.brand || 'N/A'}
            </p>
            <p>
              <strong>Category:</strong> {product.category?.name || 'Uncategorized'}
            </p>
            <p>
              <strong>Stock:</strong>{' '}
              {product.countInStock > 0 ? (
                <span className="text-green-600 font-semibold">
                  {product.countInStock} available
                </span>
              ) : (
                <span className="text-red-500 font-semibold">Out of Stock</span>
              )}
            </p>
          </div>

          {/* ➕ Cart Controls */}
          {product.countInStock > 0 && (
            <div className="flex items-center gap-3 mt-4">
              <span className="font-medium">Quantity:</span>
              <button
                className="px-3 py-1 bg-gray-200 rounded"
                onClick={() => setQty((prev) => Math.max(prev - 1, 1))}
              >
                −
              </button>
              <span>{qty}</span>
              <button
                className="px-3 py-1 bg-orange-500 text-white rounded"
                onClick={() => setQty(qty + 1)}
              >
                +
              </button>
              <button
                onClick={handleAddToCart}
                className="ml-4 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded shadow"
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex gap-6 border-b mb-4">
          {['description', 'specs'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-2 px-4 font-medium capitalize ${
                tab === t
                  ? 'border-b-4 border-orange-500 text-orange-600'
                  : 'text-gray-500'
              }`}
            >
              {t === 'description' ? 'Product Description' : 'Specifications'}
            </button>
          ))}
        </div>
        <div className="text-gray-700 leading-relaxed">
          {tab === 'description'
            ? product.description || 'No description available.'
            : product.specs || 'Specifications not provided.'}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            You may also like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
