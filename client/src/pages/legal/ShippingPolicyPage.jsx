import React from 'react';

const ShippingPolicyPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">Shipping & Delivery Policy</h1>

      <p className="mb-4">
        This policy outlines the terms under which ÇRÉME COLLECTIONS LIMITED provides delivery services across Kenya and East Africa.
      </p>

      <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">1. Coverage Area</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>We offer nationwide delivery across Kenya.</li>
        <li>Cross-border delivery available in East Africa (Uganda, Tanzania, Rwanda).</li>
      </ul>

      <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">2. Delivery Timelines</h2>
      <ul className="list-disc pl-6 mb-4">
        <li><strong>Nairobi:</strong> Same-day or next-day delivery (based on cut-off time).</li>
        <li><strong>Other major towns:</strong> 1–3 business days.</li>
        <li><strong>Remote areas:</strong> Up to 5 business days.</li>
      </ul>

      <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">3. Delivery Fees</h2>
      <p className="mb-4">
        Delivery charges depend on your location and order weight. You'll be notified of shipping costs during checkout.
      </p>

      <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">4. Delays & Exceptions</h2>
      <p className="mb-4">
        Delivery may be delayed due to weather, transport strikes, or regional restrictions. We will notify you promptly.
      </p>

      <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">5. Contact & Tracking</h2>
      <p className="mb-4">
        You’ll receive an SMS/email with tracking details once your order is dispatched. Contact us at{' '}
        <a href="mailto:logistics@cremecollections.shop" className="text-blue-600 underline">
          logistics@cremecollections.shop
        </a>{' '}
        or WhatsApp <a href="https://wa.me/254743117211" className="text-blue-600 underline">+254 743 117 211</a>.
      </p>

      <p className="text-sm text-gray-500 mt-8">Last updated: {new Date().toLocaleDateString()}</p>
    </div>
  );
};

export default ShippingPolicyPage;
