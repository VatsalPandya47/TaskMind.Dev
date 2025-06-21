
import { Card } from '@/components/ui/card';

const Integrations = () => {
  const integrations = [
    {
      name: "Zoom",
      logo: "🎥",
      description: "Video conferencing"
    },
    {
      name: "Slack",
      logo: "💬",
      description: "Team communication"
    },
    {
      name: "Microsoft Teams",
      logo: "👥",
      description: "Collaboration platform"
    },
    {
      name: "Google Calendar",
      logo: "📅",
      description: "Schedule management"
    },
    {
      name: "Notion",
      logo: "📝",
      description: "Workspace & notes"
    },
    {
      name: "Google Docs",
      logo: "📄",
      description: "Document editing"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Amplify your mind across every platform.
          </h2>
          <p className="text-xl text-gray-600">
            Seamlessly enhance your productivity and thinking power across all your favorite tools and workflows.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-4xl mx-auto">
          {integrations.map((integration, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow bg-white border border-gray-200">
              <div className="text-4xl mb-3">{integration.logo}</div>
              <h3 className="font-semibold text-black mb-1">{integration.name}</h3>
              <p className="text-sm text-gray-600">{integration.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Integrations;
