import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Slider from 'react-slick';
import { toast } from 'react-toastify';

/**
 * 🏷️ DealsSection — Displays "Deals of the Week" with slider or grid fallback
 */
const DealsSection = () => {
  const [deals, setDeals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    const fetchDeals = async () => {
      try {
        const { data } = await axios.get('/api/products/deals');
        const products = Array.isArray(data) ? data : data.products || [];
        setDeals(products);
      } catch (err) {
        console.error('❌ Failed to load deals:', err.message);
        setDeals([]);
      }
    };

    fetchDeals();
  }, []);

  if (deals.length === 0) return null;

  const sliderSettings = {
    autoplay: true,
    arrows: false,
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: Math.min(deals.length, 5),
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const exists = cart.find(i => i._id === product._id);
    const updatedCart = exists
      ? cart.map(i => i._id === product._id ? { ...i, qty: i.qty + 1 } : i)
      : [...cart, { ...product, qty: 1 }];
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    toast.success('🛒 Added to cart!');
  };

  return (
    <section className="bg-white" data-aos="fade-up">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 lg:px-20 py-10">
        {/* 🏷 Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 012 0v12a1 1 0 11-2 0V4zm12-1a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zM9 6a1 1 0 011 1v6a1 1 0 11-2 0V7a1 1 0 011-1z" />
            </svg>
            Deals of the Week
          </h2>
          <a href="/shop/deals" className="text-sm text-orange-600 hover:underline font-medium">
            View All Deals →
          </a>
        </div>

        {/* 🧭 Dynamic Slider or Fallback Grid */}
        {deals.length >= 5 ? (
          <Slider {...sliderSettings}>
            {deals.map(product => (
              <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} navigate={navigate} />
            ))}
          </Slider>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {deals.map(product => (
              <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} navigate={navigate} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// ✅ Individual Product Card
const ProductCard = ({ product, onAddToCart, navigate }) => {
  const imageSrc = product.images?.[0]
    ? product.images[0].startsWith('/uploads/')
      ? `http://localhost:5000${product.images[0]}`
      : product.images[0]
    : '/default-product.png';

  return (
    <div
      onClick={() => navigate(`/product/${product._id}`)}
      className="bg-white rounded-md border hover:shadow-md transition-all cursor-pointer overflow-hidden group"
    >
      <img
        src={imageSrc}
        alt={product.name}
        loading="lazy"
        className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = '/default-product.png';
        }}
      />
      <div className="p-3 flex flex-col gap-1">
        <h3 className="text-sm font-medium truncate">{product.name}</h3>
        {product.originalPrice && (
          <div className="text-xs text-gray-400 line-through">
            Ksh {product.originalPrice.toLocaleString()}
          </div>
        )}
        <div className="text-orange-600 font-semibold text-sm">
          Ksh {product.price.toLocaleString()}
        </div>
        <button
          onClick={(e) => onAddToCart(product, e)}
          className="bg-green-600 hover:bg-green-700 text-white text-xs rounded py-1 mt-2 transition"
        >
          + Add to Cart
        </button>
      </div>
    </div>
  );
};

export default DealsSection;
