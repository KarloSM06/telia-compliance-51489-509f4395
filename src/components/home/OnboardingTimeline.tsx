import { Calendar, FileText, Settings, CheckCircle, Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const onboardingSteps = [
  {
    day: "Dag 1",
    title: "Startmöte & förväntanssättning",
    description: "Vi träffas för att förstå era behov och mål",
    deliverable: "Onboarding-guide + tidsplan levereras",
    icon: Calendar
  },
  {
    day: "Dag 3-5",
    title: "Insamling av kunddata",
    description: "Ni fyller i onboardingformulär och delar nödvändig information",
    deliverable: "Komplett dataunderlag för implementation",
    icon: FileText
  },
  {
    day: "Dag 7-14",
    title: "Teknisk implementation",
    description: "Vi konfigurerar AI-receptionist och integrerar med era befintliga system",
    deliverable: "Färdig AI-lösning redo för test",
    icon: Settings
  },
  {
    day: "Dag 15",
    title: "Test & genomgång",
    description: "Live-demo för er organisation och justering baserat på feedback",
    deliverable: "Godkänd lösning redo för driftstart",
    icon: CheckCircle
  },
  {
    day: "Dag 16+",
    title: "Driftstart & uppföljning",
    description: "Aktiv pilot startar med kontinuerlig support och optimering",
    deliverable: "7-dagars check-in + löpande förbättringar",
    icon: Rocket
  }
];

export const OnboardingTimeline = () => {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Desktop: Horizontal stepper */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* Progress line */}
          <div className="absolute top-16 left-0 right-0 h-1 bg-primary/20" />
          
          <div className="relative flex justify-between">
            {onboardingSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex flex-col items-center w-1/5">
                  <div className="relative z-10 mb-4">
                    <div className="p-4 bg-primary rounded-full shadow-lg">
                      <Icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                  </div>
                  
                  <Badge variant="secondary" className="mb-2">{step.day}</Badge>
                  
                  <Card className="w-full border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:bg-card/90 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-500 mt-4">
                    <CardContent className="p-5 text-center">
                      <h3 className="font-bold text-base mb-2">{step.title}</h3>
                      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{step.description}</p>
                      <div className="pt-3 border-t border-primary/20">
                        <p className="text-xs font-semibold text-primary">{step.deliverable}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: Vertical timeline */}
      <div className="lg:hidden space-y-6">
        {onboardingSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="p-3 bg-primary rounded-full shadow-lg">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                {index < onboardingSteps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-primary/20 mt-2" />
                )}
              </div>
              
              <div className="flex-1 pb-6">
                <Badge variant="secondary" className="mb-2">{step.day}</Badge>
                <Card className="border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:bg-card/90 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500">
                  <CardContent className="p-5">
                    <h3 className="font-bold text-base mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{step.description}</p>
                    <div className="pt-3 border-t border-primary/20">
                      <p className="text-sm font-semibold text-primary">{step.deliverable}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
