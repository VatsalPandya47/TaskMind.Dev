import React from "react";
import { Calendar, Brain, Bell, Users } from 'lucide-react';

const HowItWorks = () => {
  const features = [
    {
      icon: Calendar,
      title: "Meeting Integration",
      description: "Connects to Zoom, Teams, and Slack to automatically extract action items from meetings and conversations."
    },
    {
      icon: Brain,
      title: "AI Task Extraction",
      description: "Uses advanced AI to identify commitments, deadlines, and owners from meeting transcripts and messages."
    },
    {
      icon: Bell,
      title: "Proactive Nudges",
      description: "Sends smart reminders and notifications to keep teams accountable and on track with their commitments."
    },
    {
      icon: Users,
      title: "Team Dashboards",
      description: "Provides shared visibility into team tasks, progress, and bottlenecks for better collaboration."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
            How TaskMind Works
          </h1>
          <p className="text-xl text-gray-300">
            Turn meetings into action with AI-powered task automation that works with your existing tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-16">
          {features.map((feature, index) => (
            <div key={index} className="text-center group hover:scale-105 transition-transform duration-200">
              <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-all duration-300 border border-purple-500/30">
                <feature.icon size={32} className="text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <a href="/" className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
