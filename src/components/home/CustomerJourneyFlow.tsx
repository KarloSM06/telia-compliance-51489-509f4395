import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
      {/* Bento Grid Layout - More Dynamic */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 auto-rows-fr">
        {journeySteps.map((step, index) => {
          // Make first and last cards larger
          const isLarge = index === 0 || index === 4;
          
          return (
            <Card 
              key={index} 
              className={cn(
                "group overflow-hidden border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:bg-card/90 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 transform-gpu will-change-transform",
                isLarge ? "md:col-span-2 lg:col-span-2" : "md:col-span-1 lg:col-span-1"
              )}
              style={{ 
                contain: 'layout style paint',
                contentVisibility: 'auto'
              }}
            >
              <CardContent className="p-0 flex flex-col h-full">
                {/* Image Section with Optimized Loading */}
                <div className="relative aspect-square overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10 opacity-70 group-hover:opacity-50 transition-opacity duration-500" />
                  
                  {/* Optimized Image */}
                  <img 
                    src={step.image} 
                    alt={step.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 transform-gpu"
                    style={{
                      contain: 'layout style paint',
                      contentVisibility: 'auto'
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      console.error(`Failed to load image: ${step.image}`);
                    }}
                  />
                  
                  {/* Step Number Badge */}
                  <div className="absolute top-4 right-4 z-20 w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                    {index + 1}
                  </div>
                </div>
                
                {/* Content Section */}
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
          );
        })}
      </div>
    </div>
  );
};
