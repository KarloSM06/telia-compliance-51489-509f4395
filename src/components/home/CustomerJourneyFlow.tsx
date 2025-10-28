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
              <Card className="h-full overflow-hidden border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:bg-card/90 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="relative aspect-square overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10 opacity-70 group-hover:opacity-50 transition-opacity duration-500" />
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
                    />
                    <div className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-primary backdrop-blur-sm flex items-center justify-center text-white font-bold text-base shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {index + 1}
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
              <Card className="overflow-hidden border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:bg-card/90 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20">
                <CardContent className="p-0">
                  <div className="relative aspect-video overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10 opacity-70" />
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 z-20 w-14 h-14 rounded-full bg-primary backdrop-blur-sm flex items-center justify-center text-white font-bold shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-card/5 to-transparent">
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
