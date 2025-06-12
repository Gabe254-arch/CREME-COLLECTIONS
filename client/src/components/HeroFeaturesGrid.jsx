import React from 'react';
import { FaShippingFast, FaLock, FaHeadset } from 'react-icons/fa';

const HeroFeaturesGrid = () => {
  const features = [
    {
      icon: <FaShippingFast className="text-orange-500 text-3xl" />,
      title: 'Fast Nationwide Delivery',
      description: 'Receive your order anywhere in Kenya within 24–72 hours.',
    },
    {
      icon: <FaLock className="text-orange-500 text-3xl" />,
      title: '100% Secure Payments',
      description: 'Protected transactions with SSL encryption.',
    },
    {
      icon: <FaHeadset className="text-orange-500 text-3xl" />,
      title: 'Quality Customer Support',
      description: 'Our team is always ready to assist with your orders.',
    },
  ];

  return (
    <div className="bg-white py-6 px-4 md:px-10 lg:px-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
        {features.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-4 rounded-lg shadow-sm bg-gray-50 hover:shadow-md transition"
          >
            {item.icon}
            <h4 className="mt-3 text-lg font-semibold text-gray-800">{item.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroFeaturesGrid;
