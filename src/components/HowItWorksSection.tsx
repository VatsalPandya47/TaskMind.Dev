
const HowItWorksSection = () => (
  <section className="w-full bg-gray-50 py-16 md:py-24 border-b" id="how-it-works">
    <div className="max-w-5xl mx-auto px-6">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-gray-900">How It Works</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="text-center">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-blue-600">1</span>
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Record Your Meeting</h3>
          <p className="text-gray-600">
            Integrate TaskMind.ai with popular platforms like Zoom or upload your meeting recordings.
          </p>
          <p className="text-sm text-gray-500 mt-2 italic">
            Example: Sarah connects TaskMind.ai to her weekly team sync on Zoom.
          </p>
        </div>
        
        <div className="text-center">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-green-600">2</span>
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">AI Extraction</h3>
          <p className="text-gray-600">
            Our advanced AI listens to your meeting, identifies all spoken tasks, and turns them into actionable to-dos.
          </p>
          <p className="text-sm text-gray-500 mt-2 italic">
            Example: AI detects "John will prepare the project timeline by Friday" and creates a task assigned to John.
          </p>
        </div>
        
        <div className="text-center">
          <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-purple-600">3</span>
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Task Management</h3>
          <p className="text-gray-600">
            All extracted tasks are neatly organized in your dashboard for review, assignment, and tracking.
          </p>
          <p className="text-sm text-gray-500 mt-2 italic">
            Example: The team reviews extracted tasks, confirming ownership and adding priorities.
          </p>
        </div>
        
        <div className="text-center">
          <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-orange-600">4</span>
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Collaboration</h3>
          <p className="text-gray-600">
            Edit, comment, assign, or mark tasks as done—just like in your favorite project management app.
          </p>
          <p className="text-sm text-gray-500 mt-2 italic">
            Example: Tasks like "Review ad copy" are discussed and assigned during the call.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
