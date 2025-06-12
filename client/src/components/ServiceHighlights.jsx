import React from 'react';
import { FaShippingFast, FaShieldAlt, FaUndoAlt, FaTags } from 'react-icons/fa';

const highlights = [
  {
    icon: <FaShippingFast className="text-orange-600 text-3xl" />,
    title: 'Fast Nationwide Delivery',
    desc: 'We deliver across Kenya within 24-72 hours.',
  },
  {
    icon: <FaShieldAlt className="text-orange-600 text-3xl" />,
    title: 'Secure Shopping',
    desc: 'Your data and payments are fully protected.',
  },
  {
    icon: <FaUndoAlt className="text-orange-600 text-3xl" />,
    title: 'Easy Returns',
    desc: 'Return within 24 hours if not satisfied.',
  },
  {
    icon: <FaTags className="text-orange-600 text-3xl" />,
    title: 'Best Prices Guaranteed',
    desc: 'Shop smarter, save bigger with us.',
  },
];

const ServiceHighlights = () => {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {highlights.map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            {item.icon}
            <h4 className="font-bold text-sm">{item.title}</h4>
            <p className="text-xs text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceHighlights;
