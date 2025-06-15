
import { Button } from "@/components/ui/button";

const HeroSection = () => (
  <section className="w-full bg-white py-16 md:py-24 border-b">
    <div className="max-w-3xl mx-auto px-6 text-center">
      <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-gray-900 leading-tight">
        AI-Powered Chief of Staff for Your Team
      </h1>
      <p className="text-lg md:text-xl mb-8 text-gray-600 font-medium">
        TaskMind automatically remembers every task discussed in your meetings, assigns owners, and follows up automatically.
      </p>
      <Button size="lg" className="bg-primary text-white px-8 py-4 text-lg shadow-lg hover:scale-105 hover:bg-primary/90 transition hover:shadow-xl" asChild>
        <a href="#early-access">Request Early Access</a>
      </Button>
    </div>
  </section>
);

export default HeroSection;
