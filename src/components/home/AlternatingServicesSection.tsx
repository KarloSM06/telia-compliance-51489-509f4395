import { AnimatedSection } from "@/components/shared/AnimatedSection";
import dashboardScreenshot from "@/assets/dashboard-screenshot.png";
import DatabaseWithRestApi from "@/components/ui/database-with-rest-api";
import { WorkflowChecklistVisual } from "@/components/ui/workflow-checklist-visual";
import { AIVoiceAgentVisual } from "@/components/ui/ai-voice-agent-visual";
import { EmailBriefingVisual } from "@/components/ui/email-briefing-visual";
import { ProjectManagementVisual } from "@/components/ui/project-management-visual";
import { AIVoiceInput } from "@/components/ui/ai-voice-input";
import { 
  Phone, MessageSquare, Mail, Star
} from "lucide-react";

const servicesData = [
  {
    id: 1,
    category: "Our Services",
    title: "Dashboards & Decision Intelligence",
    description: "Live CRM insights, forecasts, automated reporting med AI. Gör data actionable så att teamet kan agera direkt.",
    bullets: [
      "Real-time KPI dashboards",
      "Predictive analytics",
      "Automated reporting",
      "Custom data integrations"
    ],
    mockup: dashboardScreenshot,
    isReversed: false
  },
  {
    id: 2,
    category: "Workflow Automation",
    title: "Automate repetitive tasks",
    description: "Låt AI hantera fakturering, mejl-uppföljning, rapportering och mer. Släpp administrationen och fokusera på tillväxt.",
    bullets: [
      "Invoice automation",
      "Email follow-ups",
      "Calendar management",
      "Document processing"
    ],
    mockup: dashboardScreenshot,
    isReversed: true
  },
  {
    id: 3,
    category: "AI Assistant",
    title: "AI Voice Agents",
    description: "Virtuella receptionister som svarar, bokar möten och följer upp 24/7. Missa aldrig ett samtal igen.",
    bullets: [
      "24/7 phone reception",
      "Automatic meeting booking",
      "Call transcription & analysis",
      "Multi-language support"
    ],
    mockup: dashboardScreenshot,
    isReversed: false
  },
  {
    id: 4,
    category: "Sales & Marketing",
    title: "Accelerate Sales Growth",
    description: "AI-driven lead generation, qualification och nurturing. Kortare säljcykler och högre conversion rates.",
    bullets: [
      "Lead enrichment",
      "Auto qualification",
      "Sales forecasting",
      "Pipeline analytics"
    ],
    mockup: dashboardScreenshot,
    isReversed: true
  },
  {
    id: 5,
    category: "Custom Projects",
    title: "Build Smarter Systems",
    description: "Custom AI-lösningar som integreras med era befintliga system. Skalbar automation som växer med er.",
    bullets: [
      "Custom integrations",
      "API connections",
      "Workflow optimization",
      "System scalability"
    ],
    mockup: dashboardScreenshot,
    isReversed: false
  }
];

export const AlternatingServicesSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-normal text-gray-900 mb-6">
            AI-Lösningar som Levererar
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Live KPI-tavlor, prognoser och tydliga handlingsrekommendationer—så teamet agerar, inte gissar.
          </p>
        </div>

        <div className="space-y-16 md:space-y-24">
        {servicesData.map((service, index) => (
          <AnimatedSection key={service.id} delay={index * 100}>
            <div className="border-2 border-white/10 bg-white/5 backdrop-blur-sm rounded-3xl p-10 md:p-16 shadow-lg hover:shadow-xl transition-all">
              <div className={`grid md:grid-cols-2 gap-12 items-center ${service.isReversed ? 'md:grid-flow-dense' : ''}`}>
                {/* Text side */}
                <div className={service.isReversed ? 'md:col-start-2' : ''}>
                  {/* Category Badge */}
                  <div className="mb-4">
                    <span className="text-xs uppercase tracking-wider text-gray-900 bg-white/60 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-full">
                      {service.category}
                    </span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-display font-normal text-gray-900 mb-4">
                    {service.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    {service.description}
                  </p>
                  
                  {/* Pill-formade tags istället för bullets */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {service.bullets.map((bullet, idx) => (
                      <span key={idx} className="text-sm text-gray-700 bg-white/60 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-full">
                        {bullet}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-4">
                    <button className="border border-gray-300 text-gray-900 px-6 py-3 rounded-full hover:bg-gray-50 transition-colors">
                      Läs mer
                    </button>
                    <button 
                      onClick={() => {
                        const modal = document.querySelector('[role="dialog"]');
                        if (!modal) {
                          const bookButton = document.querySelector('button[class*="bg-gray-900"]') as HTMLButtonElement;
                          bookButton?.click();
                        }
                      }}
                      className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full transition-colors"
                    >
                      Boka ett möte
                    </button>
                  </div>
                </div>
                
                {/* Mockup side - Direct rendering without extra frame */}
                <div className={service.isReversed ? 'md:col-start-1' : ''}>
                  {service.id === 1 ? (
                    // DatabaseWithRestApi figur för Dashboards & Decision Intelligence
                    <div className="w-full flex justify-center">
                      <DatabaseWithRestApi 
                        className="scale-90 md:scale-100" 
                        circleText="Hiems" 
                        title="" 
                        badgeTexts={{
                          first: "Samtal",
                          second: "SMS",
                          third: "Mail",
                          fourth: "Reviews"
                        }} 
                        badgeIcons={{
                          first: Phone,
                          second: MessageSquare,
                          third: Mail,
                          fourth: Star
                        }}
                        buttonTexts={{
                          first: "Hiems",
                          second: "Dashboard"
                        }} 
                        lightColor="hsl(var(--primary))" 
                      />
                    </div>
                  ) : service.id === 2 ? (
                    // WorkflowChecklistVisual för Automate repetitive tasks
                    <div className="w-full flex justify-center">
                      <WorkflowChecklistVisual className="scale-90 md:scale-100" />
                    </div>
                  ) : service.id === 3 ? (
                    // AIVoiceAgentVisual för AI Voice Agents
                    <div className="w-full flex flex-col items-center justify-center gap-4">
                      <AIVoiceAgentVisual className="scale-90 md:scale-100" />
                      <AIVoiceInput demoMode={true} className="mt-4" />
                    </div>
                  ) : service.id === 4 ? (
                    // EmailBriefingVisual för Accelerate Sales Growth
                    <div className="w-full flex justify-center">
                      <EmailBriefingVisual className="scale-90 md:scale-100" />
                    </div>
                  ) : service.id === 5 ? (
                    // ProjectManagementVisual för Build Smarter Systems
                    <div className="w-full flex justify-center">
                      <ProjectManagementVisual className="scale-90 md:scale-100" />
                    </div>
                  ) : (
                    // Fallback för eventuella andra tjänster
                    <img 
                      src={service.mockup} 
                      alt={service.title} 
                      className="w-full rounded-lg"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}
        </div>
      </div>
    </section>
  );
};
