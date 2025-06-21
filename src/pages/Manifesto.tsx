import React from "react";
import { Target, Users, Shield, Zap, Heart, Lightbulb } from 'lucide-react';

const Manifesto = () => {
  const principles = [
    {
      icon: Target,
      title: "Every Meeting Matters",
      description: "We believe every conversation can move you forward, whether it's a daily standup or a customer call. No more lost insights or forgotten commitments.",
      color: "blue"
    },
    {
      icon: Users,
      title: "AI Augments Human Judgment",
      description: "Our tools help you act on meeting content, but your review and insights matter most. We're here to amplify your team's intelligence, not replace it.",
      color: "green"
    },
    {
      icon: Shield,
      title: "Privacy & Transparency First",
      description: "Transparency, privacy, and user autonomy are non-negotiable. You control which meetings are processed and can delete your data at any time.",
      color: "purple"
    },
    {
      icon: Zap,
      title: "Simple Enables Deep Work",
      description: "Simple, delightful software enables deep work. TaskMind fits naturally into existing workflows—helping teams focus on what matters most.",
      color: "orange"
    },
    {
      icon: Heart,
      title: "Teams Deserve Better",
      description: "Too many great ideas and commitments get lost in meeting notes. We're building the AI Chief of Staff that every team needs to stay organized and accountable.",
      color: "red"
    },
    {
      icon: Lightbulb,
      title: "Continuous Learning",
      description: "We learn from every interaction to make our AI smarter and more helpful. Your feedback shapes the future of productivity software.",
      color: "indigo"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600",
      green: "bg-green-50 text-green-600", 
      purple: "bg-purple-50 text-purple-600",
      orange: "bg-orange-50 text-orange-600",
      red: "bg-red-50 text-red-600",
      indigo: "bg-indigo-50 text-indigo-600"
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Our Manifesto
          </h1>
          <p className="text-xl text-gray-600">
            The principles that guide us as we build the future of AI-powered productivity.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-black mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              We're building the AI Chief of Staff that every team needs. Our platform automatically extracts action items from meetings, 
              tracks commitments, and ensures nothing falls through the cracks. We're helping teams work smarter, not harder.
            </p>
          </div>
        </div>

        {/* Principles */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-black text-center mb-12">Our Principles</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {principles.map((principle, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getColorClasses(principle.color)}`}>
                    <principle.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-black mb-3">{principle.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{principle.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-black mb-4">Join Us in This Mission</h3>
            <p className="text-gray-600 mb-6">
              We're just getting started. Help us build a world where no great idea gets lost and every team can focus on what matters most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/" 
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg shadow hover:bg-blue-700 transition"
              >
                Get Started
              </a>
              <a 
                href="/careers" 
                className="inline-block bg-gray-600 text-white px-8 py-3 rounded-lg shadow hover:bg-gray-700 transition"
              >
                Join Our Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manifesto;
