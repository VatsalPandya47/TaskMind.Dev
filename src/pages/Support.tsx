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
      link: "/documentation",
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
      blue: "bg-blue-50 text-blue-600",
      green: "bg-green-50 text-green-600",
      purple: "bg-purple-50 text-purple-600"
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Support Center 🆘
            </h1>
            <p className="text-xl text-gray-600">
              Get help with TaskMind and find answers to your questions
            </p>
          </div>

          {/* Support Channels */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {supportChannels.map((channel, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${getColorClasses(channel.color)}`}>
                  <channel.icon size={32} />
                </div>
                <h3 className="text-xl font-semibold text-black mb-3">{channel.title}</h3>
                <p className="text-gray-600 mb-6">{channel.description}</p>
                <a 
                  href={channel.link}
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
                >
                  {channel.action}
                </a>
              </div>
            ))}
          </div>

          {/* Quick Fixes */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-black text-center mb-12">Quick Fixes ⚡</h2>
            <div className="space-y-6">
              {quickFixes.map((fix, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                      <fix.icon size={24} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-black mb-3">{fix.question}</h3>
                      <p className="text-gray-600 leading-relaxed">{fix.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Resources */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-black text-center mb-12">Additional Resources 📚</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-semibold text-black mb-4">Getting Started Guide 🚀</h3>
                <p className="text-gray-600 mb-4">
                  New to TaskMind? Follow our step-by-step guide to get up and running quickly.
                </p>
                <a href="/documentation" className="text-blue-600 hover:underline font-medium">
                  Read the Guide →
                </a>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-semibold text-black mb-4">Best Practices ⭐</h3>
                <p className="text-gray-600 mb-4">
                  Learn how to get the most out of TaskMind with our collection of best practices.
                </p>
                <a href="/documentation" className="text-blue-600 hover:underline font-medium">
                  View Best Practices →
                </a>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-blue-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-black mb-4">Still Need Help? 🤝</h3>
              <p className="text-gray-600 mb-6">
                Our support team is here to help you succeed with TaskMind. We typically respond within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:support@taskmind.dev" 
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
                >
                  <Mail className="inline mr-2" size={20} />
                  Contact Support
                </a>
                <a 
                  href="/" 
                  className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg shadow hover:bg-gray-700 transition"
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
