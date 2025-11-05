import { motion, useReducedMotion } from "framer-motion";
import { Calendar, FileText, Settings, CheckCircle, Rocket } from "lucide-react";
import { EvervaultCard } from "@/components/ui/evervault-card";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AnimatedContainer = ({ 
  className, 
  delay = 0.1, 
  children 
}: { 
  className?: string; 
  delay?: number; 
  children: React.ReactNode 
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const WorkflowTimeline = () => {
  const steps = [
    {
      number: "1",
      title: "Gratis behovsanalys",
      subtitle: "Dag 1 – Startmöte & förväntanssättning",
      description: "Vi börjar med att förstå era behov, mål och nuvarande arbetssätt. Du får en onboarding-guide och en tydlig tidsplan för hela processen.",
      icon: Calendar,
    },
    {
      number: "2",
      title: "Offertmöte",
      subtitle: "Dag 3–5 – Insamling av kunddata",
      description: "Tillsammans går vi igenom lösningsförslaget och samlar in den information som behövs. Ni fyller i vårt onboardingformulär – och vi säkerställer ett komplett dataunderlag för implementation.",
      icon: FileText,
    },
    {
      number: "3",
      title: "Onboarding & teknisk implementation",
      subtitle: "Dag 7–14 – Konfiguration & integration",
      description: "Vi anpassar AI-receptionisten efter era behov och integrerar den med era befintliga system. Resultatet: en färdig AI-lösning redo för test.",
      icon: Settings,
    },
    {
      number: "4",
      title: "Test & justering",
      subtitle: "Dag 15 – Live-demo & feedback",
      description: "Ni får testa lösningen i realtid. Vi går igenom resultatet tillsammans och gör eventuella justeringar tills allt känns perfekt.",
      icon: CheckCircle,
    },
    {
      number: "5",
      title: "Driftstart & uppföljning",
      subtitle: "Dag 16+ – Aktiv pilot & kontinuerlig optimering",
      description: "AI-receptionisten går live! Vi följer upp efter 7 dagar, ger löpande support och optimerar systemet baserat på verklig användning.",
      icon: Rocket,
    },
  ];

  return (
    <section className="relative py-24 md:py-40">
      <div className="mx-auto w-full max-w-7xl space-y-12 px-4">
        <AnimatedContainer className="mx-auto max-w-full text-center">
          <h2 className="text-3xl font-bold tracking-wide text-balance md:text-4xl lg:text-5xl xl:font-extrabold">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Så implementerar vi AI hos dig
            </span>
          </h2>
          <p className="text-muted-foreground mt-4 text-sm tracking-wide text-balance md:text-base">
            En tydlig process – från första möte till full drift.
            <br />
            <span className="font-semibold text-foreground">Vi guidar dig steg för steg, så att du alltid vet exakt vad som händer.</span>
          </p>
        </AnimatedContainer>

        <AnimatedContainer
          delay={0.4}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <EvervaultCard key={step.number} className="aspect-auto">
                <Card className="group h-full border-0 bg-transparent hover:bg-card/50 transition-all duration-300">
                  <CardContent className="p-6 space-y-4 h-full flex flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <Badge variant="outline" className="bg-background/90 text-foreground border-primary/20">
                        Steg {step.number}
                      </Badge>
                    </div>

                    <div className="flex-1 space-y-3">
                      <h3 className="text-xl md:text-2xl font-bold text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-sm text-primary font-semibold">
                        {step.subtitle}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </EvervaultCard>
            );
          })}
        </AnimatedContainer>
      </div>
    </section>
  );
};
