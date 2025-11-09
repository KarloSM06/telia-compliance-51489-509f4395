import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { DemoBooking } from "@/components/DemoBooking";

export const ConsultationCTA = () => {

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
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
          <div className="max-w-2xl mx-auto bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 lg:p-12 shadow-xl">
            <div className="text-center space-y-6">
              <p className="text-lg text-muted-foreground">
                Fyll i dina uppgifter så kontaktar vi dig inom kort för att boka ett möte och diskutera era behov.
              </p>
              
              <DemoBooking>
                <Button
                  size="lg"
                  className="w-full bg-gradient-gold text-primary font-bold shadow-button hover:shadow-glow transition-all duration-300 hover:scale-105 text-lg py-6 group"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Boka demo & få offert
                </Button>
              </DemoBooking>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
