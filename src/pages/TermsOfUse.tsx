import React from 'react';
import { FileText, Shield, Users, AlertTriangle, Mail } from 'lucide-react';

const TermsOfUse = () => {
  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      content: [
        "By accessing or using TaskMind, you agree to be bound by these Terms of Use",
        "If you disagree with any part of these terms, you may not use our service",
        "These terms apply to all users of the service, including team members and administrators",
        "We may update these terms from time to time with notice to users"
      ]
    },
    {
      icon: Users,
      title: "Use of Service",
      content: [
        "TaskMind is designed for legitimate business and productivity purposes",
        "You are responsible for all activity that occurs under your account",
        "You must not use the service for any illegal or unauthorized purpose",
        "You agree to provide accurate and complete information when creating your account",
        "You are responsible for maintaining the security of your account credentials"
      ]
    },
    {
      icon: Shield,
      title: "Data & Privacy",
      content: [
        "You retain ownership of all content and data you upload to TaskMind",
        "We process your data in accordance with our Privacy Policy",
        "You are responsible for ensuring you have permission to share meeting data",
        "We implement security measures to protect your data, but cannot guarantee absolute security",
        "You can export and delete your data at any time through your account settings"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Limitations & Disclaimers",
      content: [
        "TaskMind is provided 'as is' without warranties of any kind",
        "We are not responsible for the accuracy of AI-generated task extractions",
        "We do not guarantee uninterrupted or error-free service",
        "Our liability is limited to the amount you paid for the service in the past 12 months",
        "We are not responsible for any decisions made based on our AI insights"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
              Terms of Use
            </h1>
            <p className="text-xl text-gray-300">
              The rules and guidelines for using TaskMind
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Last updated: January 2025
            </p>
          </div>

          {/* Introduction */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700/50 mb-12 hover:shadow-2xl transition-all duration-300">
            <h2 className="text-2xl font-bold text-white mb-4">Agreement to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              These Terms of Use ("Terms") govern your use of TaskMind and its services. By accessing or using TaskMind, 
              you agree to be bound by these terms. If you're using TaskMind on behalf of an organization, you represent 
              that you have the authority to bind that organization to these terms.
            </p>
          </div>

          {/* Main Sections */}
          <div className="space-y-8 mb-12">
            {sections.map((section, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700/50 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border border-purple-500/30">
                    <section.icon size={24} className="text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{section.title}</h3>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Additional Terms */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700/50 mb-12 hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-4">Subscription & Billing</h3>
            <p className="text-gray-300 mb-4">
              TaskMind offers both free and paid subscription plans. Paid subscriptions are billed in advance on a recurring basis. 
              You can cancel your subscription at any time through your account settings.
            </p>
            
            <h3 className="text-2xl font-bold text-white mb-4">Intellectual Property</h3>
            <p className="text-gray-300 mb-4">
              TaskMind and its original content, features, and functionality are owned by TaskMind and are protected by international 
              copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            
            <h3 className="text-2xl font-bold text-white mb-4">Termination</h3>
            <p className="text-gray-300 mb-4">
              We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these 
              Terms or is harmful to other users, us, or third parties. Upon termination, your right to use the service will cease immediately.
            </p>
            
            <h3 className="text-2xl font-bold text-white mb-4">Governing Law</h3>
            <p className="text-gray-300">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which TaskMind operates, 
              without regard to its conflict of law provisions.
            </p>
          </div>

          {/* Contact Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-700/50">
            <h3 className="text-2xl font-bold text-white mb-4">Questions About These Terms?</h3>
            <p className="text-gray-300 mb-6">
              If you have any questions about these Terms of Use, please contact our legal team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:legal@taskmind.dev" 
                className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Mail className="inline mr-2" size={20} />
                Contact Legal Team
              </a>
              <a 
                href="/" 
                className="inline-block bg-gray-600/50 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-600"
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

export default TermsOfUse;
