import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ConsultationModal } from "@/components/ConsultationModal";

export const ConsultationCTA = () => {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  return (
    <section id="kontakt" className="relative py-20 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <AnimatedSection className="text-center mb-12 lg:mb-16">
          <div className="inline-block mb-6">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Boka ett kostnadsfritt konsultmöte
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50 mt-4" />
          </div>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto font-light">
            Låt oss hjälpa dig att transformera din verksamhet med AI och automation. Fyll i formuläret så kontaktar vi dig inom kort.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <div className="max-w-2xl mx-auto border-2 border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl p-8 lg:p-12 shadow-elegant hover:border-white/20 hover:bg-white/10 transition-all duration-300">
            <div className="text-center space-y-6">
              <p className="text-lg text-primary/80">
                Fyll i dina uppgifter så kontaktar vi dig inom kort för att boka ett möte och diskutera era behov.
              </p>
              
              <Button
                size="lg"
                className="w-full bg-gradient-gold text-primary font-bold shadow-button hover:shadow-glow transition-all duration-300 hover:scale-105 text-lg py-6 group"
                onClick={() => setIsConsultationModalOpen(true)}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Boka demo & få offert
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>

      <ConsultationModal
        open={isConsultationModalOpen}
        onOpenChange={setIsConsultationModalOpen}
      />
    </section>
  );
};
