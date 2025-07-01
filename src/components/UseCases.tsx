import { useState } from 'react';

const UseCases = () => {
  const [activeUseCase, setActiveUseCase] = useState(0);

  const useCases = [
    {
      title: "Sees What You See",
      description: "Monitor competitor pricing, analyze documents, and get instant insights on any content displayed on your screen.",
      category: "Screen Monitoring",
      mockup: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
    },
    {
      title: "Hears What You Hear",
      description: "Listen to sales calls, meetings, and conversations to provide real-time coaching and relevant information.",
      category: "Audio Analysis",
      mockup: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&h=400&fit=crop"
    },
    {
      title: "Answers Anything",
      description: "Get instant answers to complex questions based on your current context and conversation history.",
      category: "Intelligent Assistance",
      mockup: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop"
    },
    {
      title: "Invisible to Screen-Share",
      description: "Operate completely undetected during screen sharing sessions and video calls.",
      category: "Stealth Mode",
      mockup: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600&h=400&fit=crop"
    },
    {
      title: "Follow Your Eyes",
      description: "Track your focus and attention to provide contextual assistance for the content you're actively viewing.",
      category: "Eye Tracking",
      mockup: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop"
    }
  ];

  return (
    <section id="use-cases" className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
            Use Cases
          </h2>
          <p className="text-xl text-gray-300">
            Discover how our AI assistant adapts to different scenarios and workflows.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {useCases.map((useCase, index) => (
            <div key={index} className={`flex flex-col lg:flex-row items-center gap-12 mb-20 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="lg:w-1/2">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700/50 hover:shadow-2xl transition-all duration-300">
                  <span className="text-sm font-medium text-purple-400 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-400/30">
                    {useCase.category}
                  </span>
                  <h3 className="text-3xl font-bold text-white mt-4 mb-4">{useCase.title}</h3>
                  <p className="text-lg text-gray-300 leading-relaxed">{useCase.description}</p>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="relative">
                  <img 
                    src={useCase.mockup} 
                    alt={useCase.title}
                    className="w-full rounded-2xl shadow-lg"
                  />
                  <div className="absolute inset-0 bg-purple-600/10 rounded-2xl"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
