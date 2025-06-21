
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WaitlistModal from './WaitlistModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-2xl font-bold text-black hover:text-gray-700 transition-colors">
            <img 
              src="/lovable-uploads/3bf288f1-a5f3-4d2e-82bf-d433c92ec6a7.png" 
              alt="TaskMind Logo" 
              className="w-8 h-8"
            />
            TaskMind
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-gray-700 hover:text-black transition-colors">How It Works</a>
            <a href="#features" className="text-gray-700 hover:text-black transition-colors">Features</a>
            <a href="#pricing" className="text-gray-700 hover:text-black transition-colors">Pricing</a>
            <a href="#roadmap" className="text-gray-700 hover:text-black transition-colors">Roadmap</a>
            <WaitlistModal trigger={<Button variant="outline" className="mr-2">Join Waitlist</Button>} />
            <WaitlistModal trigger={<Button className="bg-black text-white hover:bg-gray-800">Get Started</Button>} />
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-4">
            <a href="#how-it-works" className="block text-gray-700 hover:text-black transition-colors">How It Works</a>
            <a href="#features" className="block text-gray-700 hover:text-black transition-colors">Features</a>
            <a href="#pricing" className="block text-gray-700 hover:text-black transition-colors">Pricing</a>
            <a href="#roadmap" className="block text-gray-700 hover:text-black transition-colors">Roadmap</a>
            <div className="flex flex-col space-y-2 pt-4">
              <WaitlistModal trigger={<Button variant="outline">Join Waitlist</Button>} />
              <WaitlistModal trigger={<Button className="bg-black text-white hover:bg-gray-800">Get Started</Button>} />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
