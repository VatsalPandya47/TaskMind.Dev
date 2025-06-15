
import React from "react";

const Help = () => (
  <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-8">
    <h1 className="text-3xl font-bold mb-6">Help</h1>
    <p className="max-w-xl text-lg text-gray-700 mb-10 text-center">
      Find guides and answers to your questions about using TaskMind.ai. We're here to help you succeed!
    </p>
    <a href="/" className="inline-block bg-primary text-white px-6 py-3 rounded-lg shadow hover:bg-primary/90 transition">
      Back to Home
    </a>
  </div>
);

export default Help;
