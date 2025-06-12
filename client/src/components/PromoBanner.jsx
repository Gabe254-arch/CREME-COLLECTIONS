import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css'; // ✅ Animate on scroll

const PromoBanner = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);

  // ✅ Animate on scroll
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // ✅ Fetch from backend CMS
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/promos'); // 🔁 Replace with deployed endpoint if needed
        const data = await res.json();
        setBanners(data);
      } catch (error) {
        console.error('❌ Failed to fetch promo banners:', error.message);
        // 🧱 Fallback demo banners
        setBanners([
          {
            id: 1,
            image: '/promos/free-delivery.webp',
            alt: 'Free delivery on all orders over Ksh 20,000',
            link: '/shop?deal=free-delivery',
          },
          {
            id: 2,
            image: '/promos/back-to-school.webp',
            alt: 'Back to school deals now live',
            link: '/shop?category=stationery',
          },
          {
            id: 3,
            image: '/promos/flash-sale.webp',
            alt: 'Flash Sale! Limited Time Only',
            link: '/shop?deal=flash-sale',
          },
        ]);
      }
    };

    fetchBanners();
  }, []);

  return (
    <section className="px-4 md:px-10 lg:px-20 py-10 bg-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div
            key={banner.id}
            onClick={() => navigate(banner.link)}
            className="relative group overflow-hidden cursor-pointer rounded-2xl shadow-md hover:shadow-lg transition-transform duration-300 hover:scale-105"
            data-aos="zoom-in-up"
          >
            <picture>
              <source srcSet={banner.image} type="image/webp" />
              <img
                src={banner.image.replace('.webp', '.jpg')}
                alt={banner.alt}
                className="w-full h-[200px] object-cover rounded-2xl"
                loading="lazy"
                onError={(e) => (e.target.src = '/fallback.jpg')}
              />
            </picture>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition duration-300 rounded-2xl" />

            {/* Tag */}
            <span className="absolute bottom-3 left-3 text-white font-semibold text-sm bg-orange-500 px-3 py-1 rounded-md shadow-md">
              {banner.alt}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PromoBanner;
