import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Video, 
  MessageSquare, 
  Calendar, 
  FileText, 
  Zap, 
  CheckCircle,
  Clock,
  ExternalLink,
  Settings,
  Users,
  Database,
  Shield
} from "lucide-react";

const Integrations = () => {
  const integrations = [
    {
      name: "Zoom",
      description: "Connect your Zoom meetings for automatic transcription and task extraction",
      icon: Video,
      status: "active",
      features: ["Meeting sync", "Recording access", "Transcript extraction"],
      color: "blue"
    },
    {
      name: "Slack",
      description: "Get notifications and share summaries directly in your Slack workspace",
      icon: MessageSquare,
      status: "active",
      features: ["Notifications", "Summary sharing", "Team collaboration"],
      color: "purple"
    },
    {
      name: "Google Calendar",
      description: "Sync your calendar events and automatically create meeting summaries",
      icon: Calendar,
      status: "coming-soon",
      features: ["Event sync", "Auto-summaries", "Calendar integration"],
      color: "green"
    },
    {
      name: "Notion",
      description: "Export meeting summaries and tasks directly to your Notion workspace",
      icon: FileText,
      status: "coming-soon",
      features: ["Page creation", "Database sync", "Template support"],
      color: "gray"
    },
    {
      name: "Microsoft Teams",
      description: "Integrate with Teams for seamless meeting management and collaboration",
      icon: Users,
      status: "planned",
      features: ["Meeting integration", "Chat sync", "File sharing"],
      color: "blue"
    },
    {
      name: "Asana",
      description: "Automatically create and assign tasks from meeting discussions",
      icon: CheckCircle,
      status: "planned",
      features: ["Task creation", "Assignment sync", "Project linking"],
      color: "orange"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-500/20 text-blue-400 border-blue-400/30",
      purple: "bg-purple-500/20 text-purple-400 border-purple-400/30",
      green: "bg-green-500/20 text-green-400 border-green-400/30",
      gray: "bg-gray-500/20 text-gray-400 border-gray-400/30",
      orange: "bg-orange-500/20 text-orange-400 border-orange-400/30"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-400 border border-green-400/30">Active</Badge>;
      case "coming-soon":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-400/30">Coming Soon</Badge>;
      case "planned":
        return <Badge className="bg-gray-500/20 text-gray-400 border border-gray-400/30">Planned</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border border-gray-400/30">Unknown</Badge>;
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
            Powerful Integrations
          </h2>
          <p className="text-xl text-gray-300">
            Connect TaskMind with your favorite tools and platforms for seamless workflow integration
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {integrations.map((integration, index) => (
            <Card key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className={`p-3 rounded-2xl border ${getColorClasses(integration.color)}`}>
                  <integration.icon className="h-8 w-8" />
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-white mb-2">{integration.name}</h3>
                <p className="text-gray-300 text-sm mb-3">{integration.description}</p>
                {getStatusBadge(integration.status)}
              </div>

              <div className="space-y-2 mb-6">
                {integration.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2 text-sm text-gray-400">
                    <Zap className="h-3 w-3 text-blue-400" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                variant="outline" 
                className={`w-full border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white ${
                  integration.status === 'active' ? 'border-green-500/30 text-green-400 hover:bg-green-500/20' : ''
                }`}
                disabled={integration.status !== 'active'}
              >
                {integration.status === 'active' ? (
                  <>
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </>
                ) : integration.status === 'coming-soon' ? (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    Coming Soon
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Planned
                  </>
                )}
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Need a Custom Integration?</h3>
            <p className="text-gray-300 mb-6">
              We're constantly adding new integrations. Let us know what tools you use and we'll prioritize them.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl">
                Request Integration
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white">
                View API Docs
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integrations;
