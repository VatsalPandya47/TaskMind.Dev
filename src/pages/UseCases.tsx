
import React from "react";

const UseCases = () => (
  <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-8">
    <h1 className="text-3xl font-bold mb-6">Use Cases</h1>
    <div className="max-w-2xl text-lg text-gray-700 mb-10 text-left space-y-6">
      <div>
        <span className="font-semibold text-blue-700">🌟 Team Project Meetings:</span>
        <div>
          <span className="text-sm text-gray-500">
            <em>Example:</em> During weekly sprints, TaskMind.ai captures all engineering team deliverables and deadlines, reducing missed handoffs.
          </span>
        </div>
      </div>
      <div>
        <span className="font-semibold text-blue-700">🌟 Client Calls:</span>
        <div>
          <span className="text-sm text-gray-500">
            <em>Example:</em> After a sales demo, action items like "Send proposal draft" and "Follow up on technical questions" are extracted for your CRM automatically.
          </span>
        </div>
      </div>
      <div>
        <span className="font-semibold text-blue-700">🌟 Education and Study Groups:</span>
        <div>
          <span className="text-sm text-gray-500">
            <em>Example:</em> Students in a remote study group extract assignments and shared reading goals from recorded Zoom sessions.
          </span>
        </div>
      </div>
      <div>
        <span className="font-semibold text-blue-700">🌟 Freelancers & Consultants:</span>
        <div>
          <span className="text-sm text-gray-500">
            <em>Example:</em> A copywriter records a strategy call with a client, then lets TaskMind.ai pull out content deadlines and feedback requests for easy project tracking.
          </span>
        </div>
      </div>
      <div>
        <span className="font-semibold text-blue-700">🌟 Personal Productivity:</span>
        <div>
          <span className="text-sm text-gray-500">
            <em>Example:</em> Record your own verbal brainstorm, extract a personal action list, and track completion—all without manual notes.
          </span>
        </div>
      </div>
    </div>
    <a href="/" className="inline-block bg-primary text-white px-6 py-3 rounded-lg shadow hover:bg-primary/90 transition">
      Back to Home
    </a>
  </div>
);

export default UseCases;
