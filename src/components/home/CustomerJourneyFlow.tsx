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
      <div className="hidden lg:flex items-center justify-between gap-4">
        {journeySteps.map((step, index) => {
          return (
            <div key={index} className="flex items-center flex-1">
              <Card className="flex-1 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
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
          return (
            <div key={index} className="space-y-2">
              <Card className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
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
