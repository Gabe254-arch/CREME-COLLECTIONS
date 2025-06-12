import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const PortraitPromoSlider = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/promos/portrait');
        const contentType = res.headers.get('content-type');

        if (res.ok && contentType?.includes('application/json')) {
          const data = await res.json();
          setBanners(Array.isArray(data) ? data : []);
        } else {
          throw new Error('Invalid JSON response');
        }
      } catch (error) {
        console.error('❌ Failed to fetch portrait promos:', error.message);
        setBanners([
          {
            id: 1,
            image: '/uploads/portrait-deal-smartphones.png',
            alt: 'Smartphones Deals - Up to 40% Off 📱',
            link: '/shop?category=smartphones',
          },
          {
            id: 2,
            image: '/uploads/portrait-deal-laptops.png',
            alt: 'Work & Play Laptops 💻',
            link: '/shop?subcategory=laptops',
          },
          {
            id: 3,
            image: '/uploads/portrait-deal-beauty.png',
            alt: 'Skincare & Beauty Essentials ✨',
            link: '/shop?category=beauty',
          },
          {
            id: 4,
            image: '/uploads/portrait-deal-tv.png',
            alt: 'Cinema Experience at Home 📺',
            link: '/shop?subcategory=television',
          },
          {
            id: 5,
            image: '/uploads/portrait-deal-fashion.png',
            alt: 'New Season Fashion Trends 👗',
            link: '/shop?category=fashion',
          },
          {
            id: 6,
            image: '/uploads/portrait-deal-electronics.png',
            alt: 'Home Electronics at Best Prices 🔌',
            link: '/shop?category=electronics',
          },
        ]);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners]);

  const handleNavigate = (link) => {
    if (link) navigate(link);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % banners.length);
  };

  if (banners.length === 0) {
    return (
      <div className="text-center text-gray-400 py-16 bg-white">
        No promotional banners found.
      </div>
    );
  }

  return (
    <section className="relative px-4 md:px-10 lg:px-20 py-10 bg-white" data-aos="fade-up">
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white text-orange-600 hover:text-white hover:bg-orange-500 shadow-md p-2 rounded-full transition md:left-8"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white text-orange-600 hover:text-white hover:bg-orange-500 shadow-md p-2 rounded-full transition md:right-8"
      >
        <FaChevronRight />
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {banners.map((banner, idx) => (
          <div
            key={banner.id || idx}
            onClick={() => handleNavigate(banner.link)}
            className={`cursor-pointer overflow-hidden rounded-xl relative shadow-lg transform transition-all duration-700 ${
              index === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            <img
              src={banner.image}
              alt={banner.alt}
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/uploads/default-product.png';
              }}
              className="w-full h-[360px] object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 hover:bg-black/30 transition duration-300 rounded-xl" />
            <div className="absolute bottom-4 left-4 bg-orange-600 text-white text-xs font-semibold px-3 py-1 rounded shadow">
              {banner.alt}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PortraitPromoSlider;
