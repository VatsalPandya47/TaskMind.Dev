
const CareersSection = () => (
  <section className="w-full bg-gray-50 py-16 md:py-24 border-b" id="careers">
    <div className="max-w-4xl mx-auto px-6">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-8 text-gray-900">Join Our Team</h2>
      <div className="text-center mb-12">
        <p className="text-lg text-gray-600 mb-6">
          Help teams work smarter by unlocking insights from every meeting.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-blue-700">Who We're Looking For</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• AI/ML Engineers passionate about NLP and real-world impact</li>
            <li>• Frontend Developers with a focus on beautiful, accessible UX</li>
            <li>• Product Managers eager to shape the future of productivity software</li>
            <li>• Success and Support teammates who love empowering customers</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4 text-blue-700">Why Join Us?</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Remote-first, flexible working practices</li>
            <li>• Growth opportunities from day one</li>
            <li>• Direct user impact—see your code shape real-world workflows</li>
            <li>• Collaborative team environment</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg border text-center">
        <h3 className="text-lg font-semibold mb-2 text-blue-700">Real-Life Example</h3>
        <p className="text-gray-600 italic">
          Ravi, a recent hire, launched our meeting transcript analysis feature after collaborating with users on early prototypes.
        </p>
      </div>
      
      <div className="text-center mt-8">
        <p className="text-gray-700 mb-4">
          Ready to make an impact? Send your CV to{" "}
          <a href="mailto:careers@taskmind.ai" className="text-blue-600 hover:underline font-medium">
            careers@taskmind.ai
          </a>
        </p>
      </div>
    </div>
  </section>
);

export default CareersSection;
