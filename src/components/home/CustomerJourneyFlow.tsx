import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const journeySteps = [
  {
    image: "/images/kundflode.jpg", // Placeholder - replace with actual image path
    title: "Kundflöde",
    description: "AI-receptionist fångar alla kontakter 24/7, ingen lead går förlorad"
  },
  {
    image: "/images/bokning.jpg", // Placeholder - replace with actual image path
    title: "Bokning",
    description: "Automatisk kalenderhantering med bekräftelser och påminnelser"
  },
  {
    image: "/images/forsaljning.jpg", // Placeholder - replace with actual image path
    title: "Försäljning",
    description: "AI kvalificerar leads och driver dem till avslut med smart automation"
  },
  {
    image: "/images/tidseffektivitet.jpg", // Placeholder - replace with actual image path
    title: "Tidseffektivitet",
    description: "Automatisering sparar 15+ timmar per vecka som ni kan fokusera på tillväxt"
  },
  {
    image: "/images/tillvaxt.jpg", // Placeholder - replace with actual image path
    title: "Tillväxt",
    description: "Mer tid för strategiskt arbete leder till ökad omsättning och lönsamhet"
  }
];

export const CustomerJourneyFlow = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Desktop: Horizontal flow */}
      <div className="hidden lg:grid lg:grid-cols-5 gap-6 items-start">
        {journeySteps.map((step, index) => {
          return (
            <div key={index} className="group relative">
              <Card className="h-full overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="relative aspect-square overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-xl mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                      {step.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {index < journeySteps.length - 1 && (
                <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 z-20 hidden lg:block">
                  <ArrowRight className="h-6 w-6 text-primary animate-pulse" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: Vertical flow */}
      <div className="lg:hidden space-y-6">
        {journeySteps.map((step, index) => {
          return (
            <div key={index} className="relative">
              <Card className="overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-0">
                  <div className="relative aspect-video overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 z-20 w-12 h-12 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-3 text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
              
              {index < journeySteps.length - 1 && (
                <div className="flex justify-center py-4">
                  <ArrowRight className="h-8 w-8 text-primary rotate-90 animate-pulse" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
