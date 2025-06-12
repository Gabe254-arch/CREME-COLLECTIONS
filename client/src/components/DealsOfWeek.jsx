import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

const DealsOfWeek = () => {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    axios.get('/api/products/deals')
      .then(res => setDeals(res.data))
      .catch(() => setDeals([]));
  }, []);

  return (
    <section className="py-10">
      <h2 className="text-xl font-bold mb-4 text-orange-600 flex items-center gap-2">
        🧨 Deals of the Week
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {deals.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default DealsOfWeek;
