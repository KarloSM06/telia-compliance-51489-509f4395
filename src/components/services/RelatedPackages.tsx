import { aiPackages, type Package } from "@/data/packages";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

interface RelatedPackagesProps {
  serviceId: string;
  onBookDemo: () => void;
}

// Mapping av tjänster till relevanta paket
const serviceToPackages: Record<string, string[]> = {
  'ai-receptionist': ['growth-sales', 'service-operations'],
  'crm-analytics': ['growth-sales', 'data-insight'],
  'automations': ['marketing-automation', 'service-operations'],
  'quote-invoice': ['service-operations', 'ecommerce-retail'],
  'ai-models': ['ecommerce-retail', 'data-insight'],
  'ecosystems': ['enterprise-custom'],
  'ai-voice': ['growth-sales', 'service-operations'],
  'prompt-engineering': ['marketing-automation', 'data-insight'],
  'rag-agents': ['data-insight', 'enterprise-custom'],
};

export const RelatedPackages = ({ serviceId, onBookDemo }: RelatedPackagesProps) => {
  const relatedPackageIds = serviceToPackages[serviceId] || [];
  const relatedPackages = aiPackages.filter(pkg => relatedPackageIds.includes(pkg.id));

  if (relatedPackages.length === 0) return null;

  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <div className="inline-block">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
              Relaterade AI-paket
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50" />
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
            Dessa paket inkluderar denna tjänst och kan passa just ditt företag
          </p>
        </AnimatedSection>

        <div className="space-y-8">
          {relatedPackages.map((pkg, index) => (
            <AnimatedSection key={pkg.id} delay={index * 150}>
              <PackageDetailCard package={pkg} onBookDemo={onBookDemo} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

interface PackageDetailCardProps {
  package: Package;
  onBookDemo: () => void;
}

const PackageDetailCard = ({ package: pkg, onBookDemo }: PackageDetailCardProps) => {
  const Icon = pkg.icon;
  
  // Combine all features
  const allFeatures = [
    ...(pkg.components || []),
    ...(pkg.valueBullets || [])
  ];

  return (
    <Card className="group overflow-hidden border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:bg-card/90 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 transform-gpu">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row gap-0">
          {/* Bild sektion */}
          <div className="relative lg:w-2/5 aspect-[16/10] lg:aspect-auto overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
            {pkg.image ? (
              <img 
                src={pkg.image} 
                alt={pkg.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 transform-gpu"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon className="h-40 w-40 text-primary/20 group-hover:text-primary/40 transition-colors duration-500" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/30 to-transparent" />
          </div>

          {/* Content sektion */}
          <div className="flex-1 p-8 lg:p-12 flex flex-col">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-4 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <Icon className="h-10 w-10" />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl lg:text-4xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
                  {pkg.name}
                </h3>
                <p className="text-base text-muted-foreground font-medium">
                  {pkg.targetAudience}
                </p>
              </div>
            </div>

            {pkg.tagline && (
              <p className="text-xl text-foreground/80 mb-6 font-light">
                {pkg.tagline}
              </p>
            )}

            {pkg.description && (
              <p className="text-base text-muted-foreground mb-8">
                {pkg.description}
              </p>
            )}

            {/* Features grid */}
            <div className="grid sm:grid-cols-2 gap-3 mb-8 flex-1">
              {allFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div>
              <Button
                onClick={onBookDemo}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-primary/50 transition-all duration-300 px-8"
              >
                Boka kostnadsfri demo
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
