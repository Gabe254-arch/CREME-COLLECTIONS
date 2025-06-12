import Meta from '../components/Meta';
import React, { Suspense, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// 🧩 Core Components
import Navbar from '../components/Navbar';
import CategoryMenu from '../components/CategoryMenu';
import HeroBanner from '../components/HeroBanner';
import HeroFeaturesGrid from '../components/HeroFeaturesGrid';
import FlashSale from '../components/FlashSale';
import DealsSection from '../components/DealsSection';
import TopRatedCarousel from '../components/TopRatedCarousel';
import CategoryShowcase from '../components/CategoryShowcase';
import PromoBanner from '../components/PromoBanner';
import Footer from '../components/Footer';
import FloatingAssistant from '../components/FloatingAssistant';
import FeaturedCategoriesGrid from '../components/FeaturedCategoriesGrid';
import TopCategoriesBanner from '../components/TopCategoriesBanner';
import PortraitPromoSlider from '../components/PortraitPromoSlider';

// ⏳ Lazy-Loaded Enhancements
const LazyNewsletter = React.lazy(() => import('../components/NewsletterSignup'));
const LazyServiceHighlights = React.lazy(() => import('../components/ServiceHighlights'));

const LandingPage = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="bg-[#f9f9f9] text-gray-800 font-sans overflow-x-hidden">
      <Meta
        title="Creme Collections | Kenya's Premier Online Shop — Electronics, Fashion, Accessories"
        description="Shop the best deals on electronics, fashion, beauty, and more with fast Kenya-wide delivery. Discover why Creme Collections is your #1 online destination."
        url="https://www.cremecollections.shop"
        image="https://www.cremecollections.shop/assets/og-banner.jpg"
        type="website"
      />

      {/* 🔝 Sticky Navbar */}
      <header className="sticky top-0 z-50 shadow bg-white">
        <Navbar />
        <CategoryMenu />
      </header>

      <main className="grid gap-12 md:gap-16 lg:gap-20">
        {/* 🎯 Hero Section with Slider */}
        <section data-aos="fade-up">
          <HeroBanner />
        </section>

        {/* 🧠 Value Propositions */}
        <section data-aos="fade-up" className="px-4 md:px-10 lg:px-20">
          <HeroFeaturesGrid />
        </section>

        {/* 🔥 Flash Sales */}
        <section className="px-4 md:px-10 lg:px-20 py-10 bg-white" data-aos="fade-up">
          <FlashSale />
        </section>

        {/* 🏅 Weekly Deals */}
        <section className="px-4 md:px-10 lg:px-20 py-10 bg-white" data-aos="fade-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Deals of the Week</h2>
            <a href="/shop/deals" className="text-orange-600 hover:underline text-sm font-medium">
              View All Deals
            </a>
          </div>
          <DealsSection />
          <div className="mt-8">
            <img
              src="http://localhost:5000/uploads/deals-banner.webp"
              alt="Deals Banner"
              className="w-full object-cover rounded-lg shadow-sm"
            />
          </div>
        </section>

        {/* 🏆 Top Rated Products */}
        <section className="px-4 md:px-10 lg:px-20 py-10 bg-white" data-aos="fade-up">
          <TopRatedCarousel />
        </section>

        {/* 🧭 Browse by Category */}
        <section className="px-4 md:px-10 lg:px-20 py-10 bg-white" data-aos="fade-up">
          <CategoryShowcase />
        </section>

        {/* 🧩 Featured Category Grid */}
        <section className="px-4 md:px-10 lg:px-20 py-10 bg-white" data-aos="fade-up">
          <FeaturedCategoriesGrid />
        </section>

        {/* 🖼️ Horizontal Category Banners */}
        <section className="px-4 md:px-10 lg:px-20 py-10 bg-white" data-aos="fade-up">
          <TopCategoriesBanner />
        </section>

        {/* 📸 Promotional Highlights */}
        <section className="px-4 md:px-10 lg:px-20 py-10 bg-white" data-aos="fade-up">
          <PromoBanner />
        </section>

        {/* 📱 Portrait Promo Banners */}
        <section className="px-4 md:px-10 lg:px-20 py-10 bg-white" data-aos="fade-up">
          <PortraitPromoSlider />
        </section>

        {/* 📬 Newsletter Signup */}
        <Suspense fallback={<div className="text-center py-6 text-sm text-gray-400">Loading newsletter...</div>}>
          <section className="px-4 md:px-10 lg:px-20 py-10 bg-white" data-aos="fade-up">
            <LazyNewsletter />
          </section>
        </Suspense>

        {/* 🛡️ Service Information */}
        <Suspense fallback={<div className="text-center py-6 text-sm text-gray-400">Loading services...</div>}>
          <section className="px-4 md:px-10 lg:px-20 py-10 bg-white" data-aos="fade-up">
            <LazyServiceHighlights />
          </section>
        </Suspense>
      </main>

      {/* 🦶 Footer */}
      <footer data-aos="fade-up">
        <Footer />
      </footer>

      {/* 🤖 Smart Assistant */}
      <FloatingAssistant />
    </div>
  );
};

export default LandingPage;
