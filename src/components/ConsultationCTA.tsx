import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ConsultationModal } from "@/components/ConsultationModal";

export const ConsultationCTA = () => {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  return (
    <section id="kontakt" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <AnimatedSection className="text-center mb-16 lg:mb-20">
          <div className="inline-block mb-8">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              Redo att transformera er verksamhet?
            </h2>
            <div className="w-40 h-2 bg-gradient-accent mx-auto rounded-full shadow-glow mt-6" />
          </div>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto font-light leading-relaxed">
            Boka ett kostnadsfritt konsultmöte och upptäck hur AI kan accelerera er tillväxt
          </p>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-card/60 via-card/40 to-card/20 backdrop-blur-xl border border-accent/20 rounded-3xl p-10 lg:p-14 shadow-elegant">
            {/* Trust Signals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border/50">
                <CheckCircle className="w-6 h-6 text-accent flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">Ingen bindningstid</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border/50">
                <CheckCircle className="w-6 h-6 text-accent flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">30 dagars garanti</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border/50">
                <CheckCircle className="w-6 h-6 text-accent flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">Gratis konsultation</span>
              </div>
            </div>

            <div className="text-center space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Fyll i dina uppgifter så kontaktar vi dig inom kort för att boka ett möte och diskutera era unika behov.
              </p>
              
              <Button
                size="lg"
                className="w-full h-16 bg-gradient-accent hover:opacity-90 text-white font-bold shadow-button hover:shadow-glow transition-all duration-300 hover:scale-105 text-xl group"
                onClick={() => setIsConsultationModalOpen(true)}
              >
                <Calendar className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                Boka demo & få offert
              </Button>

              <p className="text-sm text-muted-foreground">
                Svarstid: Inom 24 timmar
              </p>
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
