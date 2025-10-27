import { CheckCircle, FileText, Settings, TestTube, Rocket } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";

const timelineSteps = [
  {
    icon: FileText,
    title: "Startmöte & förväntanssättning",
    day: "Dag 1",
    description: "Onboarding-guide och tidsplan levereras. Vi sätter förväntningar och mål tillsammans.",
    details: ["Kickoff-möte", "Projektplan", "Målsättning", "Tidsplan"]
  },
  {
    icon: CheckCircle,
    title: "Insamling av kunddata",
    day: "Dag 3-5",
    description: "Ni fyller i vårt onboarding-formulär. Vi samlar in all nödvändig information för att skräddarsy lösningen.",
    details: ["Onboarding-formulär", "Systemintegration", "Affärslogik", "Kunddata"]
  },
  {
    icon: Settings,
    title: "Teknisk implementation",
    day: "Dag 7-14",
    description: "AI-systemet konfigureras och integreras med era befintliga system. Allt testas i en säker miljö.",
    details: ["AI-konfiguration", "System-integration", "Anpassning", "Sandlåde-test"]
  },
  {
    icon: TestTube,
    title: "Test & genomgång",
    day: "Dag 15",
    description: "Live-demo för er där vi går igenom alla funktioner. Justeringar görs baserat på er feedback.",
    details: ["Live-demo", "Funktionsgenomgång", "Feedback", "Justering"]
  },
  {
    icon: Rocket,
    title: "Driftstart & uppföljning",
    day: "Dag 16+",
    description: "Systemet går live! Vi följer upp efter 7 dagar och optimerar kontinuerligt baserat på data.",
    details: ["Go-live", "7-dagars check-in", "Optimering", "Support"]
  }
];

export const OnboardingTimeline = () => {
  return (
    <AnimatedSection className="w-full">
      <div className="relative">
        {/* Desktop timeline */}
        <div className="hidden md:block">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary to-primary/50 transform -translate-y-1/2" />
          <div className="grid grid-cols-5 gap-4 relative">
            {timelineSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4 z-10 shadow-elegant">
                    <Icon className="h-6 w-6" />
                  </div>
                  <Card className="w-full">
                    <CardContent className="p-4 text-center">
                      <div className="text-xs font-semibold text-primary mb-2">{step.day}</div>
                      <h3 className="font-semibold text-sm mb-2">{step.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{step.description}</p>
                      <ul className="text-xs text-left space-y-1">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile timeline */}
        <div className="md:hidden space-y-6">
          {timelineSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="bg-primary text-primary-foreground rounded-full p-3 shadow-elegant">
                    <Icon className="h-5 w-5" />
                  </div>
                  {index < timelineSteps.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gradient-to-b from-primary to-primary/50 mt-2" />
                  )}
                </div>
                <Card className="flex-1">
                  <CardContent className="p-4">
                    <div className="text-xs font-semibold text-primary mb-2">{step.day}</div>
                    <h3 className="font-semibold text-sm mb-2">{step.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{step.description}</p>
                    <ul className="text-xs space-y-1">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
};
