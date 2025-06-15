
import { Building2, Users, Briefcase, GraduationCap, Heart, Rocket } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const UseCases = () => {
  const useCases = [
    {
      icon: Building2,
      title: "Enterprise Teams",
      description: "Large organizations managing complex projects across multiple departments",
      benefits: [
        "Centralized task management across departments",
        "Executive reporting and analytics",
        "Compliance and audit trail features",
        "Advanced security and permissions"
      ],
      example: "A Fortune 500 company uses TaskMind.ai to coordinate quarterly planning meetings across 12 departments, automatically generating 200+ action items with clear ownership and deadlines."
    },
    {
      icon: Users,
      title: "Remote Teams",
      description: "Distributed teams staying aligned across time zones and locations",
      benefits: [
        "Asynchronous meeting summaries",
        "Time zone aware scheduling",
        "Cultural context understanding",
        "Real-time collaboration tools"
      ],
      example: "A global startup with teams in 8 countries uses TaskMind.ai to ensure nothing falls through the cracks during their weekly all-hands meetings."
    },
    {
      icon: Briefcase,
      title: "Consulting Firms",
      description: "Professional services managing multiple client projects simultaneously",
      benefits: [
        "Client-specific task categorization",
        "Billable hours tracking integration",
        "Deliverable timeline management",
        "Client communication automation"
      ],
      example: "A management consulting firm tracks action items from 50+ client meetings per week, automatically categorizing by project and priority."
    },
    {
      icon: GraduationCap,
      title: "Educational Institutions",
      description: "Schools and universities coordinating faculty, staff, and student initiatives",
      benefits: [
        "Academic calendar integration",
        "Student project coordination",
        "Faculty meeting management",
        "Administrative task tracking"
      ],
      example: "A university uses TaskMind.ai to manage curriculum committee meetings, tracking course development tasks across 15 departments."
    },
    {
      icon: Heart,
      title: "Healthcare Organizations",
      description: "Medical teams coordinating patient care and administrative tasks",
      benefits: [
        "HIPAA-compliant meeting processing",
        "Care plan task generation",
        "Staff scheduling coordination",
        "Quality improvement tracking"
      ],
      example: "A hospital system uses TaskMind.ai for daily huddles, automatically generating follow-up tasks for patient care improvements and staff training."
    },
    {
      icon: Rocket,
      title: "Startups & Scale-ups",
      description: "Fast-growing companies needing agile task management and rapid execution",
      benefits: [
        "Rapid scaling support",
        "Investor update automation",
        "Product development tracking",
        "Growth metric monitoring"
      ],
      example: "A fintech startup uses TaskMind.ai to manage product sprint planning, automatically converting feature discussions into development tasks with engineering estimates."
    }
  ];

  const industries = [
    "Technology", "Finance", "Healthcare", "Education", "Manufacturing",
    "Retail", "Legal", "Non-profit", "Government", "Real Estate"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Use Cases & Industries
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how organizations across industries are using TaskMind.ai to transform 
            their meeting productivity and task management workflows.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {useCases.map((useCase, index) => (
            <Card key={index} className="border-2 hover:border-blue-300 transition-colors">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <useCase.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{useCase.title}</CardTitle>
                </div>
                <CardDescription className="text-base">{useCase.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Key Benefits:</h4>
                  <ul className="space-y-1">
                    {useCase.benefits.map((benefit, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Real Example:</h4>
                  <p className="text-sm text-gray-700 italic">{useCase.example}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Industries Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Industries We Serve</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {industries.map((industry, index) => (
              <Badge key={index} variant="outline" className="text-lg py-2 px-4">
                {industry}
              </Badge>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-blue-600 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-8">TaskMind.ai by the Numbers</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Organizations</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2.5M+</div>
              <div className="text-blue-100">Meetings Processed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">45%</div>
              <div className="text-blue-100">Productivity Increase</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.2%</div>
              <div className="text-blue-100">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseCases;
