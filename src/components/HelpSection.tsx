
const HelpSection = () => (
  <section className="w-full bg-white py-16 md:py-24 border-b" id="help">
    <div className="max-w-4xl mx-auto px-6">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-gray-900">Help & FAQ</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-blue-700">How do I connect TaskMind.ai with Zoom?</h3>
            <p className="text-gray-700 mb-2">
              Go to Settings → Integrations and click "Connect with Zoom." Grant permissions as prompted.
            </p>
            <p className="text-sm text-gray-500 italic">
              Example: Jane connects her Zoom account, so all future recorded meetings sync automatically.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2 text-blue-700">What if the AI misses an action item?</h3>
            <p className="text-gray-700 mb-2">
              You can edit, add, or assign action items manually. The system gets smarter over time!
            </p>
            <p className="text-sm text-gray-500 italic">
              Example: Mike adds a missed "Order hardware" task, ensuring nothing falls through.
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-blue-700">Is my data secure?</h3>
            <p className="text-gray-700">
              Yes. All meetings and extracted tasks are encrypted in transit and at rest, with best-in-class cloud hosting.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2 text-blue-700">Where do I get more help?</h3>
            <p className="text-gray-700">
              Visit our documentation or contact our support team for personalized assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HelpSection;
