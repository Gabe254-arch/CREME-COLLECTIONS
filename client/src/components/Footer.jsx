import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#1f1f1f',
        color: '#eee',
        padding: '4rem 2rem 6rem',
        position: 'relative',
        backgroundImage: 'url("/footer-pattern.png")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        opacity: 0.97,
      }}
    >
      {/* Grid Layout */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '3rem',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {/* 🏢 Brand Identity */}
        <div style={{ flex: '1 1 260px' }}>
          <img
            src="/logo-footer.png"
  alt="Creme Collections Logo"
  style={{ width: '160px', marginBottom: '1rem' }}
          />
          <p style={{ fontSize: '0.9rem', color: '#bbb', fontWeight: 300 }}>
            All you want, all in one place. Shop smarter with Creme Collections — Kenya's most trusted online marketplace.
          </p>
        </div>

        {/* 📂 Useful Pages */}
        <div>
          <h4 style={headingStyle}>Useful Pages</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><Link to="/shop" style={linkStyle}>All Products</Link></li>
            <li><Link to="/categories" style={linkStyle}>Browse Categories</Link></li>
            <li><Link to="/deals" style={linkStyle}>Deals of the Week</Link></li>
            <li><Link to="/featured" style={linkStyle}>Featured Items</Link></li>
            <li><Link to="/top-rated" style={linkStyle}>Top Rated</Link></li>
            <li><Link to="/wishlist" style={linkStyle}>My Wishlist</Link></li>
          </ul>
        </div>

        {/* 🧾 Legal & Help */}
        <div>
          <h4 style={headingStyle}>Help & Legal</h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><Link to="/returns" style={linkStyle}>Return Policy</Link></li>
            <li><Link to="/privacy" style={linkStyle}>Privacy Policy</Link></li>
            <li><Link to="/terms" style={linkStyle}>Terms & Conditions</Link></li>
            <li><Link to="/shipping" style={linkStyle}>Shipping Info</Link></li>
            <li><Link to="/sitemap" style={linkStyle}>Sitemap</Link></li>
            <li><Link to="/faq" style={linkStyle}>FAQs</Link></li>
          </ul>
        </div>

        {/* 💬 Newsletter Signup */}
        <div>
          <h4 style={headingStyle}>Join Our Newsletter</h4>
          <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 300 }}>
            Stay updated with the latest offers and product drops.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('✅ Subscribed!');
            }}
          >
            <input
              type="email"
              required
              placeholder="Your email address"
              style={inputStyle}
            />
            <button type="submit" style={btnStyle}>
              Subscribe
            </button>
          </form>
        </div>

        {/* 📞 Contact */}
        <div>
          <h4 style={headingStyle}>Customer Support</h4>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Email:</strong>{' '}
            <a href="mailto:support@cremecollections.com" style={linkStyle}>
              support@cremecollections.shop
            </a>
            <a href="mailto:support@cremecollections.com" style={linkStyle}>
              creme.collectionlt@gmail.com
            </a>
          </p>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>WhatsApp:</strong>{' '}
            <a href="https://wa.me/254700123456" target="_blank" rel="noreferrer" style={linkStyle}>
              +254 742 468070
            </a>
            <a href="https://wa.me/254700123456" target="_blank" rel="noreferrer" style={linkStyle}>
              +254 743 117211
            </a>
            <a href="https://wa.me/254700123456" target="_blank" rel="noreferrer" style={linkStyle}>
              +254 717 988700
            </a>
          </p>
          <p style={{ fontSize: '0.85rem', color: '#aaa' }}>
            Mon – Fri: 9am – 5pm EAT
          </p>
           <p style={{ fontSize: '0.85rem', color: '#aaa' }}>
            Saturday: 9am – 12pm EAT
          </p>
          <p style={{ fontSize: '0.85rem', color: '#aaa' }}>
            Sunday & Public Holidays: Closed
          </p>
        </div>
      </div>

      {/* 🌐 Social Media */}
      <div
        style={{
          marginTop: '3rem',
          borderTop: '1px solid #444',
          paddingTop: '2rem',
          textAlign: 'center',
        }}
      >
        <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Follow us on</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" style={iconLink}>
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" style={iconLink}>
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" style={iconLink}>
            <i className="fab fa-twitter"></i>
          </a>
        </div>
      </div>

      {/* ✅ Badge */}
      <img
        src="/trusted-site-badge.png"
        alt="Trusted Site Badge"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '80px',
          opacity: 0.9,
          zIndex: 9999,
        }}
      />

      {/* 📝 Copyright */}
      <p
        style={{
          textAlign: 'center',
          fontSize: '0.8rem',
          marginTop: '3rem',
          color: '#888',
          fontWeight: 300,
        }}
      >
        &copy; {new Date().getFullYear()} Creme Collections — All rights reserved.
      </p>
    </footer>
  );
};

// 🎨 Style Objects
const headingStyle = {
  color: '#ff6600',
  marginBottom: '1rem',
  fontSize: '1.1rem',
  fontWeight: 'bold',
};

const linkStyle = {
  color: '#eee',
  textDecoration: 'none',
  display: 'block',
  marginBottom: '0.4rem',
  fontWeight: 300,
};

const inputStyle = {
  padding: '0.5rem',
  width: '70%',
  borderRadius: '4px',
  border: 'none',
  marginBottom: '0.6rem',
};

const btnStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#ff6600',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 500,
};

const iconLink = {
  color: '#fff',
  fontSize: '1.2rem',
  textDecoration: 'none',
};

export default Footer;
