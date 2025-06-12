// src/components/Meta.jsx
import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const trendingKeywords = [
  'online shopping Kenya', 'affordable smartphones', 'electronics Nairobi',
  'fashion trends Kenya', 'home appliances Kenya', 'best online shop',
  'kids toys Kenya', 'laptops Mombasa', 'smart TVs Nairobi',
  'kitchenware deals Kenya', 'beauty products online', 'fast delivery Kenya',
  'trusted online store', 'fashion deals Nairobi', 'ecommerce Kenya 2025',
  'digital watches Kenya', 'gaming accessories Kenya', 'Creme Collections Deals',
  'buy electronics online', 'home decor Kenya', 'discount phones Nairobi',
  'Creme Collections Kenya', 'Creme Collections offers', 'Creme Collections shop'
];

const getRandomKeywords = () => {
  const shuffled = trendingKeywords.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 10).join(', ');
};

const Meta = ({
  title = "Creme Collections – Kenya's Most Trusted Online Shop",
  description = "Shop Creme Collections for the best deals in Kenya. Electronics, fashion, appliances, beauty & more. Fast delivery. Trusted. Secure.",
  keywords = getRandomKeywords(),
  image = "https://www.cremecollections.shop/logo-banner.jpg",
  url = "https://www.cremecollections.shop",
  type = "website"
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Creme Collections",
    "url": url,
    "logo": "https://www.cremecollections.shop/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+254743117211",
      "contactType": "customer support",
      "areaServed": "KE",
      "availableLanguage": ["English", "Swahili"]
    },
    "sameAs": [
      "https://www.facebook.com/cremecollections",
      "https://www.instagram.com/cremecollections"
    ]
  };

  return (
    <HelmetProvider>
      <Helmet>
        {/* Primary SEO */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={url} />

        {/* OpenGraph Tags */}
        <meta property="og:type" content={type} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />

        {/* Twitter Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />

        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
    </HelmetProvider>
  );
};

export default Meta;
