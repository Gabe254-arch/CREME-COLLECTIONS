import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">Terms & Conditions</h1>

      <p className="mb-4">
        These Terms and Conditions (“Terms”) apply to your use of the website{' '}
        <a href="https://www.cremecollections.shop" className="text-blue-600 underline">
          www.cremecollections.shop
        </a>{' '}
        (“Website”) operated by ÇRÉME COLLECTIONS LIMITED (“we”, “our”, “us”).
        By accessing or using this Website, you confirm that you have read, understood, and agreed to be bound by these Terms and applicable Kenyan law.
      </p>

      {/* Section 1 */}
      <h2 className="text-xl font-semibold mt-6 mb-2 text-orange-500">1. User Eligibility & Access</h2>
      <p className="mb-4">
        You must be at least 18 years of age to use this website or place an order. Use of this website for unlawful purposes, fraud, or violation of any national or international regulation is strictly prohibited.
      </p>

      {/* Section 2 */}
      <h2 className="text-xl font-semibold mt-6 mb-2 text-orange-500">2. Products, Pricing & Availability</h2>
      <ul className="list-disc list-inside mb-4">
        <li>All prices are listed in Kenyan Shillings (KES) unless otherwise stated.</li>
        <li>Product availability is subject to change without notice.</li>
        <li>Images shown are for illustration purposes and may slightly differ.</li>
        <li>We reserve the right to limit quantities or cancel orders if abuse is suspected.</li>
      </ul>

      {/* Section 3 */}
      <h2 className="text-xl font-semibold mt-6 mb-2 text-orange-500">3. Orders, Payments & Security</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Orders are considered confirmed once payment is made through supported methods (M-Pesa, I&M Bank, PayPal, or COD where applicable).</li>
        <li>We use encrypted gateways (SSL, HTTPS) for all transactions. Card or payment data is never stored on our servers.</li>
        <li>False, fraudulent, or unauthorized transactions will be reported and investigated.</li>
      </ul>

      {/* Section 4 */}
      <h2 className="text-xl font-semibold mt-6 mb-2 text-orange-500">4. Delivery & Shipping</h2>
      <p className="mb-4">
        Delivery is offered across Kenya and parts of East Africa. Estimated delivery times and charges will be indicated at checkout. Delays caused by couriers, natural disasters, or strikes are beyond our control.
      </p>

      {/* Section 5 */}
      <h2 className="text-xl font-semibold mt-6 mb-2 text-orange-500">5. Return & Refund Policy</h2>
      <p className="mb-4">
        Items may be returned within <strong>24 hours</strong> of delivery under the following conditions:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Item was delivered damaged, defective, or incorrect</li>
        <li>Item must be unused, in original packaging, and accompanied by a receipt</li>
        <li>Refunds are processed within 7 working days via the original payment method</li>
      </ul>

      {/* Section 6 */}
      <h2 className="text-xl font-semibold mt-6 mb-2 text-orange-500">6. User Accounts</h2>
      <p className="mb-4">
        Users are responsible for maintaining the confidentiality of their login credentials.
        We reserve the right to suspend or terminate accounts found engaging in misuse, fraud, or violation of these Terms.
      </p>

      {/* Section 7 */}
      <h2 className="text-xl font-semibold mt-6 mb-2 text-orange-500">7. Intellectual Property</h2>
      <p className="mb-4">
        All content, logos, visuals, and product descriptions are the exclusive intellectual property of ÇRÉME COLLECTIONS LIMITED and protected under the Copyright Act (Cap. 130, Laws of Kenya).
        Unauthorized reproduction, distribution, or copying is prohibited and will be prosecuted.
      </p>

      {/* Section 8 */}
      <h2 className="text-xl font-semibold mt-6 mb-2 text-orange-500">8. Limitation of Liability</h2>
      <p className="mb-4">
        We are not liable for indirect or consequential damages, loss of data, or loss of business arising from your use of our services.
        Our maximum liability shall not exceed the amount paid for a disputed order.
      </p>

      {/* Section 9 */}
      <h2 className="text-xl font-semibold mt-6 mb-2 text-orange-500">9. Governing Law & Disputes</h2>
      <p className="mb-4">
        These Terms shall be governed by the laws of the Republic of Kenya. Any disputes shall be handled in accordance with the laws of Kenya and heard by courts in Nairobi.
        You agree to submit to the exclusive jurisdiction of these courts.
      </p>

      {/* Section 10 */}
      <h2 className="text-xl font-semibold mt-6 mb-2 text-orange-500">10. Amendments & Updates</h2>
      <p className="mb-4">
        We may revise these Terms periodically. Changes will be effective once posted on this page. Users are advised to review this page regularly.
      </p>

      {/* Section 11 */}
      <h2 className="text-xl font-semibold mt-6 mb-2 text-orange-500">11. Contact & Legal Inquiries</h2>
      <p className="mb-4">
        For questions or legal concerns, contact us via:
        <br />
        📧 <a href="mailto:legal@cremecollections.shop" className="text-blue-600 underline">legal@cremecollections.shop</a><br />
        ☎️ +254743117211 / +254742468070
      </p>

      <p className="text-sm text-gray-500 mt-8">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
};

export default TermsAndConditions;
