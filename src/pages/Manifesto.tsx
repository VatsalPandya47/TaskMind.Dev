
import { Brain, Users, Shield, Zap, Heart, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Manifesto = () => {
  const principles = [
    {
      icon: Brain,
      title: "AI Should Amplify, Not Replace",
      description: "We believe artificial intelligence should enhance human capabilities, not substitute them. Our AI helps you focus on creative, strategic work by handling the mundane."
    },
    {
      icon: Users,
      title: "Meetings Should Drive Action",
      description: "Too many meetings end without clear outcomes. We transform discussions into actionable insights, ensuring every conversation moves your team forward."
    },
    {
      icon: Shield,
      title: "Privacy is Non-Negotiable",
      description: "Your conversations and data deserve the highest protection. We build privacy and security into every feature, not as an afterthought."
    },
    {
      icon: Zap,
      title: "Simplicity Creates Power",
      description: "The most powerful tools are often the simplest. We design for clarity and ease of use, making advanced AI accessible to everyone."
    },
    {
      icon: Heart,
      title: "Work Should Be Meaningful",
      description: "Life is too short for endless administrative tasks. We help you spend more time on work that matters and less time on busywork."
    },
    {
      icon: Globe,
      title: "Technology Should Unite",
      description: "In our distributed world, technology should bring teams together, not create barriers. We build tools that work across time zones, cultures, and platforms."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8">
            The TaskMind.ai Manifesto
          </h1>
          <div className="max-w-4xl mx-auto text-lg text-gray-700 space-y-6">
            <p className="text-2xl leading-relaxed">
              We envision a world where technology serves humanity, where AI amplifies our best qualities, 
              and where work becomes a source of fulfillment rather than frustration.
            </p>
            <p className="text-xl leading-relaxed">
              Every day, millions of people sit through meetings that could have been emails. 
              Action items get lost in transcript files. Important decisions fade into forgotten conversations. 
              We believe there's a better way.
            </p>
          </div>
        </div>

        {/* The Problem */}
        <div className="mb-20 bg-gray-100 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-center mb-8">The Problem We're Solving</h2>
          <div className="max-w-4xl mx-auto text-lg text-gray-700 space-y-6">
            <p>
              In the modern workplace, we're drowning in meetings but starving for outcomes. 
              The average knowledge worker spends 23 hours per week in meetings, yet 67% report 
              that these meetings fail to produce clear action items or decisions.
            </p>
            <p>
              We watch brilliant minds waste precious time on administrative overhead instead of 
              creative problem-solving. We see teams struggle to maintain alignment across time zones. 
              We witness good intentions lost in the gap between conversation and execution.
            </p>
            <p className="text-xl font-semibold text-gray-900">
              This is not just inefficient—it's profoundly human waste. We can do better.
            </p>
          </div>
        </div>

        {/* Our Principles */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Guiding Principles</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {principles.map((principle, index) => (
              <Card key={index} className="border-2 hover:border-amber-300 transition-colors">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <principle.icon className="h-6 w-6 text-amber-600" />
                    </div>
                    <CardTitle className="text-xl">{principle.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    {principle.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Our Vision */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-8">Our Vision for the Future</h2>
          <div className="max-w-4xl mx-auto text-lg text-gray-700 space-y-6">
            <p>
              We imagine a workplace where every meeting has purpose, every conversation drives action, 
              and every team member knows exactly what they need to do and why it matters.
            </p>
            <p>
              In this future, AI doesn't replace human judgment—it enhances it. Teams spend less time 
              in status meetings and more time solving interesting problems. Managers have real-time 
              visibility into progress without micromanaging. Remote workers feel as connected and 
              informed as their office-based colleagues.
            </p>
            <p>
              Most importantly, people go home each day knowing their work mattered, their contributions 
              were recognized, and their team moved meaningfully forward.
            </p>
          </div>
        </div>

        {/* Our Commitment */}
        <div className="bg-amber-600 rounded-2xl p-12 text-white mb-20">
          <h2 className="text-3xl font-bold text-center mb-8">Our Commitment to You</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">To Individuals</h3>
                <ul className="space-y-2">
                  <li>• We'll never waste your time with unnecessary complexity</li>
                  <li>• We'll protect your privacy as fiercely as our own</li>
                  <li>• We'll help you focus on work that energizes you</li>
                  <li>• We'll respect your time and cognitive load</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">To Organizations</h3>
                <ul className="space-y-2">
                  <li>• We'll provide transparent, measurable productivity gains</li>
                  <li>• We'll integrate seamlessly with your existing workflows</li>
                  <li>• We'll scale with your growth and evolution</li>
                  <li>• We'll support your team's unique culture and needs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* The Journey Ahead */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">The Journey Ahead</h2>
          <div className="max-w-4xl mx-auto text-lg text-gray-700 space-y-6">
            <p>
              This manifesto isn't just words on a page—it's our North Star. Every feature we build, 
              every partnership we form, and every decision we make is guided by these principles.
            </p>
            <p>
              We're still in the early chapters of this story. As we grow, we'll face new challenges 
              and opportunities. We'll make mistakes and learn from them. But we'll never lose sight 
              of why we started: to make work more human.
            </p>
            <p className="text-xl font-semibold text-amber-600">
              Join us in building a future where technology serves humanity, 
              where work has purpose, and where every meeting moves us forward.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manifesto;
