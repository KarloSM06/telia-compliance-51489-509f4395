import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    <Card className="group h-full flex flex-col overflow-hidden border-border/50 bg-card/80 hover:bg-card hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 transform-gpu will-change-transform" style={{ contain: 'layout style paint', contentVisibility: 'auto' }}>
      {/* Header with Image or Icon */}
      <div className="relative">
        {image ? (
          <div className="relative aspect-[4/3] overflow-hidden">
            <img 
              src={image} 
              alt={title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 transform-gpu"
              style={{ contain: 'layout style paint', contentVisibility: 'auto' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                console.error(`Failed to load image: ${image}`);
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-70" />
          </div>
        ) : (
          <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/20 via-primary/10 to-muted flex items-center justify-center">
            <Icon className="h-24 w-24 text-primary/40 group-hover:text-primary/60 transition-colors duration-500" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <div className="px-3 py-1.5 rounded-full bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-bold shadow-lg">
            Steg {stepNumber}
          </div>
          <div className="px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm text-foreground text-xs font-medium shadow-lg">
            {day}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 pt-0 space-y-3">
        <CardDescription className="text-sm leading-relaxed line-clamp-3">
          {description}
        </CardDescription>
        
        {deliverable && (
          <div className="pt-3 border-t border-border/50">
            <p className="text-xs font-medium text-primary mb-1 uppercase tracking-wide">Leverans</p>
            <p className="text-xs text-muted-foreground">{deliverable}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
