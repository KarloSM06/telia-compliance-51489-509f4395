import { AnimatedSection } from "@/components/AnimatedSection";
import { FeatureCard } from "@/components/shared/FeatureCard";
import { TrendingUp, DollarSign, Clock, BarChart3, Rocket, Heart } from "lucide-react";

export const WhyHiemsSection = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Högre produktivitet",
      description: "Automatisera repetitiva uppgifter och frigör tid för strategiskt arbete som driver tillväxt."
    },
    {
      icon: DollarSign,
      title: "Lägre kostnader",
      description: "Minska manuellt arbete och operativa kostnader med upp till 60% genom intelligent automation."
    },
    {
      icon: Clock,
      title: "24/7 tillgänglighet",
      description: "AI-agenter som aldrig sover – ge dina kunder support och service dygnet runt, året om."
    },
    {
      icon: BarChart3,
      title: "Datadrivna beslut",
      description: "Få insikter i realtid från alla dina system och fatta snabbare, smartare beslut."
    },
    {
      icon: Rocket,
      title: "Skalbarhet och tillväxt",
      description: "Väx utan att öka personalkostnader – AI-lösningar som skalar med din verksamhet."
    },
    {
      icon: Heart,
      title: "Bättre kundupplevelser",
      description: "Snabbare svarstider, personlig service och nöjdare kunder som kommer tillbaka."
    }
  ];

  return (
    <section className="relative py-24 md:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
            Varför Välja Hiems
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            AI är inte bara ett verktyg – det är framtidens infrastruktur
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <AnimatedSection key={index} delay={index * 100}>
              <FeatureCard
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
              />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};
