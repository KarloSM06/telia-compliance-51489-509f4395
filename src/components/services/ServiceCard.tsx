import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  features?: string[];
  className?: string;
}

export function ServiceCard({ 
  title, 
  description, 
  icon: Icon, 
  href,
  features,
  className 
}: ServiceCardProps) {
  return (
    <Link to={href}>
      <Card className={cn(
        "group relative h-full p-8 overflow-hidden",
        "border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md",
        "hover:bg-card/90 hover:border-primary/30 hover:-translate-y-2",
        "hover:shadow-2xl hover:shadow-primary/20",
        "transition-all duration-500",
        className
      )}>
        {/* Glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        
        <div className="relative z-10">
          {/* Icon */}
          <div className="mb-6 inline-flex p-4 rounded-2xl bg-gradient-gold group-hover:scale-110 transition-transform duration-500 shadow-lg group-hover:shadow-glow">
            <Icon className="w-8 h-8 text-primary" />
          </div>

          {/* Content */}
          <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            {title}
          </h3>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {description}
          </p>

          {/* Features list */}
          {features && features.length > 0 && (
            <ul className="space-y-2 mb-6">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}

          {/* CTA */}
          <Button 
            variant="ghost" 
            className="group/btn w-full justify-between hover:bg-primary/10 transition-all duration-300"
          >
            <span>Läs mer</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </Card>
    </Link>
  );
}