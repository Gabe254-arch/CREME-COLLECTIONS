import React from 'react';
import { Link } from 'react-router-dom';

const SitemapPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">Website Sitemap</h1>

      <p className="mb-4">Navigate all main areas of Creme Collections below:</p>

      <ul className="list-disc pl-6 space-y-2 text-blue-700">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/shop">Shop</Link></li>
        <li><Link to="/cart">Cart</Link></li>
        <li><Link to="/checkout">Checkout</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/returns">Returns & Refunds</Link></li>
        <li><Link to="/terms">Terms & Conditions</Link></li>
        <li><Link to="/privacy">Privacy Policy</Link></li>
        <li><Link to="/shipping">Shipping & Delivery</Link></li>
        <li><Link to="/contact">Contact Us</Link></li>
        <li><Link to="/sitemap">Sitemap</Link></li>
      </ul>

      <p className="text-sm text-gray-500 mt-10">Last updated: {new Date().toLocaleDateString()}</p>
    </div>
  );
};

export default SitemapPage;
