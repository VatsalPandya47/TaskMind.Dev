
import { ZoomIn, Slack, Calendar, Users, Link2 } from "lucide-react";

const integrations = [
  { name: "Zoom", icon: <ZoomIn className="text-blue-500" size={28} /> },
  { name: "Google Meet", icon: <Users className="text-green-600" size={28} /> },
  { name: "Microsoft Teams", icon: <Users className="text-blue-700" size={28} /> },
  { name: "Slack", icon: <Slack className="text-blue-600" size={28} /> },
  { name: "Notion", icon: <Link2 className="text-black" size={28} /> },
  { name: "Google Calendar", icon: <Calendar className="text-purple-600" size={28} /> },
];

const IntegrationsSection = () => (
  <section className="w-full bg-gray-50 py-14 md:py-20 border-b">
    <div className="max-w-4xl mx-auto px-6">
      <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8 text-gray-900">Seamless Integrations</h2>
      <div className="flex flex-wrap gap-6 justify-center items-center">
        {integrations.map(intg => (
          <div key={intg.name} className="flex flex-col items-center gap-1">
            <div className="bg-white p-4 rounded-xl border">{intg.icon}</div>
            <span className="text-base font-medium text-gray-700">{intg.name}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default IntegrationsSection;
