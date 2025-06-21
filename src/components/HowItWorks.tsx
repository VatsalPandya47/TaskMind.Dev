
import { Calendar, Brain, Bell, Users } from 'lucide-react';

const HowItWorks = () => {
  const features = [
    {
      icon: Calendar,
      title: "Meeting Integration",
      description: "Connects to Zoom, Teams, and Slack to automatically extract action items from meetings and conversations."
    },
    {
      icon: Brain,
      title: "AI Task Extraction",
      description: "Uses advanced AI to identify commitments, deadlines, and owners from meeting transcripts and messages."
    },
    {
      icon: Bell,
      title: "Proactive Nudges",
      description: "Sends smart reminders and notifications to keep teams accountable and on track with their commitments."
    },
    {
      icon: Users,
      title: "Team Dashboards",
      description: "Provides shared visibility into team tasks, progress, and bottlenecks for better collaboration."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            How TaskMind Works
          </h2>
          <p className="text-xl text-gray-600">
            Turn meetings into action with AI-powered task automation that works with your existing tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="text-center group hover:scale-105 transition-transform duration-200">
              <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 transition-colors">
                <feature.icon size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
