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
    <section className="relative py-20 border-y border-border/10">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Rubrik */}
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-base lg:text-lg text-foreground/80 font-medium tracking-wide">
            Företag som litar på oss
          </h2>
        </AnimatedSection>
        
        {/* Symmetrisk logo-grid */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 lg:gap-12">
          {companies.map((company, index) => (
            <AnimatedSection 
              key={company.id} 
              delay={index * 100}
              className="w-full max-w-sm md:w-[280px] lg:w-[320px]"
            >
              <div className="group relative h-32 lg:h-36 flex items-center justify-center
                            border-2 border-border/20 rounded-xl p-8 lg:p-10
                            bg-card/5 hover:bg-card/10
                            hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5
                            hover:-translate-y-1
                            transition-all duration-500 ease-out">
                <img
                  src={company.logoUrl}
                  alt={`${company.name} logotyp`}
                  className="max-w-full max-h-full object-contain transition-all duration-500"
                />
              </div>
            </AnimatedSection>
          ))}
        </div>
        
      </div>
    </section>
  );
};
