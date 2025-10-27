import { Card, CardContent } from "@/components/ui/card";
import { Industry } from "@/data/industries";
import { useState } from "react";

interface IndustryCardProps {
  industry: Industry;
  onClick: () => void;
}

export const IndustryCard = ({ industry, onClick }: IndustryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = industry.icon;

  return (
    <Card 
      className="cursor-pointer transition-all duration-300 hover:shadow-elegant hover:scale-105 border-2 hover:border-primary"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-6 text-center space-y-3">
        <div className="flex justify-center">
          <div className={`p-4 rounded-full bg-primary/10 transition-all duration-300 ${isHovered ? 'bg-primary/20 scale-110' : ''}`}>
            <Icon className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h3 className="font-semibold text-lg">{industry.name}</h3>
        <p className="text-sm text-muted-foreground">{industry.description}</p>
      </CardContent>
    </Card>
  );
};
