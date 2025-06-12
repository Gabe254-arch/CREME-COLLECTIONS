import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const SeoHelmet = ({
  title = 'Creme Collections — All You Want, All In One Place',
  description = 'Creme Collections is your one-stop online store for everything you need — fashion, electronics, beauty, and more. Shop securely and enjoy fast delivery across Kenya.',
  url = 'https://www.cremecollections.shop',
  image = 'https://www.cremecollections.shop/og-banner.jpg', // Replace with your actual banner URL
  type = 'website'
}) => {
  return (
    <HelmetProvider>
      <Helmet>
        {/* 🌐 Standard SEO */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />

        {/* 📘 OpenGraph (Facebook/LinkedIn) */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />
        <meta property="og:type" content={type} />

        {/* 🐦 Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />

        {/* 📄 JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Creme Collections',
            url,
            logo: 'https://www.cremecollections.shop/logo.png',
            sameAs: [
              'https://www.facebook.com/cremecollections',
              'https://www.instagram.com/cremecollections',
              'https://www.twitter.com/cremecollects'
            ]
          })}
        </script>
      </Helmet>
    </HelmetProvider>
  );
};

export default SeoHelmet;
