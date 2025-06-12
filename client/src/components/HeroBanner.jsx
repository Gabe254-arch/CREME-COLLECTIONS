import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 🖼️ Banner slide config
const bannerData = [
  {
    id: 1,
    image: '/banners/slide1.png',
    link: '/shop?deal=week',
  },
  {
    id: 2,
    image: '/banners/slide2.png',
    link: '/product/featured',
  },
  {
    id: 3,
    image: '/banners/slide3.png',
    link: '/shop?category=electronics',
  },
];

const HeroBanner = () => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  // 🔁 Auto slide every 6s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % bannerData.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-gray-100 rounded-md shadow-sm z-10">
      {/* 📸 Banner Container */}
      <div className="relative h-[260px] sm:h-[340px] md:h-[420px] lg:h-[460px]">
        {bannerData.map((banner, i) => (
          <img
            key={banner.id}
            src={banner.image}
            alt={`Banner ${i + 1}`}
            onClick={() => navigate(banner.link)}
            className={`absolute w-full h-full object-cover cursor-pointer transition-opacity duration-700 ease-in-out ${
              index === i ? 'opacity-100 z-20' : 'opacity-0 z-10'
            }`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.style.display = 'none';
            }}
          />
        ))}
      </div>

      {/* 🔘 Dot Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
        {bannerData.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === i ? 'bg-orange-500 scale-125' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;
