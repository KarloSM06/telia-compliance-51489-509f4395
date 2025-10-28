import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { memo } from "react";
import type { Industry } from "@/data/industries";
interface IndustryCardProps {
  industry: Industry;
  onClick: () => void;
}
export const IndustryCard = memo(({
  industry,
  onClick
}: IndustryCardProps) => {
  const Icon = industry.icon;
  return <Card className="group h-full flex flex-col overflow-hidden cursor-pointer border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 hover:bg-card/90 hover:border-primary/40 transition-[opacity,border-color] duration-300 hover:opacity-95" style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }} onClick={onClick}>
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {industry.image ? <>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10 opacity-70 group-hover:opacity-50 transition-opacity duration-300" />
            <img 
              src={industry.image} 
              alt={industry.name} 
              loading="eager"
              decoding="sync"
              fetchPriority="high"
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:brightness-105"
            />
          </> : <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent flex items-center justify-center">
            <Icon className="h-24 w-24 text-primary/40 group-hover:text-primary/60 transition-colors duration-300" />
          </div>}
        
        {/* Icon Overlay in corner */}
        
      </div>
      
      {/* Content Section */}
      <CardHeader className="pb-3 bg-gradient-to-br from-card/5 to-transparent">
        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
          {industry.name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 pt-0">
        <CardDescription className="text-sm leading-relaxed text-muted-foreground">
          {industry.description}
        </CardDescription>
      </CardContent>
    </Card>;
});