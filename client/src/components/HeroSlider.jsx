import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HeroSlider = () => {
  const [banners, setBanners] = useState([]);

  // 🔁 Fetch from backend or fallback
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await axios.get('/api/banners');
        setBanners(Array.isArray(data) && data.length ? data : fallbackBanners);
      } catch (err) {
        console.error('⚠️ Failed to load banners. Using fallback.', err.message);
        setBanners(fallbackBanners);
      }
    };

    fetchBanners();
    AOS.init({ duration: 1000, once: true });
  }, []);

  // 🖼️ Default banners (if no CMS)
  const fallbackBanners = [
    { image: '/uploads/banner1.webp', alt: 'Smartwatch Sale' },
    { image: '/uploads/banner2.webp', alt: 'Back-to-School Essentials' },
    { image: '/uploads/banner3.webp', alt: 'Home Electronics Deals' },
  ];

  const settings = {
    autoplay: true,
    arrows: false,
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    cssEase: 'ease-in-out',
  };

  return (
    <section className="w-full overflow-hidden rounded-md shadow-md" data-aos="zoom-in">
      <Slider {...settings}>
        {banners.map((b, idx) => (
          <div key={idx} className="relative">
            <img
              src={b.image}
              alt={b.alt}
              loading="lazy"
              className="w-full h-[350px] sm:h-[420px] md:h-[460px] lg:h-[500px] object-cover transition-transform duration-500 hover:scale-[1.01]"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/default-banner.jpg';
              }}
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent text-white px-6 py-4">
              <h3 className="text-xl font-bold">{b.alt}</h3>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default HeroSlider;
