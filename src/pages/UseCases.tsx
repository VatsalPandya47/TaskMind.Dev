import React, { useState } from 'react';

const UseCases = () => {
  const [activeUseCase, setActiveUseCase] = useState(0);

  const useCases = [
    {
      title: "Meeting Action Items",
      description: "Automatically extract tasks, owners, and deadlines from Zoom, Teams, and Slack conversations. Never miss a commitment again.",
      category: "Task Extraction",
      icon: "📋"
    },
    {
      title: "Smart Reminders",
      description: "Get proactive nudges about upcoming deadlines and overdue commitments via email and Slack. Keep your team accountable.",
      category: "Notifications",
      icon: "⏰"
    },
    {
      title: "Team Analytics",
      description: "Track task completion rates, identify bottlenecks, and measure team productivity over time with detailed insights.",
      category: "Analytics",
      icon: "📊"
    },
    {
      title: "Auto Subtasks",
      description: "AI breaks down complex projects into manageable subtasks with suggested timelines and dependencies.",
      category: "Project Management",
      icon: "🎯"
    },
    {
      title: "Daily Standups",
      description: "Automated daily digest showing what's due today and what needs attention. Perfect for remote and hybrid teams.",
      category: "Team Coordination",
      icon: "👥"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Use Cases
          </h1>
          <p className="text-xl text-gray-600">
            Discover how TaskMind adapts to different team workflows and scenarios.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {useCases.map((useCase, index) => (
            <div key={index} className={`flex flex-col lg:flex-row items-center gap-12 mb-20 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="lg:w-1/2">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{useCase.icon}</span>
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {useCase.category}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-black mb-4">{useCase.title}</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">{useCase.description}</p>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">{useCase.icon}</div>
                      <h4 className="text-xl font-semibold text-gray-800">{useCase.title}</h4>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-blue-600/5 rounded-2xl"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center mt-16">
          <a href="/" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg shadow hover:bg-blue-700 transition">
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default UseCases;
