import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AOS from 'aos';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.warning('⚠️ Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post('/api/newsletter/subscribe', { email });
      toast.success(data.message || '🎉 Subscribed successfully!');
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || '❌ Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#f5f5f5] py-10 px-4" data-aos="fade-up">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-2">📬 Join Our Newsletter</h2>
        <p className="text-sm text-gray-600 mb-4">
          Stay updated with the latest deals, product launches, and insider-only offers.
        </p>
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="email"
            className="w-full sm:w-2/3 px-4 py-2 border border-gray-300 rounded focus:outline-none"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded transition"
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSignup;
