
import React from 'react';

const TermsOfUse = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-6 lg:px-8 max-w-4xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Use</h1>
        <div className="text-gray-700 space-y-4">
          <p>Last updated: June 15, 2025</p>
          <p>
            Please read these Terms of Use ("Terms") carefully before using the TaskMind.dev website (the "Service") operated by TaskMind.dev ("us", "we", or "our").
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">2. Use of Service</h2>
          <p>
            You agree not to use the service for any illegal or unauthorized purpose. You are responsible for all your activity in connection with the Service.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">3. Termination</h2>
          <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
