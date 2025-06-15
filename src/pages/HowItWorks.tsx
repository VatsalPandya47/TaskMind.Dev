
import React from "react";

const HowItWorks = () => (
  <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-8">
    <h1 className="text-3xl font-bold mb-6">How It Works</h1>
    <ol className="max-w-2xl text-lg text-gray-700 mb-10 text-left space-y-6">
      <li>
        <span className="font-bold text-blue-700">1. Record Your Meeting: </span>
        Integrate TaskMind.ai with popular platforms like Zoom or upload your meeting recordings.
        <br />
        <span className="text-sm text-gray-500">
          <em>Example:</em> Sarah, an engineering manager, connects TaskMind.ai to her weekly team sync on Zoom.
        </span>
      </li>
      <li>
        <span className="font-bold text-blue-700">2. AI Extraction of Action Items: </span>
        Our advanced AI listens to your meeting, identifies all spoken tasks, and turns them into actionable to-dos.
        <br />
        <span className="text-sm text-gray-500">
          <em>Example:</em> The AI detects “John will prepare the project timeline by Friday” and creates a task assigned to John with the correct due date.
        </span>
      </li>
      <li>
        <span className="font-bold text-blue-700">3. Easy Task Management: </span>
        All extracted tasks are neatly organized in your dashboard for review, assignment, and tracking.
        <br />
        <span className="text-sm text-gray-500">
          <em>Example:</em> The team reviews and updates extracted tasks, confirming ownership, and adding priorities as needed.
        </span>
      </li>
      <li>
        <span className="font-bold text-blue-700">4. Seamless Collaboration: </span>
        You can edit, comment, assign, or mark tasks as done—just like in your favorite project management app.
        <br />
        <span className="text-sm text-gray-500">
          <em>Example:</em> After a marketing sync, AI-extracted tasks like “Review ad copy” and “Schedule social posts” are discussed and assigned during the call.
        </span>
      </li>
    </ol>
    <a href="/" className="inline-block bg-primary text-white px-6 py-3 rounded-lg shadow hover:bg-primary/90 transition">
      Back to Home
    </a>
  </div>
);

export default HowItWorks;
