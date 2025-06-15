
import React from "react";

const Careers = () => (
  <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-8">
    <h1 className="text-3xl font-bold mb-6">Careers at TaskMind.ai</h1>
    <div className="max-w-2xl text-lg text-gray-700 mb-10 space-y-6">
      <div>
        <strong className="text-blue-700">Our Mission:</strong> Help teams work smarter by unlocking insights from every meeting.
      </div>
      <div>
        <strong className="text-blue-700">Who We're Looking For:</strong>
        <ul className="list-disc ml-5 space-y-1 text-base">
          <li>AI/ML Engineers passionate about NLP and real-world impact.</li>
          <li>Frontend Developers with a focus on beautiful, accessible UX.</li>
          <li>Product Managers eager to shape the future of productivity software.</li>
          <li>Success and Support teammates who love empowering our customers.</li>
        </ul>
      </div>
      <div>
        <strong className="text-blue-700">Real-Life Example:</strong>
        <p className="text-gray-500 text-sm mt-1">
          <em>Example:</em> Ravi, a recent hire, launched our meeting transcript analysis feature after collaborating with users on early prototypes.
        </p>
      </div>
      <div>
        <strong className="text-blue-700">Why Join Us?</strong>
        <ul className="list-disc ml-5 space-y-1 text-base">
          <li>Remote-first, flexible working practices</li>
          <li>Growth opportunities from day one</li>
          <li>Direct user impact—see your code shape real-world workflows!</li>
        </ul>
      </div>
      <div>
        <strong className="text-blue-700">Ready?</strong> View open roles or send your CV to <a href="mailto:careers@taskmind.ai" className="underline text-blue-700">careers@taskmind.ai</a>
      </div>
    </div>
    <a href="/" className="inline-block bg-primary text-white px-6 py-3 rounded-lg shadow hover:bg-primary/90 transition">
      Back to Home
    </a>
  </div>
);

export default Careers;
