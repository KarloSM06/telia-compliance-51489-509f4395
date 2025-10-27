import { Phone, Calendar, TrendingUp, Clock, Rocket, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const journeySteps = [
  {
    icon: Phone,
    title: "Kundflöde",
    description: "AI-receptionist fångar alla kontakter 24/7, ingen lead går förlorad"
  },
  {
    icon: Calendar,
    title: "Bokning",
    description: "Automatisk kalenderhantering med bekräftelser och påminnelser"
  },
  {
    icon: TrendingUp,
    title: "Försäljning",
    description: "AI kvalificerar leads och driver dem till avslut med smart automation"
  },
  {
    icon: Clock,
    title: "Tidseffektivitet",
    description: "Automatisering sparar 15+ timmar per vecka som ni kan fokusera på tillväxt"
  },
  {
    icon: Rocket,
    title: "Tillväxt",
    description: "Mer tid för strategiskt arbete leder till ökad omsättning och lönsamhet"
  }
];

export const CustomerJourneyFlow = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Desktop: Horizontal flow */}
      <div className="hidden lg:flex items-center justify-between gap-4">
        {journeySteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="flex items-center flex-1">
              <Card className="flex-1 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 mx-auto p-3 bg-primary/10 rounded-lg w-fit">
                    <Icon className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
              
              {index < journeySteps.length - 1 && (
                <ArrowRight className="h-8 w-8 text-primary mx-2 flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: Vertical flow */}
      <div className="lg:hidden space-y-4">
        {journeySteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="space-y-2">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {index < journeySteps.length - 1 && (
                <div className="flex justify-center">
                  <ArrowRight className="h-8 w-8 text-primary rotate-90" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
