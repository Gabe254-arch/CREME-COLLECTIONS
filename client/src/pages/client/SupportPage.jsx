import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaHeadset } from 'react-icons/fa';

const SupportPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  // 📩 Submit Support Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = form;

    if (!name || !email || !message) {
      return toast.error('Please fill in all fields.');
    }

    try {
      setLoading(true);
      await axios.post('/api/support', form); // 📤 Future endpoint
      toast.success('✅ Message sent! Our team will contact you.');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to send support request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-orange-600 flex items-center gap-2 mb-6">
        <FaHeadset className="text-orange-600" />
        Contact Support
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-white p-6 rounded-xl shadow-md border border-gray-100"
      >
        <div>
          <label className="block mb-1 text-sm text-gray-700 font-medium">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700 font-medium">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700 font-medium">Message</label>
          <textarea
            rows="5"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            placeholder="How can we help you?"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-orange-500 text-white px-6 py-2 rounded-md font-semibold hover:bg-orange-600 transition ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Sending...' : 'Submit'}
        </button>
      </form>

      {/* 🔮 Future Chatbot Widget Placeholder */}
      <div className="mt-10 text-center text-sm text-gray-500">
        💡 Need instant help? A live AI assistant is coming soon.
      </div>
    </div>
  );
};

export default SupportPage;
