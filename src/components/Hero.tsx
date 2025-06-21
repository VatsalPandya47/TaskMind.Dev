
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import WaitlistModal from './WaitlistModal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Hero = () => {
  const [currentText, setCurrentText] = useState('');
  const { toast } = useToast();
  
  const demoTexts = [
    "📋 Found 3 action items from your standup meeting. Assigned to Sarah, due Friday.",
    "⏰ Reminder: Follow up with client about Q4 proposal - deadline in 2 days.",
    "🎯 Weekly digest: 12 tasks completed, 3 overdue items need attention."
  ];

  useEffect(() => {
    let textIndex = 0;
    let charIndex = 0;
    let timeout: NodeJS.Timeout;

    const typeText = () => {
      if (charIndex < demoTexts[textIndex].length) {
        setCurrentText(demoTexts[textIndex].substring(0, charIndex + 1));
        charIndex++;
        timeout = setTimeout(typeText, 50);
      } else {
        setTimeout(() => {
          charIndex = 0;
          textIndex = (textIndex + 1) % demoTexts.length;
          setCurrentText('');
          timeout = setTimeout(typeText, 500);
        }, 3000);
      }
    };

    timeout = setTimeout(typeText, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const handleBookDemo = async () => {
    const email = prompt("Please enter your email address for the demo:");
    
    if (!email) {
      return;
    }

    try {
      // Send notification for demo request
      await supabase.functions.invoke('send-notification', {
        body: {
          type: 'demo',
          email: email.trim()
        }
      });

      toast({
        title: "Demo request received!",
        description: "We'll contact you soon to schedule your demo.",
      });
    } catch (error) {
      console.error('Failed to send demo notification:', error);
      toast({
        title: "Request received",
        description: "Thanks for your interest! Please email us at vatsalpandya@taskmind.dev to schedule.",
      });
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
            Your AI Chief of Staff
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            AI-powered Task Automation platform for managers, founders, and teams. 
            Extract action items from meetings, track commitments, and never drop a task again.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <WaitlistModal />
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-4"
              onClick={handleBookDemo}
            >
              <Users className="mr-2" size={20} />
              Book Demo
            </Button>
          </div>

          {/* Demo AI Widget */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-600">TaskMind AI Active</span>
              </div>
              <div className="text-left">
                <p className="text-gray-800 min-h-[60px] flex items-center">
                  {currentText}
                  <span className="animate-pulse ml-1">|</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
