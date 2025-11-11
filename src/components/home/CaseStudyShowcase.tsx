import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { caseStudies } from "@/data/caseStudies";
import stockholmAC from "@/assets/stockholm-air-condition.png";
import bremilersVVS from "@/assets/bremilers-vvs.png";

export const CaseStudyShowcase = () => {
  // Use Stockholm AC & Bremilers case study
  const caseStudy = caseStudies.find(cs => cs.id === 'stockholm-ac-bremilers') || caseStudies[0];
  
  return <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-16">
            <div className="mb-4">
              <span className="text-xs uppercase tracking-wider text-gray-900 bg-white/60 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-full">
                Senaste Projekt Vi är Stolta Över
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-normal text-gray-900 mb-6">
              {caseStudy.company}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              {caseStudy.industry}
            </p>

            {/* Client Logos Grid */}
            <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto mb-16">
              <div className="group relative animate-fade-in-up">
                <div className="border border-gray-100 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <img 
                    src={stockholmAC} 
                    alt="Stockholm AC" 
                    className="w-full h-40 object-cover filter grayscale hover:grayscale-0 transition-all duration-300 scale-125"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
              <div className="group relative animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                <div className="border border-gray-100 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <img 
                    src={bremilersVVS} 
                    alt="Bremilers VVS" 
                    className="w-full h-24 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
        
        <AnimatedSection delay={200}>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-display font-normal text-gray-900 mb-4">Problem</h3>
              <p className="text-gray-600">{caseStudy.problem}</p>
            </div>
            <div>
              <h3 className="text-2xl font-display font-normal text-gray-900 mb-4">Lösning</h3>
              <p className="text-gray-600">{caseStudy.solution}</p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>;
};