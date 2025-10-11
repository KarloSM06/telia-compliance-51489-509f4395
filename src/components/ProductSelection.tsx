import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Hero } from "@/components/Hero";
import { TrustSection } from "@/components/TrustSection";
import { HowItWorks } from "@/components/HowItWorks";
import { Benefits } from "@/components/Benefits";
import { Pricing } from "@/components/Pricing";
import { CTA } from "@/components/CTA";
import { QuoteModal } from "@/components/QuoteModal";
import { ArrowRight } from "lucide-react";

export const ProductSelection = () => {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const { toast } = useToast();

  return (
    <div className="relative overflow-hidden bg-background">
      <Hero />
      <TrustSection />
      
      {/* Get Quote CTA Section */}
      <section className="py-12 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Redo att förbättra era säljsamtal?
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Få en skräddarsydd offert och se hur Hiems kan hjälpa ert företag.
          </p>
          <Button 
            size="lg"
            onClick={() => setShowQuoteModal(true)}
            className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg"
          >
            Få offert
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <HowItWorks />
      <Benefits />
      <Pricing />
      <CTA />
      
      <QuoteModal open={showQuoteModal} onOpenChange={setShowQuoteModal} />
    </div>
  );
};
