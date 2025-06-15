
import { Check, Users, FileText, Calendar, Bell, Slack, Option, Zap } from "lucide-react";

const features = [
  {
    icon: <Zap className="text-primary" size={32} />,
    title: "Automatic Task Extraction",
    desc: "Never lose action items again. TaskMind captures every commitment in your meetings, automatically."
  },
  {
    icon: <Users className="text-primary" size={32} />,
    title: "Multi-Meeting Memory",
    desc: "Tracks follow-ups across all your weekly meetings—never ask 'who owns this?' again."
  },
  {
    icon: <Slack className="text-primary" size={32} />,
    title: "Slack & Notion Integration",
    desc: "Syncs tasks instantly to Slack channels and Notion project boards."
  },
  {
    icon: <Calendar className="text-primary" size={32} />,
    title: "Google Calendar Sync",
    desc: "Turns verbal commitments into calendar events for effortless tracking."
  },
  {
    icon: <Bell className="text-primary" size={32} />,
    title: "Manager Daily Briefings",
    desc: "Get a concise daily summary of new action items, overdue tasks, and owners—straight to your inbox."
  }
];

const FeatureSection = () => (
  <section className="w-full py-16 md:py-24 bg-gray-50 border-b">
    <div className="max-w-5xl mx-auto px-6">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-5 text-gray-900">
        Features Designed for High-Performing Teams
      </h2>
      <div className="grid md:grid-cols-3 gap-10 mt-12">
        {features.map((f, i) => (
          <div key={f.title} className="flex flex-col items-center text-center p-6 bg-white rounded-xl border shadow-none hover:shadow-xl transition">
            <div className="mb-4">{f.icon}</div>
            <h3 className="font-semibold text-xl mb-2">{f.title}</h3>
            <p className="text-base text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeatureSection;
