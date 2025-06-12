import React, { useEffect } from 'react';
import Slider from 'react-slick';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const testimonials = [
  {
    name: 'Jane Mwende',
    title: 'Verified Customer',
    feedback: 'This platform has completely changed how I shop. Fast delivery, amazing discounts, and great customer support!',
    rating: 5,
    image: '/avatars/user1.webp',
  },
  {
    name: 'Samuel Otieno',
    title: 'Frequent Buyer',
    feedback: 'Their checkout process is seamless, and the product quality is top-notch. I’m a loyal customer now.',
    rating: 4.5,
    image: '/avatars/user2.webp',
  },
  {
    name: 'Linda Wanjiku',
    title: 'Business Owner',
    feedback: 'I order stock for my shop here. Timely delivery, competitive pricing and the variety is unmatched.',
    rating: 4,
    image: '/avatars/user3.webp',
  },
];

const renderStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - half;
  return (
    <>
      {'★'.repeat(full)}
      {half && <span style={{ color: '#f39c12' }}>½</span>}
      {'☆'.repeat(empty)}
    </>
  );
};

const TestimonialCarousel = () => {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const settings = {
    autoplay: true,
    infinite: true,
    dots: true,
    arrows: false,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <section className="bg-[#fff8f0] py-12 px-4 md:px-20" data-aos="fade-up">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-orange-600">
        ❤️ What Our Customers Are Saying
      </h2>

      <Slider {...settings} className="max-w-3xl mx-auto">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-md mx-2 text-center">
            <img
              src={t.image}
              alt={t.name}
              className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
            />
            <p className="text-sm text-gray-600 italic mb-4">“{t.feedback}”</p>
            <h4 className="font-bold text-lg text-gray-800">{t.name}</h4>
            <p className="text-xs text-gray-500">{t.title}</p>
            <div className="text-orange-500 mt-2 text-base">
              {renderStars(t.rating)}
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default TestimonialCarousel;
