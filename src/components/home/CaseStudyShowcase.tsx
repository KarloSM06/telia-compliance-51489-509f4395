import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { caseStudies } from "@/data/caseStudies";
import stockholmAC from "@/assets/stockholm-air-condition.png";
import bremilersVVS from "@/assets/bremilers-vvs.png";

export const CaseStudyShowcase = () => {
  // Use Stockholm AC & Bremilers case study
  const caseStudy = caseStudies.find(cs => cs.id === 'stockholm-ac-bremilers') || caseStudies[0];
  
  return <section className="relative py-12 md:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection animation="fade" duration={600}>
          <div className="text-center mb-16">
            <div className="mb-4">
              <span className="text-xs uppercase tracking-wider text-gray-900 bg-white/60 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-full">
                Senaste Projekt Vi är Stolta Över
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-normal text-gray-900 mb-6">
              {caseStudy.company}
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto mb-12">
              {caseStudy.industry}
            </p>
          </div>
        </AnimatedSection>

        {/* Client Logos Grid */}
        <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto mb-16">
          <AnimatedSection animation="fadeUp" delay={200} duration={800}>
            <div className="group relative">
              <img 
                src={stockholmAC} 
                alt="Stockholm AC" 
                className="w-full h-40 object-cover filter grayscale hover:grayscale-0 transition-all duration-300 scale-110"
                loading="lazy"
                decoding="async"
              />
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fadeUp" delay={350} duration={800}>
            <div className="group relative">
              <img 
                src={bremilersVVS} 
                alt="Bremilers VVS" 
                className="w-full h-24 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                loading="lazy"
                decoding="async"
              />
            </div>
          </AnimatedSection>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <AnimatedSection animation="fadeLeft" delay={300} duration={800}>
            <div className="border border-gray-100 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-display font-normal text-gray-900 mb-4">Problem</h3>
              <p className="text-gray-600">{caseStudy.problem}</p>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fadeRight" delay={450} duration={800}>
            <div className="border border-gray-100 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-display font-normal text-gray-900 mb-4">Lösning</h3>
              <p className="text-gray-600">{caseStudy.solution}</p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>;
};