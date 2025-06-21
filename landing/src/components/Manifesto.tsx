
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Manifesto = () => {
  const [showContent, setShowContent] = useState(false);

  const handleAgreeClick = () => {
    setShowContent(true);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-black mb-8">
            "This feels like cheating."
          </h2>
          <Button 
            className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-lg rounded-full mb-16"
            onClick={handleAgreeClick}
          >
            We agree. <ArrowRight className="ml-2" size={20} />
          </Button>
          
          {showContent && (
            <div className="text-left max-w-3xl mx-auto space-y-6 animate-fade-in">
              <h3 className="text-4xl font-bold text-black mb-8">
                We want to outsmart everything.
              </h3>
              
              <p className="text-lg text-gray-700">
                Yep, you heard that right.
              </p>
              
              <p className="text-lg text-gray-700">
                <strong>Meetings. Tasks. Deadlines.</strong><br />
                If there's a smarter way to manage — we'll find it.
              </p>
              
              <p className="text-lg text-gray-700">
                We built <span className="bg-blue-100 px-2 py-1 rounded font-semibold">TaskMind</span> so you never have to think alone again.
              </p>
              
              <p className="text-lg text-gray-700">
                It understands your context. Captures your tasks.<br />
                Feeds you insights in real time.<br />
                While others scramble — you're already ahead.
              </p>
              
              <p className="text-lg text-gray-700">
                And yes, the world will call it <span className="bg-yellow-200 px-2 py-1 rounded font-semibold">cheating</span>.
              </p>
              
              <p className="text-lg text-gray-700">
                But so was the smartphone.<br />
                So was email.<br />
                So was the internet.
              </p>
              
              <p className="text-lg text-gray-700">
                Every time technology makes us smarter, the world panics.<br />
                Then it adapts. Then it forgets.<br />
                And suddenly, it's normal.
              </p>
              
              <h4 className="text-2xl font-bold text-black mt-12 mb-6">
                But this is different.
              </h4>
              
              <p className="text-lg text-gray-700">
                <span className="bg-blue-100 px-2 py-1 rounded font-semibold">AI</span> isn't just another tool —<br />
                It will redefine how productivity works.
              </p>
              
              <p className="text-lg text-gray-700">
                Why juggle tasks, miss deadlines, research <em>everything</em> —<br />
                when an AI can do it in seconds?
              </p>
              
              <p className="text-lg text-gray-700">
                The best organizer, the best prioritizer, the best task-manager —<br />
                is now the one who knows how to ask the right question.
              </p>
              
              <p className="text-lg text-gray-700">
                The future won't reward effort. It'll reward <span className="bg-green-200 px-2 py-1 rounded font-semibold">leverage</span>.
              </p>
              
              <h4 className="text-2xl font-bold text-black mt-12 mb-6">
                So, start outsmarting.
              </h4>
              
              <p className="text-xl font-bold text-black">
                Because when everyone does, <span className="bg-gray-200 px-2 py-1 rounded">no one is</span>.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
