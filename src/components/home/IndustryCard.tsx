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
  return <Card className="group h-full flex flex-col overflow-hidden cursor-pointer border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:bg-card/90 hover:border-primary/30 hover:-translate-y-1 hover:shadow-2xl transition-all duration-500" onClick={onClick}>
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {industry.image ? <>
            <img src={industry.image} alt={industry.name} decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/20 to-transparent transition-opacity duration-500 group-hover:opacity-70" />
          </> : <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-muted flex items-center justify-center">
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