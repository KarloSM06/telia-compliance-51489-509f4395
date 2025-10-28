import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Industry } from "@/data/industries";

interface IndustryCardProps {
  industry: Industry;
  onClick: () => void;
}

export const IndustryCard = ({ industry, onClick }: IndustryCardProps) => {
  const Icon = industry.icon;
  
  return (
    <Card 
      className="group h-full flex flex-col overflow-hidden cursor-pointer border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
      onClick={onClick}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {industry.image ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
            <img 
              src={industry.image} 
              alt={industry.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Icon className="h-24 w-24 text-primary/40" />
          </div>
        )}
        
        {/* Icon Overlay */}
        <div className="absolute bottom-4 left-4 z-20 p-3 bg-background/90 backdrop-blur-sm rounded-lg shadow-lg">
          <Icon className="h-8 w-8 text-primary" />
        </div>
      </div>
      
      {/* Content Section */}
      <CardHeader className="pb-3">
        <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
          {industry.name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 pt-0">
        <CardDescription className="text-sm leading-relaxed">
          {industry.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};
