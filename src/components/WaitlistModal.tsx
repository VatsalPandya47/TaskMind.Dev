import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, X } from 'lucide-react';
import WaitlistForm from './WaitlistForm';

interface WaitlistModalProps {
  trigger?: React.ReactNode;
}

const WaitlistModal = ({ trigger }: WaitlistModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const defaultTrigger = (
    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <ArrowRight className="mr-2" size={20} />
      Join Waitlist
    </Button>
  );

  const triggerElement = trigger || defaultTrigger;

  return (
    <>
      {/* Trigger */}
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {triggerElement}
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl max-w-md w-full p-6 relative border border-gray-700/50 shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Modal content */}
            <div className="text-center mb-6">
              <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                <Users size={32} className="text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Join the TaskMind Waitlist
              </h2>
              <p className="text-gray-300">
                Be the first to experience AI-powered task automation. We'll notify you when we launch!
              </p>
            </div>

            <WaitlistForm onSuccess={() => {
              setTimeout(() => setIsOpen(false), 3000);
            }} />
          </div>
        </div>
      )}
    </>
  );
};

export default WaitlistModal;
