import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AOS from 'aos';
import { toast } from 'react-toastify';
import 'aos/dist/aos.css';

const TopRatedCarousel = () => {
  const [topRated, setTopRated] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 700, once: true });

    const fetchTopRated = async () => {
      try {
        const { data } = await axios.get('/api/products/top-rated');
        setTopRated(data || []);
      } catch (err) {
        console.error('❌ Failed to load top-rated products:', err.message);
      }
    };

    fetchTopRated();
  }, []);

  if (!topRated.length) return null;

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const exists = cart.find(p => p._id === product._id);
    const updatedCart = exists
      ? cart.map(p => p._id === product._id ? { ...p, qty: p.qty + 1 } : p)
      : [...cart, { ...product, qty: 1 }];
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    toast.success('✅ Added to cart');
  };

  const settings = {
    autoplay: true,
    dots: false,
    arrows: false,
    infinite: true,
    speed: 600,
    slidesToShow: Math.min(topRated.length, 4),
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="bg-white px-4 py-6" data-aos="fade-up">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">⭐ Top Rated Products</h2>

        <Slider {...settings}>
          {topRated.map(product => (
            <div
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
              className="rounded shadow hover:shadow-md transition-all cursor-pointer mx-2 bg-white"
            >
              <img
                src={
                  product.images?.[0]
                    ? product.images[0].startsWith('/uploads/')
                      ? `http://localhost:5000${product.images[0]}`
                      : product.images[0]
                    : '/default-product.png'
                }
                alt={product.name}
                loading="lazy"
                className="w-full h-48 object-cover rounded-t"
                onError={e => { e.currentTarget.src = '/default-product.png'; }}
              />
              <div className="p-3">
                <h3 className="text-sm font-semibold truncate mb-1">{product.name}</h3>
                <div className="text-sm text-gray-500">
                  {product.originalPrice && (
                    <span className="line-through mr-2 text-xs text-gray-400">
                      Ksh {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-green-600 font-bold">
                    Ksh {product.price.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={(e) => handleAddToCart(product, e)}
                  className="mt-2 bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 rounded transition"
                >
                  + Add to Cart
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default TopRatedCarousel;
