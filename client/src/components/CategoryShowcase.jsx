import React from 'react';
import { useNavigate } from 'react-router-dom';

const categoryBlocks = [
  {
    title: 'Electronics',
    image: '/showcase/electronics.png',
    slug: 'electronics',
  },
  {
    title: 'Fashion & Apparel',
    image: '/showcase/fashion.png',
    slug: 'fashion',
  },
  {
    title: 'Home & Living',
    image: '/showcase/home.png',
    slug: 'home-living',
  },
  {
    title: 'Appliances',
    image: '/showcase/appliances.png',
    slug: 'appliances',
  },
  
  {
    title: 'Beauty & Health',
    image: '/showcase/beauty.png',
    slug: 'beauty-health',
  },
];

const CategoryShowcase = () => {
  const navigate = useNavigate();

  return (
    <section style={{ padding: '2rem' }}>
      <h2 style={{
        fontSize: '1.4rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        color: '#333'
      }}>
         Explore Categories
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem'
      }}>
        {categoryBlocks.map(cat => (
          <div
            key={cat.slug}
            onClick={() => navigate(`/shop?category=${cat.slug}`)}
            style={{
              cursor: 'pointer',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              transition: 'transform 0.3s ease',
              backgroundColor: '#fff'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img
              src={cat.image}
              alt={cat.title}
              style={{
                width: '100%',
                height: '160px',
                objectFit: 'cover',
              }}
              onError={(e) => e.currentTarget.style.display = 'none'}
            />
            <div style={{
              padding: '0.8rem',
              textAlign: 'center',
              fontWeight: 600,
              color: '#222',
              fontSize: '1rem'
            }}>
              {cat.title}
            </div>
          </div>
        ))}

        
      </div>
    </section>
  );
};

export default CategoryShowcase;
