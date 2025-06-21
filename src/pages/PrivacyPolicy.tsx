import React from 'react';
import { Shield, Lock, Eye, Trash2, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: [
        "Account information when you sign up for TaskMind",
        "Meeting metadata (topic, date, duration) from connected platforms",
        "Meeting recordings and transcripts you choose to sync",
        "Usage data to improve our services",
        "Communication data when you contact our support team"
      ]
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      content: [
        "Provide and maintain our AI-powered task extraction services",
        "Analyze meeting content to generate actionable insights",
        "Send notifications about tasks and deadlines",
        "Improve our AI models and service quality",
        "Provide customer support and respond to inquiries"
      ]
    },
    {
      icon: Shield,
      title: "Data Security & Privacy",
      content: [
        "All data is encrypted in transit and at rest",
        "SOC2 compliant infrastructure and security practices",
        "Access controls and audit logging for all data access",
        "Regular security assessments and penetration testing",
        "Compliance with GDPR, CCPA, and other privacy regulations"
      ]
    },
    {
      icon: Trash2,
      title: "Your Rights & Control",
      content: [
        "Access, modify, or delete your personal data at any time",
        "Control which meetings are processed by our AI",
        "Export your data in standard formats",
        "Opt out of data processing for AI model improvement",
        "Request complete data deletion from our systems"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600">
              How we protect and handle your data
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: January 2025
            </p>
          </div>

          {/* Introduction */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
            <h2 className="text-2xl font-bold text-black mb-4">Our Commitment to Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              At TaskMind, we believe privacy is a fundamental right. We're committed to transparency about how we collect, 
              use, and protect your data. This policy explains our practices and your rights regarding your personal information.
            </p>
          </div>

          {/* Main Sections */}
          <div className="space-y-8 mb-12">
            {sections.map((section, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                    <section.icon size={24} className="text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-black">{section.title}</h3>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
            <h3 className="text-2xl font-bold text-black mb-4">Data Retention</h3>
            <p className="text-gray-600 mb-4">
              We retain your data only as long as necessary to provide our services. You can request deletion of your data at any time, 
              and we'll process your request within 30 days.
            </p>
            <h3 className="text-2xl font-bold text-black mb-4">Third-Party Services</h3>
            <p className="text-gray-600 mb-4">
              We use trusted third-party services for hosting, analytics, and customer support. All third-party providers are bound by 
              strict data protection agreements and privacy standards.
            </p>
            <h3 className="text-2xl font-bold text-black mb-4">Updates to This Policy</h3>
            <p className="text-gray-600">
              We may update this privacy policy from time to time. We'll notify you of any material changes via email or through our platform.
            </p>
          </div>

          {/* Contact Section */}
          <div className="bg-blue-50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-black mb-4">Questions About Privacy?</h3>
            <p className="text-gray-600 mb-6">
              We're here to help. Contact our privacy team with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:privacy@taskmind.dev" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
              >
                <Mail className="inline mr-2" size={20} />
                Contact Privacy Team
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

export default PrivacyPolicy;
