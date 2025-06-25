import React from "react";
import { HelpCircle, Shield, Zap, Users, Mail } from 'lucide-react';

const Help = () => {
  const faqs = [
    {
      question: "How do I connect TaskMind with Zoom? 🎥",
      answer: "Go to Settings → Connect Your Tools and click 'Connect with Zoom.' Grant permissions as prompted. All future recorded meetings will sync automatically for action extraction.",
      icon: Zap
    },
    {
      question: "What if the AI misses an action item? 🤔",
      answer: "You can edit, add, or assign action items manually. The system gets smarter over time as you provide corrections and feedback.",
      icon: HelpCircle
    },
    {
      question: "Is my meeting data secure? 🔒",
      answer: "Yes! All meetings and extracted tasks are encrypted in transit and at rest, with SOC2 compliance and enterprise-grade security.",
      icon: Shield
    },
    {
      question: "How does the reminder system work? ⏰",
      answer: "TaskMind sends smart notifications about upcoming deadlines and overdue commitments via email and Slack integrations.",
      icon: Users
    },
    {
      question: "Can I export my tasks to other tools? 🔄",
      answer: "Absolutely! TaskMind integrates with popular project management tools. Check our integrations page for the full list of supported platforms.",
      icon: Zap
    },
    {
      question: "Where can I get additional support? 📧",
      answer: "Contact our support team at support@taskmind.dev or visit our documentation for detailed guides and tutorials.",
      icon: Mail
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Need a Hand? 🤝
          </h1>
          <p className="text-xl text-gray-600">
            Get answers to common questions and find the help you need to supercharge your productivity.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                    <faq.icon size={24} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-black mb-3">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center mt-16">
          <div className="bg-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-black mb-4">Still need help? 🆘</h3>
            <p className="text-gray-600 mb-6">
              Our support team is here to help you get the most out of TaskMind and boost your productivity!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@taskmind.dev" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
              >
                Contact Support 📧
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
  );
};

export default Help;
