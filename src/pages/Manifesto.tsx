
import React from "react";

const Manifesto = () => (
  <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-8">
    <h1 className="text-3xl font-bold mb-6">Manifesto</h1>
    <p className="max-w-xl text-lg text-gray-700 mb-10 text-center">
      Our guiding principles shape every product and decision at TaskMind.ai. Read our manifesto to understand why we build what we build.
    </p>
    <a href="/" className="inline-block bg-primary text-white px-6 py-3 rounded-lg shadow hover:bg-primary/90 transition">
      Back to Home
    </a>
  </div>
);

export default Manifesto;
