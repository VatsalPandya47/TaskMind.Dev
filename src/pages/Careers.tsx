
import { MapPin, Clock, Users, Heart, Zap, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Careers = () => {
  const jobOpenings = [
    {
      title: "Senior AI Engineer",
      department: "Engineering",
      location: "Remote / San Francisco",
      type: "Full-time",
      description: "Lead the development of our core AI models for meeting analysis and task extraction.",
      requirements: ["5+ years in ML/AI", "Python, TensorFlow/PyTorch", "NLP experience", "PhD preferred"]
    },
    {
      title: "Full Stack Developer",
      department: "Engineering",
      location: "Remote / New York",
      type: "Full-time",
      description: "Build and maintain our React/Node.js application serving millions of users.",
      requirements: ["3+ years React/Node.js", "TypeScript", "Database design", "API development"]
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote / Los Angeles",
      type: "Full-time",
      description: "Design intuitive interfaces that make AI-powered productivity accessible to everyone.",
      requirements: ["3+ years product design", "Figma/Sketch", "User research", "Design systems"]
    },
    {
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Scale our infrastructure to handle millions of meeting recordings securely.",
      requirements: ["AWS/GCP experience", "Kubernetes", "CI/CD pipelines", "Security focus"]
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote / Austin",
      type: "Full-time",
      description: "Help enterprise customers maximize their productivity with TaskMind.ai.",
      requirements: ["B2B SaaS experience", "Customer relationship management", "Technical aptitude"]
    },
    {
      title: "Marketing Manager",
      department: "Marketing",
      location: "Remote / Chicago",
      type: "Full-time",
      description: "Drive growth through content marketing, partnerships, and demand generation.",
      requirements: ["3+ years B2B marketing", "Content creation", "Analytics", "Growth mindset"]
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health, dental, and vision insurance plus wellness stipend"
    },
    {
      icon: Zap,
      title: "Remote First",
      description: "Work from anywhere with quarterly team retreats and co-working stipends"
    },
    {
      icon: Target,
      title: "Growth & Learning",
      description: "$2,000 annual learning budget plus conference attendance and internal mentorship"
    },
    {
      icon: Users,
      title: "Equity & Ownership",
      description: "Meaningful equity package so you share in our success"
    },
    {
      icon: Clock,
      title: "Time Off",
      description: "Unlimited PTO policy plus 2-week company shutdown in December"
    },
    {
      icon: MapPin,
      title: "Flexibility",
      description: "Flexible hours across time zones with async-first communication"
    }
  ];

  const values = [
    {
      title: "AI for Human Empowerment",
      description: "We believe AI should amplify human capabilities, not replace them. Our technology helps people focus on what matters most."
    },
    {
      title: "Radical Transparency",
      description: "We share our roadmap, challenges, and successes openly. Transparency builds trust with our team and customers."
    },
    {
      title: "Customer Obsession",
      description: "Every decision starts with 'How does this help our customers be more productive and successful?'"
    },
    {
      title: "Continuous Learning",
      description: "The AI landscape evolves rapidly. We invest in learning, experimentation, and staying at the forefront of innovation."
    },
    {
      title: "Sustainable Growth",
      description: "We're building for the long term - sustainable business practices, work-life balance, and responsible AI development."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Join Our Mission
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help us build the future of AI-powered productivity. We're looking for passionate 
            individuals who want to make work more meaningful for millions of people.
          </p>
        </div>

        {/* Company Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-l-4 border-l-indigo-500">
                <CardHeader>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                  <CardDescription className="text-base">{value.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Why Join TaskMind.ai?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-indigo-100 rounded-full w-fit">
                    <benefit.icon className="h-8 w-8 text-indigo-600" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Job Openings */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Open Positions</h2>
          <div className="space-y-6">
            {jobOpenings.map((job, index) => (
              <Card key={index} className="border-2 hover:border-indigo-300 transition-colors">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="secondary">{job.department}</Badge>
                        <span className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </span>
                        <span className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <Button>Apply Now</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{job.description}</p>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                    <ul className="space-y-1">
                      {job.requirements.map((req, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Culture Section */}
        <div className="bg-indigo-600 rounded-2xl p-12 text-white text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Our Culture</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            We're a diverse team of builders, dreamers, and problem-solvers united by our passion 
            for using AI to make work more human and meaningful.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-indigo-100">Team Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">12</div>
              <div className="text-indigo-100">Countries</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">4.9/5</div>
              <div className="text-indigo-100">Glassdoor Rating</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Don't See Your Role?</h2>
          <p className="text-xl text-gray-600 mb-8">
            We're always looking for exceptional talent. Send us your resume and tell us how you'd like to contribute.
          </p>
          <Button size="lg" variant="outline">
            Send General Application
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Careers;
