import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { caseStudies } from "@/data/caseStudies";
export const CaseStudyShowcase = () => {
  // Use first case study
  const caseStudy = caseStudies[0];
  return <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-16">
            <div className="mb-4">
              <span className="text-xs uppercase tracking-wider text-gray-900 bg-white/60 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-full">
                Senaste Projekt
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-normal text-gray-900 mb-6">
              {caseStudy.company}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              {caseStudy.industry}
            </p>
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