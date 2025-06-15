
import { Brain, Mail, Twitter, Linkedin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const ComingSoon = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just show success message
    setIsSubmitted(true);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo and Brand */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <Brain className="h-12 w-12 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">TaskMind.ai</h1>
        </div>

        {/* Coming Soon Message */}
        <div className="mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Coming Soon
          </h2>
          <p className="text-xl text-gray-600 mb-4">
            We're building something amazing for you!
          </p>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            TaskMind.ai will revolutionize how you manage meetings and tasks with AI-powered insights. 
            Get ready for smarter productivity.
          </p>
        </div>

        {/* Email Signup */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Be the first to know when we launch
          </h3>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" className="px-8">
                Notify Me
              </Button>
            </form>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-green-800 font-medium">
                Thank you! We'll notify you when we launch.
              </p>
            </div>
          )}
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">AI-Powered</h4>
            <p className="text-gray-600 text-sm">
              Smart meeting analysis and task extraction powered by advanced AI
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Mail className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Seamless Integration</h4>
            <p className="text-gray-600 text-sm">
              Works with your existing meeting platforms and productivity tools
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Twitter className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Smart Insights</h4>
            <p className="text-gray-600 text-sm">
              Get actionable insights and never miss important tasks again
            </p>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-4 mb-8">
          <Button variant="outline" size="icon">
            <Twitter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Linkedin className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Github className="h-4 w-4" />
          </Button>
        </div>

        {/* Footer */}
        <p className="text-sm text-gray-500">
          © 2025 TaskMind.ai. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
