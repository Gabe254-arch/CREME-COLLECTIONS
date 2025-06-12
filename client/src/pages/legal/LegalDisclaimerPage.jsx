import React from 'react';

const LegalDisclaimerPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold text-orange-600 mb-6">Legal Disclaimer</h1>

      <p className="mb-4">
        The contents of this website are provided for general information purposes only. While ÇRÉME COLLECTIONS LIMITED takes every effort
        to ensure accuracy, we do not warrant or guarantee completeness or timeliness.
      </p>

      <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">1. Product Information</h2>
      <p className="mb-4">
        Product descriptions and images are illustrative. Variations may occur. Contact support if any clarification is needed before purchase.
      </p>

      <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">2. No Liability</h2>
      <p className="mb-4">
        ÇRÉME COLLECTIONS LIMITED shall not be liable for any damages or losses arising out of the use or inability to use this website.
      </p>

      <h2 className="text-xl font-semibold text-orange-500 mt-6 mb-2">3. External Links</h2>
      <p className="mb-4">
        Links to third-party websites are provided for convenience. We are not responsible for content or policies on those sites.
      </p>

      <p className="text-sm text-gray-500 mt-8">Last updated: {new Date().toLocaleDateString()}</p>
    </div>
  );
};

export default LegalDisclaimerPage;
