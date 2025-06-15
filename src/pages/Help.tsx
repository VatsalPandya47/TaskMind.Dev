
import React from "react";

const Help = () => (
  <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-8">
    <h1 className="text-3xl font-bold mb-6">Help & FAQ</h1>
    <div className="max-w-2xl text-lg mb-10 space-y-8">
      <div>
        <strong className="text-blue-700">How do I connect TaskMind.ai with Zoom?</strong>
        <p className="text-gray-700 text-base mt-2">
          Go to Settings &rarr; Integrations and click “Connect with Zoom.” Grant permissions as prompted.
        </p>
        <p className="text-gray-500 text-sm mt-1">
          <em>Example:</em> Jane connects her Zoom account, so all future recorded meetings sync automatically for action extraction.
        </p>
      </div>
      <div>
        <strong className="text-blue-700">What if the AI misses an action item?</strong>
        <p className="text-gray-700 text-base mt-2">
          You can edit, add, or assign action items manually. The system gets smarter over time as you provide corrections!
        </p>
        <p className="text-gray-500 text-sm mt-1">
          <em>Example:</em> After review, Mike adds a missed “Order hardware” task, ensuring nothing falls through.
        </p>
      </div>
      <div>
        <strong className="text-blue-700">Is my data secure?</strong>
        <p className="text-gray-700 text-base mt-2">
          Yes. All meetings and extracted tasks are encrypted in transit and at rest, with best-in-class cloud hosting.
        </p>
      </div>
      <div>
        <strong className="text-blue-700">Where do I get more help?</strong>
        <p className="text-gray-700 text-base mt-2">
          Visit our <a href="/documentation" className="underline">documentation</a> or <a href="/support" className="underline">contact support</a>.
        </p>
      </div>
    </div>
    <a href="/" className="inline-block bg-primary text-white px-6 py-3 rounded-lg shadow hover:bg-primary/90 transition">
      Back to Home
    </a>
  </div>
);

export default Help;
