import { Calendar, Users, Zap, Building } from 'lucide-react';

const Roadmap = () => {
  const phases = [
    {
      icon: Calendar,
      phase: "MVP",
      timeline: "Next 45 Days",
      title: "Meeting Intelligence",
      features: [
        "Zoom integration & transcript extraction",
        "AI-powered action item detection",
        "Simple web dashboard",
        "Email & Slack notifications"
      ],
      status: "In Progress"
    },
    {
      icon: Users,
      phase: "V1",
      timeline: "2-3 Months",
      title: "Team Collaboration",
      features: [
        "Slack & Teams integration",
        "Shared team dashboards",
        "Daily standup digests",
        "Personal AI assistant chatbot"
      ],
      status: "Planned"
    },
    {
      icon: Zap,
      phase: "V2",
      timeline: "6 Months",
      title: "Advanced Automation",
      features: [
        "Google Calendar integration",
        "Notion & Google Docs sync",
        "Productivity metrics & insights",
        "Browser extension"
      ],
      status: "Future"
    },
    {
      icon: Building,
      phase: "Enterprise",
      timeline: "12 Months",
      title: "Enterprise Features",
      features: [
        "SSO & advanced security",
        "Custom workflows",
        "API & integrations",
        "Dedicated support"
      ],
      status: "Vision"
    }
  ];

  return (
    <section id="roadmap" className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
            Product Roadmap
          </h2>
          <p className="text-xl text-gray-300">
            See what's coming next as we build the future of task automation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {phases.map((phase, index) => (
            <div key={index} className="relative">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm w-12 h-12 rounded-xl flex items-center justify-center border border-purple-500/30">
                    <phase.icon size={24} className="text-purple-400" />
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    phase.status === 'In Progress' ? 'bg-green-500/20 text-green-400 border border-green-400/30' :
                    phase.status === 'Planned' ? 'bg-purple-500/20 text-purple-400 border border-purple-400/30' :
                    phase.status === 'Future' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30' :
                    'bg-gray-500/20 text-gray-400 border border-gray-400/30'
                  }`}>
                    {phase.status}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">{phase.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{phase.timeline}</p>
                
                <ul className="space-y-2">
                  {phase.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-sm text-gray-300 flex items-start">
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              {index < phases.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-600/50"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
