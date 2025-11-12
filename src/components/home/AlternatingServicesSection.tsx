import { Suspense, lazy, useEffect, useState } from "react";
import { Phone, MessageSquare, Mail, Star } from "lucide-react";
import { cn } from "@/lib/utils";

// Lazy load visualizations för bättre performance
const DatabaseWithRestApi = lazy(() => import("@/components/ui/database-with-rest-api"));
const CpuArchitecture = lazy(() => import("@/components/ui/cpu-architecture").then(m => ({
  default: m.CpuArchitecture
})));
const WorkflowChecklistVisual = lazy(() => import("@/components/ui/workflow-checklist-visual").then(m => ({
  default: m.WorkflowChecklistVisual
})));
const AIVoiceAgentVisual = lazy(() => import("@/components/ui/ai-voice-agent-visual").then(m => ({
  default: m.AIVoiceAgentVisual
})));
const EmailBriefingVisual = lazy(() => import("@/components/ui/email-briefing-visual").then(m => ({
  default: m.EmailBriefingVisual
})));
const ProjectManagementVisual = lazy(() => import("@/components/ui/project-management-visual").then(m => ({
  default: m.ProjectManagementVisual
})));
const AIVoiceInput = lazy(() => import("@/components/ui/ai-voice-input").then(m => ({
  default: m.AIVoiceInput
})));
const servicesData = [{
  id: 1,
  category: "Our Services",
  title: "Dashboards & Decision Intelligence",
  description: "Få live-insikter, prognoser och KPI:er i realtid från alla era system. Gör data begriplig så att teamet kan agera direkt.",
  bullets: ["Realtids KPI-tavlor", "Prediktiv analys", "Automatiserad rapportering", "Anpassade dataintegrationer"],
  isReversed: false
}, {
  id: 2,
  category: "Workflow Automation",
  title: "Automate repetitive tasks",
  description: "Eliminera manuella moment som fakturering, mejl-uppföljning och rapportering. Effektivare processer, färre fel och mer tid för tillväxt.",
  bullets: ["Automatisk fakturering", "E-postuppföljning", "Kalenderhantering", "Dokumentbearbetning"],
  isReversed: true
}, {
  id: 3,
  category: "AI Assistant",
  title: "AI Voice Agents",
  description: "Virtuella receptionister som svarar, bokar möten och följer upp 24/7. Perfekt för kundservice, sälj eller intern support.",
  bullets: ["24/7 telefonmottagning", "Automatisk mötesbokning", "Samtalsutskrift & analys", "Flerspråksstöd"],
  isReversed: false
}, {
  id: 4,
  category: "Sales & Marketing",
  title: "Accelerate Sales Growth",
  description: "Automatisera leadgenerering, mejlutskick och innehållsproduktion. Kortare säljcykler och högre conversion rates.",
  bullets: ["Leadberikning", "Automatisk kvalificering", "Försäljningsprognos", "Pipeline-analys"],
  isReversed: true
}, {
  id: 5,
  category: "Custom Projects",
  title: "Build Smarter Systems",
  description: "Skräddarsydda AI-lösningar som integreras med era befintliga system. Skalbar automation som växer med er verksamhet.",
  bullets: ["Anpassade integrationer", "API-kopplingar", "Arbetsflödesoptimering", "Systemskalbarhet"],
  isReversed: false
}];
export const AlternatingServicesSection = () => {
  const [isMacOSSafari, setIsMacOSSafari] = useState(false);

  useEffect(() => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    setIsMacOSSafari(isSafari && isMac);
  }, []);

  return <section className="py-12 md:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="mb-4">
            <span className="text-xs uppercase tracking-wider text-gray-900 bg-white/60 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-full">
              Våra Lösningar
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-normal text-gray-900 mb-6">
            AI-Lösningar som Levererar
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            Live KPI-tavlor, prognoser och tydliga handlingsrekommendationer—så teamet agerar, inte gissar.
          </p>
        </div>

        <div className="space-y-12 md:space-y-16">
        {servicesData.map((service, index) => <div key={service.id} className="animate-[fadeInUp_0.6s_ease-out]" style={{
          animationDelay: `${index * 100}ms`
        }}>
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center ${service.isReversed ? 'lg:grid-flow-dense' : ''}`}>
                {/* Text side */}
                <div className={`relative z-10 ${service.isReversed ? 'lg:col-start-2' : ''}`}>
                  {/* Category Badge */}
                  
                  
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-normal leading-tight text-gray-900 mb-4">
                    {service.title}
                  </h2>
                  <p className="text-base md:text-lg text-gray-600 mb-6">
                    {service.description}
                  </p>
                  
                  {/* Pill-formade tags istället för bullets */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {service.bullets.map((bullet, idx) => <span key={idx} className="text-sm text-gray-700 bg-white/5 backdrop-blur-sm border-2 border-white/10 px-4 py-2 rounded-full">
                        {bullet}
                      </span>)}
                  </div>
                  
                  
                </div>
                
                {/* Mockup side - All visualizations in glassmorphism cards */}
                <div className={service.isReversed ? 'lg:col-start-1' : ''}>
                {service.id === 1 ?
              // CpuArchitecture (Hiems) för Dashboards & Decision Intelligence
              <Suspense fallback={<div className="h-[300px] md:h-[500px] bg-white/5 rounded-2xl animate-pulse" />}>
                      <div className="w-full flex justify-center items-center">
                        <div className={cn(
                          "border-2 border-white/10 rounded-2xl shadow-lg p-8 md:p-12 hover:bg-white/10 transition-all duration-300",
                          isMacOSSafari ? "bg-white/20" : "bg-white/5 backdrop-blur-sm"
                        )}>
                          <CpuArchitecture className="scale-75 md:scale-90 lg:scale-100" width="500" height="250" text="Hiems" />
                        </div>
                      </div>
                    </Suspense> : service.id === 2 ?
              // WorkflowChecklistVisual för Automate repetitive tasks
              <Suspense fallback={<div className="h-[300px] md:h-[500px] bg-white/5 rounded-2xl animate-pulse" />}>
                      <div className="w-full flex justify-center">
                        <div className={cn(
                          "border-2 border-white/10 rounded-2xl shadow-lg p-8 md:p-12 hover:bg-white/10 transition-all duration-300",
                          isMacOSSafari ? "bg-white/20" : "bg-white/5 backdrop-blur-sm"
                        )}>
                          <WorkflowChecklistVisual className="scale-90 md:scale-100" />
                        </div>
                      </div>
                    </Suspense> : service.id === 3 ?
              // AIVoiceAgentVisual för AI Voice Agents - Kort endast runt SiriOrb och Listening
              <Suspense fallback={<div className="h-[300px] md:h-[500px] bg-white/5 rounded-2xl animate-pulse" />}>
                      <div className="w-full flex flex-col items-center justify-center gap-2">
                        <div className={cn(
                          "border-2 border-white/10 rounded-2xl shadow-lg p-8 md:p-12 hover:bg-white/10 transition-all duration-300",
                          isMacOSSafari ? "bg-white/20" : "bg-white/5 backdrop-blur-sm"
                        )}>
                          <AIVoiceAgentVisual className="scale-90 md:scale-100" />
                          <AIVoiceInput demoMode={true} className="-mt-6" />
                        </div>
                      </div>
                    </Suspense> : service.id === 4 ?
              // EmailBriefingVisual för Accelerate Sales Growth
              <Suspense fallback={<div className="h-[300px] md:h-[500px] bg-white/5 rounded-2xl animate-pulse" />}>
                      <div className="w-full flex justify-center">
                        <div className={cn(
                          "border-2 border-white/10 rounded-2xl shadow-lg p-8 md:p-12 hover:bg-white/10 transition-all duration-300",
                          isMacOSSafari ? "bg-white/20" : "bg-white/5 backdrop-blur-sm"
                        )}>
                          <EmailBriefingVisual className="scale-90 md:scale-100" />
                        </div>
                      </div>
                    </Suspense> : service.id === 5 ?
              // ProjectManagementVisual för Build Smarter Systems
              <Suspense fallback={<div className="h-[300px] md:h-[500px] bg-white/5 rounded-2xl animate-pulse" />}>
                      <div className="w-full flex justify-center">
                        <div className={cn(
                          "border-2 border-white/10 rounded-2xl shadow-lg p-8 md:p-12 hover:bg-white/10 transition-all duration-300",
                          isMacOSSafari ? "bg-white/20" : "bg-white/5 backdrop-blur-sm"
                        )}>
                          <ProjectManagementVisual className="scale-90 md:scale-100" />
                        </div>
                      </div>
                    </Suspense> :
              // Fallback - ska aldrig nås med nuvarande services
              <div className="h-[300px] md:h-[500px] bg-white/5 rounded-2xl" />}
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};