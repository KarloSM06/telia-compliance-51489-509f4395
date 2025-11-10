import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  ctaText: string;
  onCtaClick: () => void;
  isPopular?: boolean;
  className?: string;
}

export const PricingCard = ({ 
  title, 
  price, 
  description,
  features, 
  ctaText,
  onCtaClick,
  isPopular = false,
  className = "" 
}: PricingCardProps) => {
  return (
    <Card className={`relative border-2 border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105 ${className}`}>
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary/20 backdrop-blur-sm rounded-full px-4 py-1 border border-primary/30">
          Populär
        </Badge>
      )}
      <CardHeader className="text-center pb-4">
        <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold text-primary">{price}</span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
        <Button 
          onClick={onCtaClick}
          className="w-full bg-gradient-gold text-primary font-bold shadow-button hover:shadow-glow transition-all duration-300 hover:scale-105"
        >
          {ctaText}
        </Button>
      </CardContent>
    </Card>
  );
};
