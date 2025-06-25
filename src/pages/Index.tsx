import Header from '@/components/Header';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import Integrations from '@/components/Integrations';
import Pricing from '@/components/Pricing';
import Roadmap from '@/components/Roadmap';
import Manifesto from '@/components/Manifesto';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <HowItWorks />
      <Features />
      <Integrations />
      <Pricing />
      <Roadmap />
      <Manifesto />
      <FAQ />
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;
