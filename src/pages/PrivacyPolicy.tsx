
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-6 lg:px-8 max-w-4xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <div className="text-gray-700 space-y-4">
          <p>Last updated: June 15, 2025</p>
          <p>
            Welcome to TaskMind.dev. We respect your privacy and are committed to protecting it through our compliance with this policy.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">1. Information We Collect</h2>
          <p>
            We collect information from you when you connect your Zoom account, including:
          </p>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li>Your Zoom user information.</li>
            <li>Meeting metadata (topic, date, duration).</li>
            <li>Cloud recording and transcript files for meetings you choose to sync.</li>
          </ul>
          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li>Provide, operate, and maintain our services.</li>
            <li>Analyze meeting transcripts to generate tasks and insights.</li>
            <li>Improve and personalize our services.</li>
          </ul>
          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">3. Data Security</h2>
          <p>We implement a variety of security measures to maintain the safety of your personal information. Your data is stored in a secure environment and access is restricted.</p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">4. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at support@taskmind.dev.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
