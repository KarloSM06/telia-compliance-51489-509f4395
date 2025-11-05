import { AnimatedSection } from "@/components/AnimatedSection";
import bremlersLogo from "@/assets/company-logos/bremilers-logo.png";
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
    logoUrl: bremlersLogo 
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
        <AnimatedSection className="text-center mb-12">
          <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
            Företag som litar på oss
          </p>
        </AnimatedSection>
        
        <AnimatedSection delay={100}>
          {/* Static grid - enkelt att konvertera till carousel senare */}
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-16">
            {companies.map((company) => (
              <div
                key={company.id}
                className="group relative"
              >
                <div className="bg-card/30 backdrop-blur-sm border border-border/20 rounded-lg p-6 lg:p-8 transition-all duration-300 hover:bg-card/50 hover:border-border/40 hover:scale-105">
                  <img
                    src={company.logoUrl}
                    alt={`${company.name} logotyp`}
                    className="h-12 lg:h-16 w-auto object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
