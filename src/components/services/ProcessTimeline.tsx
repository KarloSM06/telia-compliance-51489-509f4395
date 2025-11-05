import { LucideIcon, ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { cn } from "@/lib/utils";

interface TimelineStep {
  title: string;
  description: string;
  icon: LucideIcon;
  duration?: string;
}

interface ProcessTimelineProps {
  steps: TimelineStep[];
  orientation?: "vertical" | "horizontal";
  className?: string;
}

export function ProcessTimeline({ 
  steps, 
  orientation = "vertical",
  className 
}: ProcessTimelineProps) {
  if (orientation === "horizontal") {
    return (
      <div className={cn("relative", className)}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <AnimatedSection key={index} delay={index * 150}>
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  {/* Icon */}
                  <div className="mb-4 p-4 rounded-2xl bg-gradient-gold shadow-lg hover:shadow-glow transition-all duration-500 hover:scale-110">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  {step.duration && (
                    <p className="text-xs text-primary font-semibold mb-2">{step.duration}</p>
                  )}
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>

                {/* Arrow (not on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-8 text-primary/30">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    );
  }

  // Vertical orientation
  return (
    <div className={cn("relative max-w-4xl mx-auto", className)}>
      {/* Vertical line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

      <div className="space-y-12">
        {steps.map((step, index) => (
          <AnimatedSection key={index} delay={index * 150}>
            <div className="relative flex gap-6">
              {/* Icon */}
              <div className="relative z-10 flex-shrink-0">
                <div className="p-4 rounded-2xl bg-gradient-gold shadow-lg hover:shadow-glow transition-all duration-500 hover:scale-110">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pt-2">
                <div className="flex items-baseline gap-3 mb-2">
                  <h3 className="font-bold text-xl">{step.title}</h3>
                  {step.duration && (
                    <span className="text-sm text-primary font-semibold">{step.duration}</span>
                  )}
                </div>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}