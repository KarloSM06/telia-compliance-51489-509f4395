import { Shield, Code, TrendingUp, Users } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ConsultationModal } from "@/components/ConsultationModal";

export function ValueProposition() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const values = [
    {
      icon: Shield,
      title: "Full äganderätt",
      description: "Du äger all kod, data och hela lösningen. Ingen inlåsning, total kontroll över din digitala tillgång."
    },
    {
      icon: Code,
      title: "Modern teknologi",
      description: "Vi bygger med React, TypeScript och Supabase – samma stack som vi använder för Hiems-plattformen."
    },
    {
      icon: TrendingUp,
      title: "Mätbar ROI",
      description: "Alla våra lösningar är byggda för att leverera mätbara resultat från dag ett med inbyggd analytics."
    },
    {
      icon: Users,
      title: "Långsiktigt partnerskap",
      description: "Vi försvinner inte efter lansering – vi finns här för support, vidareutveckling och strategisk rådgivning."
    }
  ];

  return (
    <>
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_60%,hsl(var(--primary)/0.15),transparent_50%)]" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-block">
              <h2 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
                Varför välja Hiems?
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50" />
            </div>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mt-6 font-light">
              Vi bygger inte bara lösningar – vi skapar digitala tillgångar som du äger och kontrollerar
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {values.map((value, index) => (
              <AnimatedSection key={value.title} delay={index * 150}>
                <div className="group h-full p-8 rounded-2xl border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:border-primary/30 hover:bg-card/90 transition-all duration-500">
                  <div className="flex items-start gap-4">
                    <div className="p-4 rounded-xl bg-gradient-gold shadow-lg group-hover:shadow-glow group-hover:scale-110 transition-all duration-500">
                      <value.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-3 text-foreground">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="text-center" delay={400}>
            <div className="inline-flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-gradient-gold text-primary hover:shadow-glow transition-all duration-300 font-semibold text-lg px-8"
                onClick={() => setIsModalOpen(true)}
              >
                Boka kostnadsfri konsultation
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-primary/30 hover:bg-primary/10 transition-all duration-300 font-semibold text-lg px-8"
                onClick={() => window.location.href = '/tjanster'}
              >
                Se alla tjänster
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <ConsultationModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />
    </>
  );
}