
import { Button } from '@/components/ui/button';
import { MapPin, Clock } from 'lucide-react';

const Careers = () => {
  const jobs = [
    {
      title: "Senior AI Engineer",
      location: "Remote",
      type: "Full-time",
      description: "Lead the development of our core AI algorithms and machine learning models for screen analysis and audio processing."
    },
    {
      title: "Frontend Developer",
      location: "Remote",
      type: "Full-time",
      description: "Build beautiful, responsive user interfaces for our desktop applications and web platform."
    },
    {
      title: "DevOps Engineer",
      location: "Remote",
      type: "Full-time",
      description: "Manage our infrastructure, deployment pipelines, and ensure scalable, secure operations."
    },
    {
      title: "Product Designer",
      location: "Remote",
      type: "Contract",
      description: "Design intuitive user experiences for our AI assistant interface and onboarding flows."
    }
  ];

  return (
    <section id="careers" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Join Our Team
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Help us build the future of AI-powered assistance.
            </p>
          </div>

          <div className="bg-blue-50 rounded-2xl p-8 mb-12">
            <h3 className="text-2xl font-bold text-black mb-4">Our Culture</h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              We're a remote-first company that values innovation, transparency, and work-life balance. 
              Our team is passionate about pushing the boundaries of AI technology while maintaining 
              the highest standards of privacy and security. We believe in empowering our employees 
              to do their best work from anywhere in the world.
            </p>
          </div>

          <div className="space-y-6">
            {jobs.map((job, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-black mb-2 md:mb-0">{job.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      {job.type}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{job.description}</p>
                <Button variant="outline" className="hover:bg-gray-50">
                  Apply Now
                </Button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600">
              Don't see a role that fits? Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <Button className="mt-4 bg-black text-white hover:bg-gray-800">
              Send Resume
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Careers;
