import React from 'react';

const ContactPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">Contact Us</h1>

      <p className="mb-4">Need help? Get in touch through any of the following channels:</p>

      <ul className="list-disc pl-6 mb-4">
        <li>Email: <a href="mailto:info@cremecollections.shop" className="text-blue-600 underline">info@cremecollections.shop</a></li>
        <li>Tech Support: <a href="mailto:tech-support@cremecollections.shop" className="text-blue-600 underline">tech-support@cremecollections.shop</a></li>
        <li>WhatsApp: <a href="https://wa.me/254743117211" className="text-blue-600 underline">+254 743 117 211</a></li>
        <li>Phone: +254 742 468 070 / +254 717 988 700</li>
        <li>Business Hours: Mon – Sat, 8AM – 7PM EAT</li>
      </ul>

      <h2 className="text-xl font-semibold text-orange-500 mt-8 mb-2">Head Office</h2>
      <div className="mb-4">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8176281199417!2d36.82303937496576!3d-1.2832769987045158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f11bfdd229f0f%3A0x1bb6f341ce62e64e!2sCreme%20Collections!5e0!3m2!1sen!2ske!4v1748422194580!5m2!1sen!2ske"
          width="100%" height="400" style={{ border: 0 }} allowFullScreen loading="lazy" title="Creme Map"
        ></iframe>
      </div>

      <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
    </div>
  );
};

export default ContactPage;
