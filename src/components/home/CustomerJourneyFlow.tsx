import { PhoneIncoming, CalendarCheck, Target, Zap, Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection } from "@/components/AnimatedSection";

const journeySteps = [
  {
    image: "/images/kundflode.jpg",
    title: "Kundflöde",
    description: "AI-receptionist fångar alla kontakter 24/7, ingen lead går förlorad",
    icon: PhoneIncoming,
    step: "01"
  },
  {
    image: "/images/bokning.jpg",
    title: "Bokning",
    description: "Automatisk kalenderhantering med bekräftelser och påminnelser",
    icon: CalendarCheck,
    step: "02"
  },
  {
    image: "/images/forsaljning.jpg",
    title: "Försäljning",
    description: "AI kvalificerar leads och driver dem till avslut med smart automation",
    icon: Target,
    step: "03"
  },
  {
    image: "/images/tidseffektivitet.jpg",
    title: "Tidseffektivitet",
    description: "Automatisering sparar 15+ timmar per vecka som ni kan fokusera på tillväxt",
    icon: Zap,
    step: "04"
  },
  {
    image: "/images/tillvaxt.jpg",
    title: "Tillväxt",
    description: "Mer tid för strategiskt arbete leder till ökad omsättning och lönsamhet",
    icon: Rocket,
    step: "05"
  }
];

export const CustomerJourneyFlow = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Grid Layout - Responsive and Symmetrical */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {journeySteps.map((step, index) => (
          <AnimatedSection 
            key={index} 
            delay={index * 150}
            direction="up"
          >
            <Card className="group h-full overflow-hidden border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:bg-card/90 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
              <CardContent className="p-0 flex flex-col h-full">
                <div className="relative aspect-square overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10 opacity-70 group-hover:opacity-50 transition-opacity duration-500" />
                  <img 
                    src={step.image} 
                    alt={step.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
                  />
                  {/* Step number badge - bottom left */}
                  <div className="absolute bottom-4 left-4 z-20 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-primary/20 shadow-lg">
                    <span className="text-xs font-mono font-semibold text-primary">{step.step}</span>
                  </div>
                  {/* Icon - top right */}
                  <div className="absolute top-4 right-4 z-20 w-12 h-12 rounded-xl bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                    <step.icon className="w-6 h-6 text-primary-foreground" strokeWidth={2} />
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1 bg-gradient-to-br from-card/5 to-transparent">
                  <h3 className="font-bold text-xl mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {step.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
};
