import React from 'react';

// ✅ Sample brand logos — replace with real logos
const brands = [
  { id: 1, name: 'Samsung', logo: '/brands/samsung.png' },
  { id: 2, name: 'LG', logo: '/brands/lg.png' },
  { id: 3, name: 'Sony', logo: '/brands/sony.png' },
  { id: 4, name: 'TCL', logo: '/brands/tcl.png' },
  { id: 5, name: 'Hisense', logo: '/brands/hisense.png' },
];

const BrandShowcase = () => {
  return (
    <div className="py-10 bg-white rounded-md shadow-sm px-4">
      <h2 className="text-xl font-bold text-gray-800 text-center mb-6">🏆 Trusted Brands</h2>
      <div className="flex justify-center flex-wrap gap-8 items-center">
        {brands.map((brand) => (
          <img
            key={brand.id}
            src={brand.logo}
            alt={brand.name}
            title={brand.name}
            className="h-12 grayscale hover:grayscale-0 transition duration-300 ease-in-out cursor-pointer"
          />
        ))}
      </div>
    </div>
  );
};

export default BrandShowcase;
