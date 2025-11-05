import { motion, useReducedMotion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { 
  Phone, 
  Brain, 
  Mic, 
  Workflow, 
  BarChart3, 
  FileText, 
  Sparkles, 
  Database,
  ArrowRight,
  MessageSquare,
  Users
} from "lucide-react";

const AnimatedContainer = ({ 
  className, 
  delay = 0.1, 
  children 
}: { 
  className?: string; 
  delay?: number; 
  children: React.ReactNode 
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface ServiceFlowProps {
  icon: any;
  title: string;
  steps: string[];
  delay?: number;
}

const ServiceFlow = ({ icon: Icon, title, steps, delay = 0 }: ServiceFlowProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={!shouldReduceMotion ? { scale: 0.95, opacity: 0 } : {}}
      whileInView={!shouldReduceMotion ? { scale: 1, opacity: 1 } : {}}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
    >
      <Card className="p-6 bg-card/30 backdrop-blur border-primary/20 hover:border-primary/40 transition-all duration-300 h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <Icon className="size-6 text-primary" />
          </div>
          <h3 className="font-bold text-lg text-foreground">{title}</h3>
        </div>
        
        <div className="space-y-3">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={!shouldReduceMotion ? { x: -20, opacity: 0 } : {}}
              whileInView={!shouldReduceMotion ? { x: 0, opacity: 1 } : {}}
              viewport={{ once: true }}
              transition={{ delay: delay + 0.1 * (index + 1), duration: 0.5 }}
              className="flex items-start gap-3"
            >
              <div className="flex items-center justify-center min-w-[24px] h-6 rounded-full bg-primary/20 text-xs font-bold text-primary">
                {index + 1}
              </div>
              <div className="flex items-center gap-2 flex-1">
                <p className="text-sm text-muted-foreground">{step}</p>
                {index < steps.length - 1 && (
                  <ArrowRight className="size-4 text-primary/40 flex-shrink-0" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export const ServiceDataFlow = () => {
  const services = [
    {
      icon: Phone,
      title: "AI Receptionist",
      steps: [
        "Kund ringer in",
        "AI svarar naturligt på svenska",
        "Samlar information & bokar",
        "Uppdaterar CRM automatiskt",
        "Skickar bekräftelse"
      ]
    },
    {
      icon: MessageSquare,
      title: "Chatbot & Kommunikation",
      steps: [
        "Kund skriver meddelande",
        "AI analyserar frågan",
        "Hämtar relevant info från databas",
        "Genererar personligt svar",
        "Loggar interaktion i CRM"
      ]
    },
    {
      icon: Brain,
      title: "AI Modeller (LLM)",
      steps: [
        "Input från användare",
        "AI-modell processar data",
        "Genererar intelligent output",
        "Kvalitetskontroll & validering",
        "Sparar resultat i system"
      ]
    },
    {
      icon: Workflow,
      title: "Automation & Integration",
      steps: [
        "Trigger aktiveras",
        "Workflow startar automatiskt",
        "Data synkas mellan system",
        "Actions körs i sekvens",
        "Notifiering vid slutfört"
      ]
    },
    {
      icon: BarChart3,
      title: "CRM & Analytics",
      steps: [
        "Data samlas från alla kanaler",
        "AI analyserar mönster",
        "Genererar insights i realtid",
        "Uppdaterar dashboards",
        "Skickar rapporter"
      ]
    },
    {
      icon: FileText,
      title: "Offert & Faktura AI",
      steps: [
        "Förfrågan inkommer",
        "AI analyserar behov",
        "Genererar offert automatiskt",
        "Kund godkänner",
        "Faktura skapas & skickas"
      ]
    },
    {
      icon: Database,
      title: "RAG & Data-agenter",
      steps: [
        "Fråga ställs i naturligt språk",
        "AI söker i vektordatabas",
        "Hämtar relevant kontext",
        "Genererar korrekt svar",
        "Lär sig från interaktionen"
      ]
    },
    {
      icon: Users,
      title: "Totala Ekosystem",
      steps: [
        "Kartläggning av verksamhet",
        "Design av smart ekosystem",
        "Integration av alla system",
        "AI optimerar flöden",
        "Kontinuerlig förbättring"
      ]
    }
  ];

  return (
    <section className="relative py-24">
      <div className="mx-auto w-full max-w-7xl space-y-12 px-4">
        <AnimatedContainer className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-wide text-balance md:text-4xl lg:text-5xl xl:font-extrabold mb-4">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              🔄 Så Flödar Data Genom Våra Tjänster
            </span>
          </h2>
          <p className="text-muted-foreground text-sm tracking-wide text-balance md:text-base">
            Varje AI-tjänst har sitt eget intelligenta dataflöde från kundinput till färdig action.
            Tillsammans skapar de ett komplett ekosystem där all data samlas i er centrala dashboard.
          </p>
        </AnimatedContainer>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceFlow
              key={service.title}
              icon={service.icon}
              title={service.title}
              steps={service.steps}
              delay={0.1 * index}
            />
          ))}
        </div>

        <AnimatedContainer delay={0.8} className="text-center">
          <Card className="p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/30 shadow-glow max-w-3xl mx-auto">
            <Database className="size-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2 text-foreground">Allt Samlas i Ett</h3>
            <p className="text-muted-foreground">
              Oavsett vilken tjänst som genererar data - AI-samtal, chatbot, automation eller analytics - 
              så samlas allt i er Hiems Dashboard. En enda källa till sanning för hela verksamheten.
            </p>
          </Card>
        </AnimatedContainer>
      </div>
    </section>
  );
};
