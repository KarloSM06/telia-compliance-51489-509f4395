import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { caseStudies } from "@/data/caseStudies";

export const CaseStudyShowcase = () => {
  // Use first case study
  const caseStudy = caseStudies[0];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <div className="text-center mb-12">
            <p className="text-sm text-gray-900 uppercase tracking-wider mb-2 font-medium">
              Case Study
            </p>
            <h2 className="text-4xl md:text-5xl font-display font-normal text-gray-900">
              {caseStudy.company}
            </h2>
          </div>
        </AnimatedSection>
        
        <AnimatedSection delay={200}>
          <div className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl p-12 shadow-lg">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Utmaningen</h3>
                <p className="text-gray-600 mb-6">{caseStudy.problem}</p>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Lösning</h3>
                <p className="text-gray-600 mb-6">{caseStudy.solution}</p>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">Resultat</h3>
                <ul className="space-y-2 text-gray-600">
                  {caseStudy.results.map((result, idx) => (
                    <li key={idx}>
                      <strong>{result.metric}:</strong> {result.value}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-4">
                {caseStudy.results.map((metric, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <div className="text-4xl md:text-5xl font-display font-normal text-gray-900 mb-2">
                      {metric.value}
                    </div>
                    <div className="text-gray-700">
                      {metric.metric}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
