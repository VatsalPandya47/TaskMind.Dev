import React from "react";
import { Users, Zap, Globe, Heart, Mail, Coffee, Pizza, Brain } from 'lucide-react';

const Careers = () => {
  const benefits = [
    {
      icon: Globe,
      title: "Remote-First",
      description: "Work from anywhere with flexible hours and async collaboration."
    },
    {
      icon: Zap,
      title: "Fast Growth",
      description: "Join a rapidly growing startup with opportunities to make a big impact."
    },
    {
      icon: Users,
      title: "Great Team",
      description: "Work with passionate people building the future of productivity."
    },
    {
      icon: Heart,
      title: "Mission-Driven",
      description: "Help teams work smarter and never miss important commitments."
    }
  ];

  const teamQualities = [
    {
      title: "Meeting Whisperer",
      type: "Essential Skill",
      description: "Someone who can listen to a 2-hour meeting and actually remember what was said. Bonus points if you can extract action items from 'we should probably do something about that.'",
      icon: Brain
    },
    {
      title: "Task Completion Enthusiast",
      type: "Core Value", 
      description: "You get genuine satisfaction from checking off to-do lists. The sight of an empty inbox brings you joy. You're the person who actually follows up on 'I'll get back to you on that.'",
      icon: Zap
    },
    {
      title: "Coffee-to-Code Translator",
      type: "Required",
      description: "Can convert caffeine into clean code. Understands that the best ideas come at 3 AM when you're debugging why the AI thinks 'send the thing' means 'deploy to production.'",
      icon: Coffee
    },
    {
      title: "Pizza Meeting Survivor",
      type: "Life Experience",
      description: "Has survived at least one 'quick meeting' that turned into a 4-hour pizza-fueled brainstorming session. Knows that 'this will only take 5 minutes' is a lie.",
      icon: Pizza
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-600">
            Help us build the future of AI-powered productivity and make meetings actually useful.
          </p>
        </div>

        {/* Mission Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-black mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We're building the AI Chief of Staff that every team needs. Our platform automatically extracts action items from meetings, 
              tracks commitments, and ensures nothing falls through the cracks. We're helping teams work smarter, not harder.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-black text-center mb-12">Why Join TaskMind?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon size={24} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-black mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Qualities Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-black text-center mb-12">What We're Looking For</h2>
          <p className="text-center text-gray-600 mb-8">
            We're not your typical startup. We're looking for people who understand the pain of forgotten action items and the joy of actually completing tasks.
          </p>
          <div className="space-y-6">
            {teamQualities.map((quality, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <quality.icon size={24} className="text-blue-600" />
                      <h3 className="text-xl font-semibold text-black">{quality.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-3">{quality.description}</p>
                    <div className="flex gap-4">
                      <span className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                        {quality.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-black mb-4">Sound Like You?</h3>
            <p className="text-gray-600 mb-6">
              If you're tired of meetings that go nowhere and want to build something that actually helps people get stuff done, we want to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:careers@taskmind.dev" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
              >
                <Mail className="inline mr-2" size={20} />
                Send Us Your Story
              </a>
              <a 
                href="/" 
                className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg shadow hover:bg-gray-700 transition"
              >
                Back to Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;
