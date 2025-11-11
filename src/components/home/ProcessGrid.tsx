import { AnimatedSection } from "@/components/shared/AnimatedSection";
import IntegrationConnectionVisual from "@/components/ui/integration-connection-visual";
import ScanningAnalysisVisual from "@/components/ui/scanning-analysis-visual";
import CodeEditorVisual from "@/components/ui/code-editor-visual";
import SystemScalingVisual from "@/components/ui/system-scaling-visual";

const processSteps = [
  {
    id: 1,
    step: "Steg 1",
    title: "Smart Analysering",
    description: "Vi kartlägger era processer, identifierar flaskhalsar och hittar högvärdiga AI-möjligheter som ger snabb ROI."
  },
  {
    id: 2,
    step: "Steg 2",
    title: "AI-Utveckling",
    description: "Våra ingenjörer bygger skräddarsydda AI-agenter, automationer och datapipelines anpassade efter er verksamhet."
  },
  {
    id: 3,
    step: "Steg 3",
    title: "Integrering i Systemet",
    description: "Vi kopplar in automationen i era befintliga verktyg utan att störa den dagliga driften. Allt fungerar som ett enhetligt system."
  },
  {
    id: 4,
    step: "Steg 4",
    title: "Skalning som Lär sig med Er",
    description: "Vi mäter prestanda, förfinar processen och optimerar kontinuerligt för att säkerställa långsiktig effektivitet och tillväxt."
  }
];

export const ProcessGrid = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="text-xs uppercase tracking-wider text-gray-900 bg-white/60 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-full">
              Vår Process
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-normal text-gray-900 mb-6">
            Vår Enkla, Smarta och Skalbara Process
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Vi designar, utvecklar och implementerar automationsverktyg som hjälper er jobba smartare, inte hårdare
          </p>
        </div>
        
        {/* Process Steps Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {processSteps.map((step, index) => (
            <div 
              key={step.id}
              className="animate-[fadeInUp_0.6s_ease-out] border-2 border-white/10 bg-white/5 backdrop-blur-sm rounded-3xl p-10 md:p-12 shadow-lg hover:shadow-xl transition-all"
              style={{ animationDelay: `${index * 100}ms` }}
            >
                {/* Step Badge */}
                <div className="mb-4">
                  <span className="text-xs uppercase tracking-wider text-gray-900 bg-white/60 backdrop-blur-sm border border-gray-200 px-3 py-1 rounded-full">
                    {step.step}
                  </span>
                </div>
                
                {/* Title */}
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-display font-normal text-gray-900 mb-4">
                  {step.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 leading-relaxed mb-2">
                  {step.description}
                </p>
                
                {/* Visual Mockup Area */}
              {step.id === 1 && <ScanningAnalysisVisual />}
              {step.id === 2 && <CodeEditorVisual />}
              {step.id === 3 && <IntegrationConnectionVisual />}
              {step.id === 4 && <SystemScalingVisual />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
