import { motion, useReducedMotion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Brain, Workflow, BarChart3, FileText, Database, MessageSquare, Users, Shield, TrendingUp } from "lucide-react";
import { SplineScene } from "@/components/ui/spline-scene";
import { Spotlight } from "@/components/ui/spotlight";
const AnimatedContainer = ({
  className,
  delay = 0.1,
  children
}: {
  className?: string;
  delay?: number;
  children: React.ReactNode;
}) => {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true
  }} transition={{
    delay,
    duration: 0.5
  }} className={className}>
    {children}
  </motion.div>;
};
const FlowCard = ({
  icon: Icon,
  title,
  description,
  delay = 0
}: {
  icon: any;
  title: string;
  description: string;
  delay?: number;
}) => {
  return <AnimatedContainer delay={delay}>
    <Card className="relative overflow-hidden">
      <CardContent className="py-5 px-5">
        <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
          <Icon className="m-auto size-6 text-primary" strokeWidth={1.5} />
        </div>
        <div className="relative z-10 mt-5 space-y-2">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  </AnimatedContainer>;
};
export const ServiceDataFlow = () => {
  return <section className="bg-background/50 py-20 md:py-32">
    <div className="mx-auto max-w-7xl px-6 md:px-8">
      <AnimatedContainer className="mx-auto max-w-3xl text-center mb-16">
        <h2 className="text-3xl font-bold tracking-wide text-balance md:text-4xl lg:text-5xl mb-6">
          <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Så Flödar Data Genom Våra Tjänster
          </span>
        </h2>
        <p className="text-muted-foreground text-base tracking-wide text-balance md:text-lg">
          Varje AI-tjänst har sitt eget intelligenta dataflöde från kundinput till färdig action.
          Tillsammans skapar de ett komplett ekosystem där all data samlas i er centrala dashboard.
        </p>
      </AnimatedContainer>

      <div className="relative">
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Main hero card - AI Intelligent (avlång) med Spline 3D */}
          <Card className="relative flex overflow-hidden sm:col-span-2 bg-black/[0.96]">
            <Spotlight className="-top-20 left-0 md:left-20 md:-top-10" fill="hsl(var(--primary))" />
            <CardContent className="relative flex items-center gap-6 py-6 px-6 w-full z-10">
              <div className="relative h-20 w-40 shrink-0">
                <SplineScene scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" className="w-full h-full" />
              </div>
              
            </CardContent>
          </Card>

          {/* AI Receptionist */}
          <FlowCard icon={Phone} title="AI Receptionist" description="Svarar naturligt på svenska, bokar möten och uppdaterar CRM automatiskt med AI-driven konversation." delay={0.1} />

          {/* Chatbot & Kommunikation */}
          <FlowCard icon={MessageSquare} title="Chatbot & Kommunikation" description="Analyserar frågor, hämtar relevant info från databas och genererar personliga svar i realtid." delay={0.15} />

          {/* AI Modeller */}
          <Card className="relative overflow-hidden">
            <CardContent className="py-5 px-5">
              <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                <Brain className="m-auto size-6 text-primary" strokeWidth={1.5} />
              </div>
              <div className="relative z-10 mt-5 space-y-2">
                <h2 className="text-lg font-semibold text-foreground">AI Modeller (LLM)</h2>
                <p className="text-sm text-muted-foreground">Processar data med avancerade språkmodeller för intelligent output.</p>
              </div>
            </CardContent>
          </Card>

          {/* Automation & Integration - nu under AI Modeller */}
          <Card className="relative overflow-hidden">
            <CardContent className="py-5 px-5">
              <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                <Workflow className="m-auto size-6 text-primary" strokeWidth={1.5} />
              </div>
              <div className="relative z-10 mt-5 space-y-2">
                <h2 className="text-lg font-semibold text-foreground">Automation & Integration</h2>
                <p className="text-sm text-muted-foreground">Synkar data mellan system och kör automatiska workflows vid triggers.</p>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Card with Graph */}
          <Card className="relative overflow-hidden sm:col-span-2">
            <CardContent className="grid py-6 px-6 sm:grid-cols-2">
              <div className="relative z-10 flex flex-col justify-between space-y-6">
                <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                  <BarChart3 className="m-auto size-6 text-primary" strokeWidth={1.5} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-foreground">CRM & Analytics</h2>
                  <p className="text-sm text-muted-foreground">Analyserar mönster från alla kanaler i realtid.</p>
                </div>
              </div>
              <div className="rounded-tl relative -mb-6 -mr-6 mt-6 h-fit border-l border-t p-6 py-6 sm:ml-6">
                <div className="absolute left-3 top-2 flex gap-1">
                  <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
                  <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
                  <span className="block size-2 rounded-full border dark:border-white/10 dark:bg-white/10"></span>
                </div>
                <svg className="w-full" viewBox="0 0 200 100" fill="none">
                  <path className="text-green-500" d="M0 80 L20 70 L40 75 L60 50 L80 55 L100 30 L120 40 L140 20 L160 35 L180 15 L200 25" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M0 80 L20 70 L40 75 L60 50 L80 55 L100 30 L120 40 L140 20 L160 35 L180 15 L200 25 L200 100 L0 100 Z" fill="url(#statsGradientGreen)" opacity="0.2" />
                  <defs>
                    <linearGradient id="statsGradientGreen" x1="0" y1="0" x2="0" y2="100">
                      <stop offset="0%" stopColor="hsl(142 76% 36%)" />
                      <stop offset="100%" stopColor="hsl(142 76% 36%)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </CardContent>
          </Card>

          {/* Offert & Faktura */}
          <Card className="relative overflow-hidden sm:col-span-2">
            <CardContent className="grid h-full py-6 px-6 sm:grid-cols-2">
              <div className="relative z-10 flex flex-col justify-between space-y-6">
                <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
                  <FileText className="m-auto size-6 text-primary" strokeWidth={1.5} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-foreground">Offert & Faktura AI</h2>
                  <p className="text-sm text-muted-foreground">Genererar offerter automatiskt med AI-precision.</p>
                </div>
              </div>
              <div className="relative mt-6 flex items-center justify-center before:absolute before:inset-0 before:mx-auto before:w-px before:bg-border sm:-my-6 sm:-mr-6">
                <div className="relative flex flex-col space-y-4 py-6">
                  <div className="flex items-center gap-3">
                    <Shield className="size-8 text-primary/60" />
                    <TrendingUp className="size-8 text-primary" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* RAG & Data-agenter */}
          <FlowCard icon={Database} title="RAG & Data-agenter" description="Söker i vektordatabas, hämtar relevant kontext och genererar korrekta svar som lär sig över tid." delay={0.2} />

          {/* Totala Ekosystem */}
          <FlowCard icon={Users} title="Totalt Ekosystem" description="Kartlägger verksamhet, designar smart ekosystem och integrerar alla system för optimal AI-drift." delay={0.25} />
        </div>
      </div>

    </div>
  </section>;
};