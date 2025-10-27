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
      className="h-full flex flex-col hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer hover:border-primary/50 border-2"
      onClick={onClick}
    >
      <CardHeader className="text-center">
        <div className="mb-3 mx-auto p-3 bg-primary/10 rounded-lg w-fit">
          <Icon className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-xl">{industry.name}</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 text-center">
        <CardDescription className="text-sm">{industry.description}</CardDescription>
      </CardContent>
    </Card>
  );
};
