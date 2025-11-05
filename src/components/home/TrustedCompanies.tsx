import { AnimatedSection } from "@/components/AnimatedSection";
import bremilersLogo from "@/assets/company-logos/bremilers-logo.png";
import stockholmAirLogo from "@/assets/company-logos/stockholm-air-condition-logo.png";

interface CompanyLogo {
  id: string;
  name: string;
  logoUrl: string;
}

const companies: CompanyLogo[] = [
  { 
    id: 'bremilers', 
    name: 'Bremilers VVS AB', 
    logoUrl: bremilersLogo 
  },
  { 
    id: 'stockholm-air', 
    name: 'Stockholm Air Condition', 
    logoUrl: stockholmAirLogo 
  },
];

export const TrustedCompanies = () => {
  return (
    <section className="relative py-16 bg-gradient-to-b from-background to-primary/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <AnimatedSection className="text-center mb-10">
          <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
            Företag som litar på oss
          </p>
        </AnimatedSection>
        
        <AnimatedSection delay={100}>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
            {companies.map((company) => (
              <div 
                key={company.id}
                className="group relative flex items-center justify-center p-6 rounded-xl bg-card/30 border border-border/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-card/50 hover:border-border/40 hover:shadow-lg"
              >
                <img 
                  src={company.logoUrl} 
                  alt={company.name}
                  className="h-14 md:h-16 lg:h-20 w-auto object-contain opacity-70 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
