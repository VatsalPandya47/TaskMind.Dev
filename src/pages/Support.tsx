import React from 'react';
import { MessageCircle, Mail, BookOpen, Users, Zap, Clock } from 'lucide-react';

const Support = () => {
  const supportChannels = [
    {
      icon: Mail,
      title: "Email Support 📧",
      description: "Get help from our support team within 24 hours",
      action: "support@taskmind.dev",
      link: "mailto:support@taskmind.dev",
      color: "blue"
    },
    {
      icon: MessageCircle,
      title: "Live Chat 💬",
      description: "Chat with our team during business hours",
      action: "Start Chat",
      link: "#",
      color: "green"
    },
    {
      icon: BookOpen,
      title: "Documentation 📚",
      description: "Browse our comprehensive guides and tutorials",
      action: "View Docs",
      link: "https://taskmind.dev/documentation",
      color: "purple"
    }
  ];

  const quickFixes = [
    {
      question: "How do I connect my Zoom account? 🎥",
      answer: "Go to Settings → Connect Your Tools and click 'Connect with Zoom.' Follow the authorization prompts to grant TaskMind access to your meetings.",
      icon: Zap
    },
    {
      question: "Why are no meetings showing up? 🤔",
      answer: "After connecting Zoom, click 'Sync Meetings' to fetch your recent meetings. Only meetings with cloud recordings will be available for processing.",
      icon: Clock
    },
    {
      question: "How accurate is the AI task extraction? 🧠",
      answer: "Our AI is trained on millions of meeting transcripts and continuously improves. You can always edit, add, or remove tasks manually.",
      icon: Users
    },
    {
      question: "Can I export my tasks to other tools? 🔄",
      answer: "Absolutely! TaskMind integrates with popular project management tools. Check our integrations page for the full list of supported platforms.",
      icon: Zap
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-500/20 text-blue-400 border-blue-400/30",
      green: "bg-green-500/20 text-green-400 border-green-400/30",
      purple: "bg-purple-500/20 text-purple-400 border-purple-400/30"
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
              Support Center 🆘
            </h1>
            <p className="text-xl text-gray-300">
              Get help with TaskMind and find answers to your questions
            </p>
          </div>

          {/* Support Channels */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {supportChannels.map((channel, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700/50 text-center hover:shadow-2xl transition-all duration-300">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border ${getColorClasses(channel.color)}`}>
                  <channel.icon size={32} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{channel.title}</h3>
                <p className="text-gray-300 mb-6">{channel.description}</p>
                <a 
                  href={channel.link}
                  className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {channel.action}
                </a>
              </div>
            ))}
          </div>

          {/* Quick Fixes */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Quick Fixes ⚡</h2>
            <div className="space-y-6">
              {quickFixes.map((fix, index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700/50 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border border-purple-500/30">
                      <fix.icon size={24} className="text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-3">{fix.question}</h3>
                      <p className="text-gray-300 leading-relaxed">{fix.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Resources */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Additional Resources 📚</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700/50 hover:shadow-2xl transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-4">Getting Started Guide 🚀</h3>
                <p className="text-gray-300 mb-4">
                  New to TaskMind? Follow our step-by-step guide to get up and running quickly.
                </p>
                <a href="https://taskmind.dev/documentation" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                  Read the Guide →
                </a>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700/50 hover:shadow-2xl transition-all duration-300">
                <h3 className="text-xl font-semibold text-white mb-4">Best Practices ⭐</h3>
                <p className="text-gray-300 mb-4">
                  Learn how to get the most out of TaskMind with our collection of best practices.
                </p>
                <a href="https://taskmind.dev/documentation" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                  View Best Practices →
                </a>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
              <h3 className="text-2xl font-bold text-white mb-4">Still Need Help? 🤝</h3>
              <p className="text-gray-300 mb-6">
                Our support team is here to help you succeed with TaskMind. We typically respond within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:support@taskmind.dev" 
                  className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Mail className="inline mr-2" size={20} />
                  Contact Support
                </a>
                <a 
                  href="/" 
                  className="inline-block bg-gray-600/50 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-600"
                >
                  Back to Dashboard 🏠
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
