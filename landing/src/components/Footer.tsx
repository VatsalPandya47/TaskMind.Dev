import { Instagram, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="text-2xl font-bold mb-4">TaskMind</div>
            <p className="text-gray-400 mb-6 max-w-md">
              AI-powered Task Automation & Chief of Staff platform for managers, 
              founders, and teams. Never drop a task again.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/trytaskmind?igsh=MXcxNXk2MHZpYjV6bQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://www.linkedin.com/company/tasksmind/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#roadmap" className="hover:text-white transition-colors">Roadmap</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">Terms</a></li>
              <li>
                <a 
                  href="mailto:support@taskmind.dev" 
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <Mail size={14} />
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 TaskMind. All rights reserved.</p>
        </div>
      </div>
      
      {/* Flowing Wave Animation */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg 
          className="relative block w-full h-16" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,60 C150,120 300,0 450,60 C600,120 750,0 900,60 C1050,120 1200,0 1200,60 L1200,120 L0,120 Z" 
            className="fill-blue-600/20 animate-pulse"
          />
          <path 
            d="M0,80 C200,20 400,140 600,80 C800,20 1000,140 1200,80 L1200,120 L0,120 Z" 
            className="fill-purple-600/20 animate-wave"
          />
          <path 
            d="M0,100 C300,40 600,160 900,100 C1050,60 1150,140 1200,100 L1200,120 L0,120 Z" 
            className="fill-indigo-600/30 animate-wave-reverse"
          />
        </svg>
      </div>
    </footer>
  );
};

export default Footer;
