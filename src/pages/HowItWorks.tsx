
import { ArrowRight, Brain, Calendar, CheckSquare, Zap, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const steps = [
    {
      icon: Calendar,
      title: "Connect Your Meetings",
      description: "Seamlessly integrate with Zoom, Google Meet, and other platforms to automatically capture your meeting recordings.",
      details: "Our AI automatically detects when you join a meeting and begins intelligent transcription in real-time."
    },
    {
      icon: Brain,
      title: "AI Processes Everything",
      description: "Advanced AI analyzes your meeting transcripts to extract actionable insights, decisions, and tasks.",
      details: "Using state-of-the-art natural language processing, we identify key discussion points, decisions made, and action items assigned."
    },
    {
      icon: CheckSquare,
      title: "Auto-Generate Tasks",
      description: "Tasks are automatically created with smart categorization, priority levels, and deadline suggestions.",
      details: "Each task includes context from the meeting, assigned participants, and intelligent priority scoring based on urgency indicators."
    },
    {
      icon: Zap,
      title: "Stay Organized",
      description: "Access your personalized dashboard with all tasks, deadlines, and progress tracking in one place.",
      details: "Get intelligent notifications, progress reminders, and analytics to keep your team productive and aligned."
    }
  ];

  const features = [
    {
      title: "Real-time Transcription",
      description: "Instant, accurate transcription with speaker identification and timestamps"
    },
    {
      title: "Smart Task Extraction",
      description: "AI identifies action items, assigns ownership, and suggests deadlines"
    },
    {
      title: "Priority Intelligence",
      description: "Automatic priority scoring based on urgency, context, and deadlines"
    },
    {
      title: "Team Collaboration",
      description: "Shared workspaces, progress tracking, and team performance insights"
    },
    {
      title: "Integration Ready",
      description: "Works with your existing tools: Slack, Trello, Asana, and more"
    },
    {
      title: "Privacy First",
      description: "Enterprise-grade security with end-to-end encryption"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            How TaskMind.ai Works
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your meetings into actionable insights with our AI-powered platform. 
            See how we turn conversations into organized, trackable tasks automatically.
          </p>
        </div>

        {/* Process Steps */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">The Process</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="relative border-2 hover:border-blue-300 transition-colors">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                    <step.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="absolute -top-3 -right-3 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{step.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-blue-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Meetings?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of teams already using TaskMind.ai to stay organized and productive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="text-blue-600">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/documentation">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
