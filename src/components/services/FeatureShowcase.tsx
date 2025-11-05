import { LucideIcon } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { cn } from "@/lib/utils";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface FeatureShowcaseProps {
  features: Feature[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function FeatureShowcase({ 
  features, 
  columns = 3,
  className 
}: FeatureShowcaseProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div className={cn("grid grid-cols-1 gap-8", gridCols[columns], className)}>
      {features.map((feature, index) => (
        <AnimatedSection key={index} delay={index * 100}>
          <div className="group relative h-full p-6 rounded-2xl border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:border-primary/30 hover:bg-card/90 transition-all duration-500">
            {/* Glow on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-2xl" />
            
            <div className="relative z-10">
              {/* Icon */}
              <div className="mb-4 inline-flex p-3 rounded-xl bg-gradient-gold shadow-lg group-hover:shadow-glow group-hover:scale-110 transition-all duration-500">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        </AnimatedSection>
      ))}
    </div>
  );
}