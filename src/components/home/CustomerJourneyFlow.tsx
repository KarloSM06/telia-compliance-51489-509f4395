import { ArrowRight, Phone, Calendar, TrendingUp, Clock, Rocket } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";

const journeySteps = [
  {
    icon: Phone,
    title: "Kundflöde",
    description: "AI-receptionist fångar alla kontakter 24/7",
    color: "hsl(var(--primary))"
  },
  {
    icon: Calendar,
    title: "Bokning",
    description: "Automatisk kalenderhantering och bekräftelser",
    color: "hsl(210, 100%, 50%)"
  },
  {
    icon: TrendingUp,
    title: "Försäljning",
    description: "AI kvalificerar och driver leads till avslut",
    color: "hsl(142, 71%, 45%)"
  },
  {
    icon: Clock,
    title: "Tidseffektivitet",
    description: "Automatisering sparar 15+ timmar/vecka",
    color: "hsl(280, 65%, 55%)"
  },
  {
    icon: Rocket,
    title: "Tillväxt",
    description: "Mer tid för strategiskt arbete = ökad omsättning",
    color: "hsl(24, 95%, 53%)"
  }
];

export const CustomerJourneyFlow = () => {
  return (
    <AnimatedSection className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-2 items-center">
        {journeySteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 w-full">
                <div className="bg-card border rounded-lg p-6 text-center transition-all duration-300 hover:shadow-elegant hover:scale-105">
                  <div className="flex justify-center mb-3">
                    <div 
                      className="p-4 rounded-full"
                      style={{ backgroundColor: `${step.color}20` }}
                    >
                      <Icon className="h-8 w-8" style={{ color: step.color }} />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
              {index < journeySteps.length - 1 && (
                <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground flex-shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </AnimatedSection>
  );
};
