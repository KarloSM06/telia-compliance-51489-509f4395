import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { caseStudies } from "@/data/caseStudies";
export const CaseStudyShowcase = () => {
  // Use first case study
  const caseStudy = caseStudies[0];
  return <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection>
          
        </AnimatedSection>
        
        <AnimatedSection delay={200}>
          
        </AnimatedSection>
      </div>
    </section>;
};