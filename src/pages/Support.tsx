
import React from 'react';

const Support = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-6 lg:px-8 max-w-4xl bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Support</h1>
        <div className="text-gray-700 space-y-4">
          <p>
            Welcome to the TaskMind.dev support page. We're here to help you get the most out of our service.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">Frequently Asked Questions</h2>
          <p>
            <strong>How do I connect my Zoom account?</strong><br />
            Simply click the "Connect Zoom" button on the main page and follow the authorization prompts.
          </p>
           <p>
            <strong>Why are no meetings showing up?</strong><br />
            After connecting, you need to click "Sync Meetings" to fetch your recent Zoom meetings. Note that only meetings with cloud recordings will be shown.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">Contact Us</h2>
          <p>
            If you can't find the answer you're looking for, please don't hesitate to reach out to our support team at <a href="mailto:support@taskmind.dev" className="text-blue-600 hover:underline">support@taskmind.dev</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Support;
