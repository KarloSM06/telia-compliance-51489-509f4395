import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Industry } from "@/data/industries";
interface IndustryCardProps {
  industry: Industry;
  onClick: () => void;
}
export const IndustryCard = ({
  industry,
  onClick
}: IndustryCardProps) => {
  const Icon = industry.icon;
  return <Card className="group h-full flex flex-col overflow-hidden cursor-pointer border-border/50 bg-card/80 hover:bg-card hover:border-primary/40 transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 transform-gpu will-change-transform" style={{ contain: 'layout' }} onClick={onClick}>
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {industry.image ? <img src={industry.image} alt={industry.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 transform-gpu" /> : <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-muted flex items-center justify-center">
            <Icon className="h-20 w-20 text-primary/30 group-hover:text-primary/50 transition-colors duration-300" />
          </div>}
        
        {/* Icon Badge */}
        
      </div>
      
      {/* Content Section */}
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors duration-300">
          {industry.name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 pt-0">
        <CardDescription className="text-sm leading-relaxed">
          {industry.description}
        </CardDescription>
      </CardContent>
    </Card>;
};