import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Lock, Eye, Database } from 'lucide-react';

const Privacy = () => {
  const principles = [
    {
      icon: Shield,
      title: "Data Protection",
      description: "Your data is encrypted in transit and at rest using industry-standard AES-256 encryption."
    },
    {
      icon: Lock,
      title: "Access Control",
      description: "Strict access controls ensure only authorized personnel can access your information."
    },
    {
      icon: Eye,
      title: "Transparency",
      description: "We clearly explain what data we collect, why we collect it, and how we use it."
    },
    {
      icon: Database,
      title: "Data Minimization",
      description: "We only collect data that's necessary to provide and improve our services."
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Your privacy is fundamental to how we build our products. This policy explains how we collect, 
              use, and protect your information.
            </p>
            <p className="text-sm text-gray-400">
              Last updated: June 16, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Principles */}
      <section className="py-16 bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Privacy Principles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {principles.map((principle, index) => (
                <div key={index} className="text-center">
                  <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
                    <principle.icon size={32} className="text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{principle.title}</h3>
                  <p className="text-gray-300">{principle.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl border border-gray-700/50">
              <div className="prose prose-lg max-w-none">
                
                <h2 className="text-2xl font-bold text-white mb-6">1. Information We Collect</h2>
                <h3 className="text-xl font-semibold text-white mb-4">Account Information</h3>
                <p className="text-gray-300 mb-6">
                  When you create an account, we collect your name, email address, and company information. 
                  This helps us provide personalized service and communicate with you about your account.
                </p>
                
                <h3 className="text-xl font-semibold text-white mb-4">Meeting Data</h3>
                <p className="text-gray-300 mb-6">
                  With your explicit consent, TaskMind processes meeting transcripts and audio to extract 
                  action items. We only process meetings you specifically authorize, and this data is used 
                  solely to provide our task extraction services.
                </p>
                
                <h3 className="text-xl font-semibold text-white mb-4">Usage Information</h3>
                <p className="text-gray-300 mb-8">
                  We collect information about how you use our service, including feature usage, 
                  performance metrics, and error logs. This helps us improve our product and fix issues.
                </p>

                <h2 className="text-2xl font-bold text-white mb-6">2. How We Use Your Information</h2>
                <ul className="list-disc list-inside text-gray-300 mb-8 space-y-2">
                  <li>Provide and maintain our AI-powered task extraction services</li>
                  <li>Process meeting transcripts to identify action items and commitments</li>
                  <li>Send notifications and reminders about tasks and deadlines</li>
                  <li>Improve our AI models and service quality</li>
                  <li>Provide customer support and respond to your inquiries</li>
                  <li>Ensure security and prevent fraudulent activity</li>
                </ul>

                <h2 className="text-2xl font-bold text-white mb-6">3. Data Security</h2>
                <p className="text-gray-300 mb-6">
                  We implement industry-standard security measures to protect your data:
                </p>
                <ul className="list-disc list-inside text-gray-300 mb-8 space-y-2">
                  <li>All data is encrypted in transit using TLS 1.3</li>
                  <li>Data at rest is encrypted using AES-256 encryption</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>SOC 2 Type II compliance (coming Q2 2025)</li>
                  <li>Role-based access controls for our team</li>
                </ul>

                <h2 className="text-2xl font-bold text-white mb-6">4. Data Sharing</h2>
                <p className="text-gray-300 mb-6">
                  We do not sell, rent, or trade your personal information. We may share your data only in these limited circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-300 mb-8 space-y-2">
                  <li>With your explicit consent</li>
                  <li>With trusted service providers who help us operate our service</li>
                  <li>When required by law or to protect our legal rights</li>
                  <li>In connection with a business transfer (with advance notice)</li>
                </ul>

                <h2 className="text-2xl font-bold text-white mb-6">5. Your Rights</h2>
                <p className="text-gray-300 mb-6">
                  You have the following rights regarding your personal data:
                </p>
                <ul className="list-disc list-inside text-gray-300 mb-8 space-y-2">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                  <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                  <li><strong>Objection:</strong> Object to certain types of processing</li>
                </ul>

                <h2 className="text-2xl font-bold text-white mb-6">6. Data Retention</h2>
                <p className="text-gray-300 mb-8">
                  We retain your data only as long as necessary to provide our services or as required by law. 
                  Meeting transcripts are automatically deleted after 12 months unless you explicitly request 
                  longer retention for your organization.
                </p>

                <h2 className="text-2xl font-bold text-white mb-6">7. International Transfers</h2>
                <p className="text-gray-300 mb-8">
                  Your data may be processed in countries other than your own. We ensure appropriate 
                  safeguards are in place, including Standard Contractual Clauses approved by the 
                  European Commission.
                </p>

                <h2 className="text-2xl font-bold text-white mb-6">8. Contact Us</h2>
                <p className="text-gray-300 mb-4">
                  If you have questions about this privacy policy or want to exercise your rights, contact us at:
                </p>
                <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600/50">
                  <p className="text-gray-300 mb-2"><strong>Email:</strong> support@taskmind.dev</p>
                  <p className="text-gray-300 mb-2"><strong>Address:</strong> TaskMind LLC 1341 n 9th St Lincoln NE 68508</p>
                  <p className="text-gray-300"><strong>Data Protection Officer:</strong> dpo@taskmind.ai</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Privacy;
