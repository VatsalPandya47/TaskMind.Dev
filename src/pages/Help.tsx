
import { Search, MessageCircle, Book, Video, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqItems = [
    {
      question: "How do I connect my Zoom account?",
      answer: "Go to Settings > Integrations and click 'Connect Zoom'. You'll be redirected to Zoom's authorization page. Once connected, TaskMind.ai will automatically process your meeting recordings."
    },
    {
      question: "Can I edit or delete auto-generated tasks?",
      answer: "Yes! All auto-generated tasks can be edited, reassigned, or deleted. Click on any task to modify its details, change the assignee, or update the deadline."
    },
    {
      question: "Is my meeting data secure?",
      answer: "Absolutely. We use enterprise-grade encryption for all data in transit and at rest. Your meeting recordings are processed securely and can be automatically deleted after task extraction if preferred."
    },
    {
      question: "How accurate is the AI task extraction?",
      answer: "Our AI achieves 95%+ accuracy in identifying action items and decisions. The system continuously learns from your feedback to improve accuracy over time."
    },
    {
      question: "Can I use TaskMind.ai with other meeting platforms?",
      answer: "Currently, we support Zoom, Google Meet, and Microsoft Teams. We're actively working on expanding to other platforms. Check our roadmap for updates."
    },
    {
      question: "How do I invite team members?",
      answer: "Go to Settings > Team Management and click 'Invite Members'. Enter their email addresses and select their role. They'll receive an invitation to join your workspace."
    },
    {
      question: "What happens if I exceed my plan limits?",
      answer: "We'll notify you before you reach your limits. You can upgrade your plan anytime, or older data will be archived but remain accessible in read-only mode."
    },
    {
      question: "Can I export my tasks and data?",
      answer: "Yes! You can export your tasks to CSV, integrate with project management tools like Asana or Trello, or use our API for custom integrations."
    }
  ];

  const supportOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help from our support team",
      action: "Start Chat",
      available: "24/7"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      action: "Send Email",
      available: "Response within 2 hours"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Talk to our experts directly",
      action: "Schedule Call",
      available: "Business hours"
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Watch step-by-step guides",
      action: "Watch Now",
      available: "On-demand"
    }
  ];

  const quickLinks = [
    { title: "Getting Started Guide", icon: Book },
    { title: "API Documentation", icon: Book },
    { title: "Integration Tutorials", icon: Video },
    { title: "Best Practices", icon: Book },
    { title: "Troubleshooting", icon: Book },
    { title: "Feature Requests", icon: MessageCircle }
  ];

  const filteredFAQ = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            How Can We Help?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Find answers to common questions, get support, or explore our resources.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>
        </div>

        {/* Support Options */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {supportOptions.map((option, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                  <option.icon className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{option.title}</CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full mb-2">{option.action}</Button>
                <p className="text-sm text-gray-500">{option.available}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Quick Links</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <Card key={index} className="cursor-pointer hover:bg-gray-50 transition-colors">
                <CardContent className="flex items-center space-x-3 p-4">
                  <link.icon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">{link.title}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-4">
            {filteredFAQ.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          {filteredFAQ.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No results found for "{searchQuery}"</p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16 bg-blue-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-xl mb-8 opacity-90">
            Our support team is here to help you succeed with TaskMind.ai
          </p>
          <Button size="lg" variant="secondary" className="text-blue-600">
            Contact Support Team
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Help;
