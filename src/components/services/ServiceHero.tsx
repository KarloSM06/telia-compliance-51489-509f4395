import { LucideIcon } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { cn } from "@/lib/utils";

interface ServiceHeroProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient?: string;
  children?: React.ReactNode;
}

export function ServiceHero({ 
  title, 
  description, 
  icon: Icon,
  gradient = "from-primary via-primary/80 to-primary/60",
  children 
}: ServiceHeroProps) {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,hsl(var(--primary)/0.15),transparent_50%)]" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <AnimatedSection className="text-center">
          {/* Icon */}
          <div className="inline-flex p-6 rounded-3xl bg-gradient-gold shadow-2xl shadow-primary/20 mb-8 animate-scale-in">
            <Icon className="w-16 h-16 text-primary" />
          </div>

          {/* Title */}
          <h1 className={cn(
            "text-5xl sm:text-6xl lg:text-7xl font-bold mb-6",
            `bg-gradient-to-r ${gradient} bg-clip-text text-transparent`
          )}>
            {title}
          </h1>

          {/* Description */}
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {description}
          </p>

          {/* Optional children (CTAs, etc) */}
          {children && (
            <div className="mt-12">
              {children}
            </div>
          )}
        </AnimatedSection>
      </div>
    </section>
  );
}