
import React from "react";

const Manifesto = () => (
  <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-8">
    <h1 className="text-3xl font-bold mb-6">Manifesto</h1>
    <div className="max-w-2xl text-lg text-gray-700 mb-10 space-y-8">
      <div>
        <span className="font-semibold text-blue-700">We believe every conversation can move you forward,</span> whether it's a daily standup or a customer call.
        <br />
        <span className="text-sm text-gray-500">
          <em>Example:</em> An ops leader reviews all weekly notes to continuously improve processes—TaskMind.ai arms them with discussion insights and to-dos.
        </span>
      </div>
      <div>
        <span className="font-semibold text-blue-700">AI augments, not replaces, human judgment.</span> Our tools help you act on meeting content, but your review and insights matter most.
        <br />
        <span className="text-sm text-gray-500">
          <em>Example:</em> A team reviews AI-proposed action items and chooses which matter most for this sprint.
        </span>
      </div>
      <div>
        <span className="font-semibold text-blue-700">Transparency, privacy, and user autonomy are non-negotiable.</span>
        <br />
        <span className="text-sm text-gray-500">
          <em>Example:</em> Users control which meetings are processed, and can delete all their data at any point.
        </span>
      </div>
      <div>
        <span className="font-semibold text-blue-700">Simple, delightful software enables deep work.</span>
        <br />
        <span className="text-sm text-gray-500">
          <em>Example:</em> TaskMind.ai fits naturally into existing workflows—helping teams and individuals focus on what matters.
        </span>
      </div>
    </div>
    <a href="/" className="inline-block bg-primary text-white px-6 py-3 rounded-lg shadow hover:bg-primary/90 transition">
      Back to Home
    </a>
  </div>
);

export default Manifesto;
