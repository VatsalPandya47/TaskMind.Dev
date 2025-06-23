
import { CheckCircle, Clock, MessageSquare, BarChart3, Zap, Shield } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "Meeting Action Items",
      description: "Automatically extract tasks, owners, and deadlines from Zoom, Teams, and Slack conversations."
    },
    {
      icon: Clock,
      title: "Smart Reminders",
      description: "Get proactive nudges about upcoming deadlines and overdue commitments via email and Slack."
    },
    {
      icon: BarChart3,
      title: "Team Analytics",
      description: "Track task completion rates, identify bottlenecks, and measure team productivity over time."
    },
    {
      icon: Zap,
      title: "Auto Subtasks",
      description: "AI breaks down complex projects into manageable subtasks with suggested timelines."
    },
    {
      icon: CheckCircle,
      title: "Daily Standups",
      description: "Automated daily digest showing what's due today and what needs attention."
    },
    {
      icon: Shield,
      title: "Enterprise Ready",
      description: "SOC2 compliant with SSO, audit logs, and data isolation for teams of all sizes."
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Features Built for Teams
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to turn meetings into action and keep your team accountable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <feature.icon size={24} className="text-blue-600" />
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

export default Features;
