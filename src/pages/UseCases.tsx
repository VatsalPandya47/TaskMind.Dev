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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
            Use Cases
          </h1>
          <p className="text-xl text-gray-300">
            Discover how TaskMind adapts to different team workflows and scenarios.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {useCases.map((useCase, index) => (
            <div key={index} className={`flex flex-col lg:flex-row items-center gap-12 mb-20 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="lg:w-1/2">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700/50 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{useCase.icon}</span>
                    <span className="text-sm font-medium text-purple-400 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-400/30">
                      {useCase.category}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">{useCase.title}</h3>
                  <p className="text-lg text-gray-300 leading-relaxed">{useCase.description}</p>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="relative">
                  <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-8 h-64 flex items-center justify-center border border-purple-500/30">
                    <div className="text-center">
                      <div className="text-6xl mb-4">{useCase.icon}</div>
                      <h4 className="text-xl font-semibold text-white">{useCase.title}</h4>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-purple-600/10 rounded-2xl"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center mt-16">
          <a href="/" className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default UseCases;
