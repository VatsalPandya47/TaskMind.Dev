
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText, Scale, Users, Shield } from 'lucide-react';

const Terms = () => {
  const highlights = [
    {
      icon: FileText,
      title: "Service Terms",
      description: "Clear guidelines on how to use TaskMind's AI-powered productivity platform."
    },
    {
      icon: Scale,
      title: "Fair Usage",
      description: "Reasonable limits and expectations for using our meeting intelligence features."
    },
    {
      icon: Users,
      title: "User Responsibilities",
      description: "Your obligations when using TaskMind in your organization."
    },
    {
      icon: Shield,
      title: "Data Protection",
      description: "How we handle your meeting data and protect your privacy."
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              These terms govern your use of TaskMind's AI-powered task automation platform. 
              Please read them carefully.
            </p>
            <p className="text-sm text-gray-500">
              Last updated: June 16, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Key Points */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-black mb-12 text-center">Key Points</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {highlights.map((highlight, index) => (
                <div key={index} className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <highlight.icon size={32} className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-4">{highlight.title}</h3>
                  <p className="text-gray-600">{highlight.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
              <div className="prose prose-lg max-w-none">
                
                <h2 className="text-2xl font-bold text-black mb-6">1. Acceptance of Terms</h2>
                <p className="text-gray-600 mb-8">
                  By accessing or using TaskMind's services, you agree to be bound by these Terms of Service 
                  and our Privacy Policy. If you disagree with any part of these terms, you may not access 
                  the service.
                </p>

                <h2 className="text-2xl font-bold text-black mb-6">2. Service Description</h2>
                <p className="text-gray-600 mb-6">
                  TaskMind provides AI-powered task automation and productivity services, including:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-8 space-y-2">
                  <li>Automated extraction of action items from meeting transcripts</li>
                  <li>Integration with video conferencing platforms (Zoom, Teams, etc.)</li>
                  <li>Task tracking and reminder notifications</li>
                  <li>Team collaboration and accountability features</li>
                  <li>Analytics and productivity insights</li>
                </ul>

                <h2 className="text-2xl font-bold text-black mb-6">3. User Accounts</h2>
                <h3 className="text-xl font-semibold text-black mb-4">Account Creation</h3>
                <p className="text-gray-600 mb-6">
                  You must create an account to use our services. You agree to provide accurate, current, 
                  and complete information and to update this information as necessary.
                </p>
                
                <h3 className="text-xl font-semibold text-black mb-4">Account Security</h3>
                <p className="text-gray-600 mb-8">
                  You are responsible for maintaining the confidentiality of your account credentials and 
                  for all activities that occur under your account.
                </p>

                <h2 className="text-2xl font-bold text-black mb-6">4. Acceptable Use</h2>
                <p className="text-gray-600 mb-6">
                  You agree to use TaskMind only for lawful purposes and in accordance with these Terms. 
                  You agree NOT to:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-8 space-y-2">
                  <li>Use the service for any unlawful purpose or in violation of any applicable laws</li>
                  <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                  <li>Interfere with or disrupt the service or servers connected to the service</li>
                  <li>Upload or transmit malicious code, viruses, or other harmful content</li>
                  <li>Use automated means to access the service except through our provided APIs</li>
                  <li>Process meetings without proper consent from all participants</li>
                </ul>

                <h2 className="text-2xl font-bold text-black mb-6">5. Meeting Data and Consent</h2>
                <p className="text-gray-600 mb-6">
                  When using TaskMind's meeting intelligence features:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-8 space-y-2">
                  <li>You must obtain proper consent from all meeting participants before recording or processing</li>
                  <li>You are responsible for complying with applicable recording and privacy laws</li>
                  <li>We recommend informing participants about TaskMind's presence in meetings</li>
                  <li>You must respect participants' requests to exclude their data from processing</li>
                </ul>

                <h2 className="text-2xl font-bold text-black mb-6">6. Subscription and Billing</h2>
                <h3 className="text-xl font-semibold text-black mb-4">Subscription Plans</h3>
                <p className="text-gray-600 mb-6">
                  TaskMind offers various subscription plans with different features and usage limits. 
                  Subscription fees are billed in advance on a monthly or annual basis.
                </p>
                
                <h3 className="text-xl font-semibold text-black mb-4">Cancellation</h3>
                <p className="text-gray-600 mb-8">
                  You may cancel your subscription at any time. Cancellation will take effect at the end 
                  of your current billing period. No refunds are provided for partial months.
                </p>

                <h2 className="text-2xl font-bold text-black mb-6">7. Intellectual Property</h2>
                <p className="text-gray-600 mb-6">
                  TaskMind retains all rights to our software, algorithms, and service improvements. 
                  You retain ownership of your data, but grant us a license to process it to provide our services.
                </p>
                <p className="text-gray-600 mb-8">
                  Our AI models may learn from aggregated, anonymized usage patterns to improve service quality, 
                  but will never learn from your specific meeting content without explicit consent.
                </p>

                <h2 className="text-2xl font-bold text-black mb-6">8. Limitation of Liability</h2>
                <p className="text-gray-600 mb-8">
                  TaskMind's liability is limited to the amount you paid for the service in the past 12 months. 
                  We are not liable for indirect, incidental, special, or consequential damages. Some jurisdictions 
                  do not allow these limitations, so they may not apply to you.
                </p>

                <h2 className="text-2xl font-bold text-black mb-6">9. Service Availability</h2>
                <p className="text-gray-600 mb-8">
                  We strive for 99.9% uptime but cannot guarantee uninterrupted service. We may perform 
                  maintenance that temporarily affects service availability, with advance notice when possible.
                </p>

                <h2 className="text-2xl font-bold text-black mb-6">10. Termination</h2>
                <p className="text-gray-600 mb-8">
                  We may terminate or suspend your account immediately if you violate these Terms. 
                  Upon termination, your right to use the service ceases immediately, and we may delete 
                  your data after a reasonable retention period.
                </p>

                <h2 className="text-2xl font-bold text-black mb-6">11. Changes to Terms</h2>
                <p className="text-gray-600 mb-8">
                  We may modify these Terms at any time. We will notify you of significant changes via email 
                  or through the service. Continued use after changes constitutes acceptance of the new Terms.
                </p>

                <h2 className="text-2xl font-bold text-black mb-6">12. Governing Law</h2>
                <p className="text-gray-600 mb-8">
                  These Terms are governed by the laws of the State of Delaware, without regard to conflict 
                  of law principles. Any disputes will be resolved in the courts of Delaware.
                </p>

                <h2 className="text-2xl font-bold text-black mb-6">13. Contact Information</h2>
                <p className="text-gray-600 mb-4">
                  If you have questions about these Terms, contact us at:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-600 mb-2"><strong>Email:</strong> support@taskmind.dev</p>
                  <p className="text-gray-600 mb-2"><strong>Address:</strong> TaskMind Inc., 1341 N 9th St NE, Lincoln, NE 68508</p>
                  <p className="text-gray-600"><strong>Phone:</strong> (402) 600-2336</p>
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

export default Terms;
