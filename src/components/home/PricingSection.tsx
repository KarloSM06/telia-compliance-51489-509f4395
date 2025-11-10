import { AnimatedSection } from "@/components/AnimatedSection";
import { PricingCard } from "@/components/shared/PricingCard";
import { Button } from "@/components/ui/button";

interface PricingSectionProps {
  onBookDemo: () => void;
}

export const PricingSection = ({ onBookDemo }: PricingSectionProps) => {
  const plans = [
    {
      title: "Start",
      price: "Från 7 995 kr/mån",
      description: "För mindre företag som vill komma igång",
      features: [
        "Grundläggande automatisering",
        "AI-assistent för enklare processer",
        "Rapportering & support",
        "Integrationer med 2-3 verktyg",
        "Email-support"
      ],
      ctaText: "Boka genomgång",
      isPopular: false
    },
    {
      title: "Tillväxt",
      price: "Från 19 995 kr/mån",
      description: "För växande företag med större behov",
      features: [
        "Avancerad automation",
        "AI för sälj och marknadsföring",
        "Förbättrad analys och insikter",
        "Prioriterad support",
        "Obegränsade integrationer",
        "Dedikerad onboarding"
      ],
      ctaText: "Boka genomgång",
      isPopular: true
    },
    {
      title: "Enterprise",
      price: "Skräddarsydd offert",
      description: "För stora företag med specifika krav",
      features: [
        "Skräddarsydd AI-implementation",
        "Dedikerad AI-konsult",
        "Full integration i befintliga system",
        "24/7 VIP-support",
        "Custom AI-modeller",
        "On-premise deployment möjligt"
      ],
      ctaText: "Kontakta oss",
      isPopular: false
    }
  ];

  return (
    <section className="relative py-24 md:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
            Flexibla Lösningar för Olika Behov
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-2">
            Välj det paket som passar er verksamhet bäst
          </p>
          <p className="text-sm text-muted-foreground italic">
            Alla priser är startpriser. Slutligt pris baseras på era specifika behov och omfattning
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <AnimatedSection key={index} delay={index * 150}>
              <PricingCard
                title={plan.title}
                price={plan.price}
                description={plan.description}
                features={plan.features}
                ctaText={plan.ctaText}
                onCtaClick={onBookDemo}
                isPopular={plan.isPopular}
              />
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={450} className="text-center">
          <Button
            onClick={onBookDemo}
            size="lg"
            className="bg-gradient-gold text-primary font-bold shadow-button hover:shadow-glow transition-all duration-300 hover:scale-105 px-8 py-6 text-lg"
          >
            Boka en kostnadsfri genomgång
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
};
