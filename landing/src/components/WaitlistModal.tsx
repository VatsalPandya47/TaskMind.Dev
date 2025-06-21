
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
    <Button size="lg" className="bg-black text-white hover:bg-gray-800 text-lg px-8 py-4">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            {/* Modal content */}
            <div className="text-center mb-6">
              <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-black mb-2">
                Join the TaskMind Waitlist
              </h2>
              <p className="text-gray-600">
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
