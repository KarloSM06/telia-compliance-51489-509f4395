import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import type { ArchitecturePhase } from "@/data/architecture";

interface ArchitecturePhaseCardProps {
  phase: ArchitecturePhase;
  imagePosition?: 'left' | 'right';
}

export const ArchitecturePhaseCard = ({
  phase,
  imagePosition = 'left'
}: ArchitecturePhaseCardProps) => {
  const Icon = phase.icon;
  const isImageLeft = imagePosition === 'left';

  return (
    <Card className="flex flex-col lg:flex-row overflow-hidden border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:bg-card/90 hover:border-primary/30 hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 group">
      {/* Image Section */}
      <div className={`lg:w-2/5 relative overflow-hidden flex-shrink-0 ${isImageLeft ? 'lg:order-1' : 'lg:order-2'}`}>
        <img 
          src={phase.image} 
          alt={phase.title} 
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/20 to-transparent transition-opacity duration-500 group-hover:opacity-70" />
        
        {/* Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-background/90 backdrop-blur-sm rounded-full p-6 shadow-2xl group-hover:scale-110 transition-transform duration-500">
            <Icon className="h-16 w-16 text-primary" />
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className={`flex-1 flex flex-col ${isImageLeft ? 'lg:order-2' : 'lg:order-1'}`}>
        <CardContent className="flex-1 p-8 lg:p-12 space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <Badge className="text-base px-4 py-1">{phase.badge}</Badge>
            <h3 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              {phase.title}
            </h3>
            <p className="text-xl text-primary/70 font-semibold">
              {phase.subtitle}
            </p>
          </div>
          
          {/* Description */}
          <div className="space-y-4">
            {phase.description.map((paragraph, index) => (
              <p key={index} className="text-base leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Subsections */}
          <div className="space-y-6 pt-4">
            {phase.subsections.map((subsection, index) => (
              <div key={index} className="space-y-3">
                <h4 className="text-lg font-semibold text-foreground">
                  {subsection.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {subsection.description}
                </p>

                {/* Tools/Items */}
                {subsection.items && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {subsection.items.map((item, itemIndex) => (
                      <div 
                        key={itemIndex} 
                        className="flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors group/item"
                      >
                        {item.logo && (
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white p-1.5 flex items-center justify-center">
                            <img 
                              src={item.logo} 
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Highlights */}
                {subsection.highlights && (
                  <div className="space-y-2">
                    {subsection.highlights.map((highlight, highlightIndex) => (
                      <div key={highlightIndex} className="flex items-start gap-2 group/item">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                        <span className="text-sm text-foreground/90">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
