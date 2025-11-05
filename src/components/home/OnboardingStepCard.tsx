import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface OnboardingStepCardProps {
  day: string;
  title: string;
  description: string;
  deliverable: string;
  icon: LucideIcon;
  image?: string; // Optional image URL
  stepNumber: number;
}

export const OnboardingStepCard = ({
  day,
  title,
  description,
  deliverable,
  icon: Icon,
  image,
  stepNumber
}: OnboardingStepCardProps) => {
  return (
    <Card className="group h-full overflow-hidden border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:bg-card/90 hover:border-primary/30 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
        {image ? (
          <>
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Icon className="h-24 w-24 text-primary/40 group-hover:text-primary/60 group-hover:scale-110 transition-all duration-500" />
          </div>
        )}
        
        {/* Step Number Badge */}
        <div className="absolute top-4 left-4">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <span className="text-xl font-bold text-primary-foreground">{stepNumber}</span>
          </div>
        </div>

        {/* Day Badge */}
        <div className="absolute top-4 right-4">
          <Badge className="bg-background/90 text-foreground border border-primary/20 shadow-lg">
            {day}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Deliverable */}
        <div className="pt-4 border-t border-border/50">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary" />
            <p className="text-sm font-semibold text-primary">
              {deliverable}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
