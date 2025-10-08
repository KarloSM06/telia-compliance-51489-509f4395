import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Benefits } from "@/components/Benefits";
import { DashboardPreview } from "@/components/DashboardPreview";
import { TrustSection } from "@/components/TrustSection";
import { Pricing } from "@/components/Pricing";
import { CTA } from "@/components/CTA";

const Hermes = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Benefits />
        <DashboardPreview />
        <TrustSection />
        <Pricing />
        <CTA />
      </main>
    </div>
  );
};

export default Hermes;
