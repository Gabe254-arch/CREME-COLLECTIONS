import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">Privacy Policy</h1>

      <p className="mb-4">
        This Privacy Policy explains how ÇRÉME COLLECTIONS LIMITED (“we”, “our”, “us”) collects, stores, uses, and discloses your information when you use our services or visit our website (
        <a href="https://www.cremecollections.shop" className="text-blue-600 underline">www.cremecollections.shop</a>).
        We are committed to safeguarding your privacy and protecting your data as per the <strong>Kenya Data Protection Act No. 24 of 2019</strong>.
      </p>

      <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">1. What We Collect</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Full name, email, and mobile number</li>
        <li>Billing and delivery address</li>
        <li>Order history and transaction records</li>
        <li>Marketing preferences and communication logs</li>
        <li>Technical data (IP address, browser type, device ID)</li>
        <li>Cookies and usage behavior for site analytics</li>
        <li>Location data (with user permission)</li>
      </ul>

      <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">2. Purpose of Collection</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>To process your orders and manage your account</li>
        <li>To enhance user experience and personalize content</li>
        <li>To respond to your inquiries and provide support</li>
        <li>To protect against fraud and unauthorized access</li>
        <li>To comply with legal obligations</li>
        <li>To deliver targeted advertising (only with consent)</li>
      </ul>

      <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">3. Data Storage & Protection</h2>
      <p className="mb-4">
        We use encrypted servers hosted in secure data centers that comply with GDPR and international cybersecurity standards.
        Sensitive data such as passwords and payment information is encrypted using industry-grade technologies (SSL, HTTPS, SHA256).
      </p>
      <p className="mb-4">
        Only authorized personnel and trusted third-party providers (e.g., PayPal, MPESA, I&M Bank) are granted access to limited data as needed to fulfill services.
      </p>

      <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">4. Sharing of Personal Data</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>We do NOT sell your personal data.</li>
        <li>We may share data with:
          <ul className="list-disc pl-6">
            <li>Delivery partners for order fulfillment</li>
            <li>Payment processors for secure transactions</li>
            <li>Regulatory bodies if legally required</li>
          </ul>
        </li>
      </ul>

      <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">5. Your Rights</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Right to access, correct, or delete your personal data</li>
        <li>Right to withdraw consent at any time</li>
        <li>Right to object to automated processing</li>
        <li>Right to data portability</li>
        <li>Right to file a complaint with the Data Commissioner (Kenya)</li>
      </ul>

      <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">6. Cookies and Tracking</h2>
      <p className="mb-4">
        We use cookies to improve functionality and analyze traffic. You may disable cookies via your browser settings, but this may affect site performance.
      </p>

      <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">7. Children’s Privacy</h2>
      <p className="mb-4">
        We do not knowingly collect data from anyone under the age of 18 without parental consent. If this occurs, we will delete the data immediately upon discovery.
      </p>

      <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">8. Updates to This Policy</h2>
      <p className="mb-4">
        This policy may be updated to reflect changes in law or business practices. Any changes will be posted here and, where appropriate, notified to you by email.
      </p>

      <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">9. Contact Information</h2>
      <p className="mb-4">
        If you have questions or concerns, contact our Data Privacy Officer:<br />
        📧 <a href="mailto:privacy@cremecollections.shop" className="text-blue-600 underline">privacy@cremecollections.shop</a><br />
        📞 +254 743 117 211<br />
        ÇRÉME COLLECTIONS LIMITED — Nairobi, Kenya
      </p>

      <p className="text-sm text-gray-500 mt-8">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;
