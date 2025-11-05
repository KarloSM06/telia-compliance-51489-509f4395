import { motion, useReducedMotion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Brain, Workflow, BarChart3, FileText, Database, MessageSquare, Users, Shield, TrendingUp } from "lucide-react";
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
    <Card className="relative overflow-hidden border-0">
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
  return <section className="bg-background/50 py-32 md:py-48">
    <div className="mx-auto max-w-7xl px-6 md:px-8">
      <AnimatedContainer className="mx-auto max-w-5xl text-center mb-16">
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
          {/* Main hero card - AI Intelligent (avlång) */}
          <Card className="relative flex overflow-hidden sm:col-span-2 border-0">
            <CardContent className="relative flex items-center gap-6 py-6 px-6 w-full">
              <div className="relative flex h-20 w-40 items-center shrink-0">
                <svg className="text-muted absolute inset-0 size-full" viewBox="0 0 254 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z" fill="currentColor" />
                </svg>
                <span className="mx-auto block w-fit text-4xl font-semibold">AI</span>
              </div>
              <h2 className="text-2xl font-semibold">Intelligent</h2>
            </CardContent>
          </Card>

          {/* AI Receptionist */}
          <FlowCard icon={Phone} title="AI Receptionist" description="Svarar naturligt på svenska, bokar möten och uppdaterar CRM automatiskt med AI-driven konversation." delay={0.1} />

          {/* Chatbot & Kommunikation */}
          <FlowCard icon={MessageSquare} title="Chatbot & Kommunikation" description="Analyserar frågor, hämtar relevant info från databas och genererar personliga svar i realtid." delay={0.15} />

          {/* AI Modeller */}
          <Card className="relative overflow-hidden border-0">
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
          <Card className="relative overflow-hidden border-0">
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
          <Card className="relative overflow-hidden sm:col-span-2 border-0">
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
          <Card className="relative overflow-hidden sm:col-span-2 border-0">
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