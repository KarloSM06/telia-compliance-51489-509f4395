import { motion, useReducedMotion } from "framer-motion";
import { Card } from "@/components/ui/card";
import DatabaseWithRestApi from "@/components/ui/database-with-rest-api";
import { 
  BarChart3, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Activity,
  Database
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

const DashboardMetric = ({ 
  icon: Icon, 
  label, 
  value, 
  trend,
  delay = 0 
}: { 
  icon: any; 
  label: string; 
  value: string; 
  trend?: string;
  delay?: number;
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={!shouldReduceMotion ? { scale: 0.95, opacity: 0 } : {}}
      whileInView={!shouldReduceMotion ? { scale: 1, opacity: 1 } : {}}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="p-4 bg-card/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-all duration-300">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon className="size-5 text-primary" />
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{value}</div>
            {trend && (
              <div className="text-xs text-green-500 flex items-center gap-1">
                <TrendingUp className="size-3" />
                {trend}
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const DataFlowLine = ({ delay = 0 }: { delay?: number }) => {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className="h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 origin-left"
    />
  );
};

export const UnifiedDashboard = () => {
  return (
    <section className="relative py-24 md:py-40">
      <div className="mx-auto w-full max-w-7xl space-y-12 px-4">
        <AnimatedContainer className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-wide text-balance md:text-4xl lg:text-5xl xl:font-extrabold">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              📊 All Data på Ett och Samma Ställe
            </span>
          </h2>
          <p className="text-muted-foreground mt-4 text-sm tracking-wide text-balance md:text-base">
            Med Hiems samlas all er data från AI-receptionist, CRM, försäljning, kommunikation och automation
            i en enda, överskådlig dashboard. Få insikter i realtid och fatta bättre beslut snabbare.
            <br />
            <span className="font-semibold text-foreground">En plattform. All data. Total kontroll.</span>
          </p>
        </AnimatedContainer>

        {/* Central Dashboard Visualization */}
        <AnimatedContainer delay={0.3} className="relative">
          {/* Data sources flowing into central dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Left column - Communication */}
            <div className="space-y-4">
              <DataFlowLine delay={0.4} />
              <DashboardMetric 
                icon={Phone}
                label="AI Samtal"
                value="847"
                trend="+23% denna vecka"
                delay={0.5}
              />
              <DashboardMetric 
                icon={Mail}
                label="E-post Konversationer"
                value="1,234"
                trend="+15% denna vecka"
                delay={0.6}
              />
              <DashboardMetric 
                icon={MessageSquare}
                label="Chatbot Interaktioner"
                value="2,567"
                trend="+31% denna vecka"
                delay={0.7}
              />
            </div>

            {/* Center column - Main Dashboard */}
            <div className="flex flex-col justify-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <Card className="p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/40 shadow-glow">
                  <div className="flex items-center justify-center mb-4">
                    <Database className="size-12 text-primary animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2">Hiems Dashboard</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Centraliserad dataöversikt från alla era system
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Activity className="size-4 text-green-500" />
                      <span>Live synkronisering</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <TrendingUp className="size-4 text-blue-500" />
                      <span>AI-drivna insikter</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Right column - Business Metrics */}
            <div className="space-y-4">
              <DataFlowLine delay={0.6} />
              <DashboardMetric 
                icon={Users}
                label="Aktiva Leads"
                value="156"
                trend="+12% denna månad"
                delay={0.7}
              />
              <DashboardMetric 
                icon={Calendar}
                label="Bokade Möten"
                value="89"
                trend="+28% denna månad"
                delay={0.8}
              />
              <DashboardMetric 
                icon={DollarSign}
                label="Pipeline Värde"
                value="4.2M SEK"
                trend="+19% denna månad"
                delay={0.9}
              />
            </div>
          </div>

          {/* Feature highlights */}
          <AnimatedContainer delay={0.8}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4 bg-card/30 backdrop-blur border-primary/10">
                <BarChart3 className="size-8 text-primary mb-2" />
                <h4 className="font-semibold mb-1">Realtidsanalys</h4>
                <p className="text-xs text-muted-foreground">
                  Se all data uppdateras live från alla kanaler
                </p>
              </Card>
              <Card className="p-4 bg-card/30 backdrop-blur border-primary/10">
                <Database className="size-8 text-primary mb-2" />
                <h4 className="font-semibold mb-1">Full Dataägande</h4>
                <p className="text-xs text-muted-foreground">
                  All data är er - ingen inlåsning
                </p>
              </Card>
              <Card className="p-4 bg-card/30 backdrop-blur border-primary/10">
                <Activity className="size-8 text-primary mb-2" />
                <h4 className="font-semibold mb-1">Smart Automation</h4>
                <p className="text-xs text-muted-foreground">
                  Automatiska insikter och rapporter
                </p>
              </Card>
              <Card className="p-4 bg-card/30 backdrop-blur border-primary/10">
                <TrendingUp className="size-8 text-primary mb-2" />
                <h4 className="font-semibold mb-1">ROI Spårning</h4>
                <p className="text-xs text-muted-foreground">
                  Mät avkastning på varje kampanj
                </p>
              </Card>
            </div>
          </AnimatedContainer>

          {/* Data Flow Visualization */}
          <AnimatedContainer delay={1.0} className="flex justify-center mt-16">
            <DatabaseWithRestApi 
              className="mx-auto"
              circleText="API"
              title="Centraliserad datahantering med REST API"
              badgeTexts={{
                first: "CRM",
                second: "AI Agent",
                third: "Analytics",
                fourth: "Reports"
              }}
              buttonTexts={{
                first: "Hiems",
                second: "Dashboard_v1"
              }}
              lightColor="hsl(var(--primary))"
            />
          </AnimatedContainer>
        </AnimatedContainer>
      </div>
    </section>
  );
};
