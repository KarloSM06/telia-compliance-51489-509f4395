import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArchitecturePhase } from "@/data/architecture";
import { CheckCircle } from "lucide-react";

interface ArchitecturePhaseCardProps {
  phase: ArchitecturePhase;
  imagePosition?: "left" | "right";
}

export const ArchitecturePhaseCard = ({
  phase,
  imagePosition = "left"
}: ArchitecturePhaseCardProps) => {
  const Icon = phase.icon;
  const isLeft = imagePosition === "left";

  return (
    <Card className="group h-full overflow-hidden border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:bg-card/90 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1">
      <div className={`flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} h-full`}>
        {/* Image Section - 35% */}
        <div className="relative md:w-[35%] aspect-[4/3] md:aspect-auto overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent z-10" />
          <img 
            src={phase.image} 
            alt={phase.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-70 z-10" />
          
          {/* Icon overlay */}
          <div className="absolute bottom-6 left-6 z-20">
            <div className="w-16 h-16 rounded-2xl bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
              <Icon className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Content Section - 65% */}
        <div className="md:w-[65%] flex flex-col bg-gradient-to-br from-card/5 to-transparent">
          <CardHeader className="pb-4">
            <div className="mb-3">
              <Badge variant="outline" className="border-primary/50 text-primary">
                {phase.id.replace('-', ' ').toUpperCase()}
              </Badge>
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold group-hover:text-primary transition-colors duration-300 mb-2">
              {phase.title}
            </CardTitle>
            <CardDescription className="text-lg font-semibold text-foreground/80 mb-3">
              {phase.subtitle}
            </CardDescription>
            <CardDescription className="text-base leading-relaxed">
              {phase.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 space-y-6">
            {phase.sections.map((section, idx) => (
              <div key={idx} className="space-y-3">
                <h4 className="text-lg font-bold text-primary">{section.heading}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
                
                {/* Tools */}
                {section.tools && section.tools.length > 0 && (
                  <div className="grid grid-cols-1 gap-2 mt-3">
                    {section.tools.map((tool, toolIdx) => (
                      <div 
                        key={toolIdx} 
                        className="flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-primary/10 border border-border/50 hover:border-primary/30 transition-all duration-300 group/item"
                      >
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-background rounded-lg shadow-sm group-hover/item:shadow-md transition-shadow overflow-hidden">
                          <img 
                            src={tool.logo} 
                            alt={tool.name} 
                            className="w-7 h-7 object-contain group-hover/item:scale-110 transition-transform" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm group-hover/item:text-primary transition-colors">
                            {tool.name}
                          </p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Highlights */}
                {section.highlights && section.highlights.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {section.highlights.map((highlight, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground leading-relaxed">{highlight}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </div>
      </div>
    </Card>
  );
};
