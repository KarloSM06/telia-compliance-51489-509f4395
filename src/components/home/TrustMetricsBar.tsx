import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { Phone, Building2, ThumbsUp, Clock } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";

export const TrustMetricsBar = () => {
  const metrics = [
    {
      icon: Phone,
      value: 2000,
      suffix: "+",
      label: "Samtal hanterade"
    },
    {
      icon: Building2,
      value: 50,
      suffix: "+",
      label: "Företag betjänade"
    },
    {
      icon: ThumbsUp,
      value: 95,
      suffix: "%",
      label: "Kundnöjdhet"
    },
    {
      icon: Clock,
      value: 24,
      suffix: "/7",
      label: "Tillgänglighet"
    }
  ];

  return (
    <section className="relative py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <AnimatedSection>
          <div className="border-2 border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-elegant">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {metrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div key={index} className="text-center space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-foreground">
                      <AnimatedCounter 
                        value={metric.value} 
                        suffix={metric.suffix}
                        duration={2500}
                      />
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {metric.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
