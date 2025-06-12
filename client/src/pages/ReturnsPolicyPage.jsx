import React from 'react';

const ReturnsPolicyPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">Returns & Refunds Policy</h1>

      <p className="mb-4">
        This policy governs the return and refund process for purchases made on 
        <a href="https://www.cremecollections.shop" className="text-blue-600 underline"> www.cremecollections.shop</a>, 
        operated by ÇRÉME COLLECTIONS LIMITED. We comply with the Consumer Protection Act, No. 46 of 2012 (Kenya), and related eCommerce guidelines.
      </p>

      {/* Section 1 */}
      <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">1. Return Eligibility</h2>
      <p className="mb-4">
        Customers may request a return within <strong>24 hours</strong> of delivery if:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>The item is damaged, defective, expired, or not as advertised.</li>
        <li>The product remains unused and in its original, unopened packaging.</li>
        <li>Proof of purchase and delivery receipt is available.</li>
      </ul>

      {/* Section 2 */}
      <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">2. Non-Returnable Items</h2>
      <p className="mb-4">The following items are excluded from return or exchange:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Products marked “Clearance”, “Final Sale”, or “Non-returnable”.</li>
        <li>Intimate items, skincare, or hygiene products once unsealed.</li>
        <li>Digital downloads, gift cards, or services.</li>
        <li>Customized, engraved, or made-to-order items unless faulty.</li>
      </ul>

      {/* Section 3 */}
      <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">3. Refund Process</h2>
      <p className="mb-4">
        Once we receive and inspect your returned item, we will notify you of approval or rejection via email or WhatsApp.
        If approved, your refund will be issued within <strong>3 to 7 business days</strong> to the original method of payment.
      </p>

      {/* Section 4 */}
      <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">4. Exchanges</h2>
      <p className="mb-4">
        If your item is defective or incorrect, we offer a one-time exchange within 24 hours.
        Stock availability will apply. We do not offer replacements for accidental damage or misuse.
      </p>

      {/* Section 5 */}
      <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">5. Return Shipping & Pickup</h2>
      <p className="mb-4">
        If the return is due to our error (e.g., wrong or damaged product), we will coordinate and pay for pickup.
        Otherwise, the buyer will cover return shipping. All returns must be addressed to our Nairobi warehouse (details provided upon request).
      </p>

      {/* Section 6 */}
      <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">6. How to Request a Return</h2>
      <p className="mb-4">
        Send your request with order details to:
        <br />
        📧 <a href="mailto:returns@cremecollections.shop" className="text-blue-600 underline">returns@cremecollections.shop</a><br />
        or WhatsApp: <a href="https://wa.me/254743117211" className="text-blue-600 underline">+254 743 117 211</a>
      </p>

      {/* Section 7 */}
      <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">7. Fraud Prevention & Abuse</h2>
      <p className="mb-4">
        To protect our business and customers, all return activity is monitored. Abuse of the returns policy may result in account restriction or legal action.
        ÇRÉME COLLECTIONS LIMITED reserves the right to reject suspicious return claims at its sole discretion.
      </p>

      {/* Section 8 */}
      <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">8. Legal Compliance</h2>
      <p className="mb-4">
        This policy does not affect your statutory rights under the Kenyan Consumer Protection Act.
        All disputes will be resolved in accordance with the laws of Kenya, and may be referred to the Competition Authority or the High Court of Kenya if necessary.
      </p>

      <p className="text-sm text-gray-500 mt-8">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
};

export default ReturnsPolicyPage;
