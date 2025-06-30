import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Users, Target, Award, Heart, Mail } from 'lucide-react';

const About = () => {
  const team = [
    {
      name: "Vatsal Pandya",
      role: "CEO & Founder",
      email: "vatsalpandya@taskmind.dev",
      bio: "Ex-Opendorse & Ameritas engineer with experience building full-stack AI products, LLM-powered assistants, and scalable SaaS platforms.",
      image: "/lovable-uploads/d57b9329-fe9c-4611-8a16-999ba54b0ccf.png"
    },
    {
      name: "Gurvinder Singh",
      role: "Co-Founder",
      email: "gurvinder@taskmind.dev",
      bio: "Ex-Guru.com & Systematix engineer with 5+ years of experience in full-stack web development. Skilled in React, Vue.js, Next.js, and advanced UI systems — from architecture to deployment.",
      image: "/lovable-uploads/403e0810-da5a-4a9e-83e6-024d456dbb62.png"
    },
    {
      name: "Dajie Qiu",
      role: "Founding Engineer", 
      email: "dajie@taskmind.dev",
      bio: "Ex-DPA Auctions · CS Junior @ UNL. Skilled in React, Java, and SQL — has built asset managers, e-commerce apps, and sales systems with a strong focus on clean UI, agile teamwork, and scalable front-end solutions.",
      image: "/lovable-uploads/b2db4ec8-3804-4803-90a7-47acc95014da.png"
    },
    {
      name: "Kashish Syed",
      role: "Founding Engineer",
      email: "kashish@taskmind.dev", 
      bio: "Ex-Marble Technologies & Nelnet Capstone Lead. Full-stack developer skilled in React, Vue, C#.NET — passionate about building scalable, user-first web experiences.",
      image: "/lovable-uploads/ededcbec-86b2-452c-b225-ebd173b9aeef.png"
    },
    {
      name: "Tyler Frisinger",
      role: "Founding Engineer",
      email: "tyler@taskmind.dev",
      bio: "Ex Software Engineering Intern @ North Star Imaging · Ex-TA @ UNL. Skilled in React, C#, .NET, and backend systems. Loves shipping fast, clean, scalable features.",
      image: "/lovable-uploads/792d320c-2bbf-4c10-9c7a-a7ee3f0420df.png"
    },
    {
      name: "Thang Do",
      role: "Founding Engineer",
      email: "thang@taskmind.dev",
      bio: "Ex Learning Assistant @ UNL · CS Major with Math Minor. Skilled in Python, Java, JavaScript, and Node.js — passionate about building scalable backend systems and growing as a full-stack engineer.",
      image: "/lovable-uploads/ebce9bdb-d0b2-44d6-8e27-118ecced2922.png"
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Focus on Impact",
      description: "We believe technology should amplify human potential, not create more complexity."
    },
    {
      icon: Users,
      title: "Team-First",
      description: "Great work happens when teams can collaborate seamlessly without friction."
    },
    {
      icon: Award,
      title: "Quality Excellence",
      description: "We obsess over the details to deliver products that teams love to use every day."
    },
    {
      icon: Heart,
      title: "Customer Success",
      description: "Our success is measured by how much time and stress we save our customers."
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
              About TaskMind
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              We're on a mission to eliminate the productivity tax that plagues modern teams. 
              Too many great ideas and commitments get lost in the chaos of meetings, messages, 
              and daily work. TaskMind ensures nothing falls through the cracks.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">Our Story</h2>
            <div className="prose prose-lg mx-auto text-gray-300">
              <p className="text-xl leading-relaxed mb-6">
                TaskMind was born from a frustrating reality we all know too well: the best intentions 
                from meetings turning into forgotten commitments. After watching countless teams struggle 
                with dropped tasks and missed follow-ups, we realized there had to be a better way.
              </p>
              <p className="text-xl leading-relaxed mb-6">
                Traditional task management tools put the burden on humans to remember, organize, and 
                follow up. But what if AI could do the heavy lifting? What if your computer could 
                attend every meeting, extract every commitment, and gently remind everyone what needs 
                to be done?
              </p>
              <p className="text-xl leading-relaxed">
                That's the future we're building. A world where great ideas become great outcomes, 
                where team commitments are automatically tracked, and where nothing important ever 
                gets forgotten again.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-16 text-center">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center">
                  <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
                    <value.icon size={32} className="text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{value.title}</h3>
                  <p className="text-gray-300">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-16 text-center">Meet the Team</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {team.map((member, index) => (
                <div key={index} className="text-center bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-700/50 hover:shadow-2xl transition-all duration-300">
                  {member.image ? (
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-purple-500/30"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm flex items-center justify-center border border-purple-500/30">
                      <Users size={32} className="text-purple-400" />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-white mb-2">{member.name}</h3>
                  <p className="text-purple-400 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-300 text-sm mb-4">{member.bio}</p>
                  <a 
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm"
                  >
                    <Mail size={14} />
                    {member.email}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
