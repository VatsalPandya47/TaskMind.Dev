import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does TaskMind automate my tasks?",
      answer: "TaskMind uses AI to intelligently understand your workflows, priorities, and context. It automatically captures tasks from meetings, emails, and conversations, then organizes and reminds you at the right time with the right context."
    },
    {
      question: "What data does TaskMind access and store?",
      answer: "TaskMind only accesses the data you explicitly connect - your calendar, email, and selected communication tools. All data is encrypted and processed securely, with full transparency about what's being tracked and used for task automation."
    },
    {
      question: "Can TaskMind integrate with my existing tools?",
      answer: "Yes! TaskMind seamlessly integrates with popular productivity tools like Slack, Zoom, Google Calendar, Notion, and Google Docs. It works as your central task hub while connecting to your existing workflow."
    },
    {
      question: "Is TaskMind available on Mac and Windows?",
      answer: "Absolutely! TaskMind works on both macOS and Windows with native applications optimized for each platform. We also offer web access so you can manage tasks from anywhere."
    },
    {
      question: "How accurate is TaskMind's task capture and organization?",
      answer: "TaskMind maintains over 95% accuracy in understanding context and capturing actionable tasks from your communications. It continuously learns from your feedback to improve task prioritization and organization."
    },
    {
      question: "Can I customize how TaskMind manages my tasks?",
      answer: "Yes, you have full control over TaskMind's behavior. You can set custom workflows, define priority levels, choose which sources to monitor, and configure when and how you receive task notifications and reminders."
    }
  ];

  return (
    <section id="help" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about TaskMind's AI-powered task automation.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenQuestion(openQuestion === index ? null : index)}
                >
                  <span className="font-semibold text-black">{faq.question}</span>
                  {openQuestion === index ? (
                    <ChevronUp size={20} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-600" />
                  )}
                </button>
                {openQuestion === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-black mb-4">You've reached the turning point where ideas become reality.</h3>
            <p className="text-gray-600 mb-6">Get in touch with our team for personalized support.</p>
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto border border-gray-200">
              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                <textarea
                  placeholder="Your question"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
