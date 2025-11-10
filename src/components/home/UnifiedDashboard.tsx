import { motion, useReducedMotion } from "framer-motion";
import { Card } from "@/components/ui/card";
import DatabaseWithRestApi from "@/components/ui/database-with-rest-api";
import { ServiceDataFlow } from "./ServiceDataFlow";
import { BarChart3, MessageSquare, Users, TrendingUp, Phone, Mail, Calendar, DollarSign, Activity, Database, Star } from "lucide-react";
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
    filter: 'blur(4px)',
    translateY: -8,
    opacity: 0
  }} whileInView={{
    filter: 'blur(0px)',
    translateY: 0,
    opacity: 1
  }} viewport={{
    once: true
  }} transition={{
    delay,
    duration: 0.8
  }} className={className}>
      {children}
    </motion.div>;
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
  return <motion.div initial={!shouldReduceMotion ? {
    scale: 0.95,
    opacity: 0
  } : {}} whileInView={!shouldReduceMotion ? {
    scale: 1,
    opacity: 1
  } : {}} viewport={{
    once: true
  }} transition={{
    delay,
    duration: 0.5
  }}>
      <Card className="p-4 bg-card/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-all duration-300">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon className="size-5 text-primary" />
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{value}</div>
            {trend && <div className="text-xs text-green-500 flex items-center gap-1">
                <TrendingUp className="size-3" />
                {trend}
              </div>}
          </div>
        </div>
      </Card>
    </motion.div>;
};
const DataFlowLine = ({
  delay = 0
}: {
  delay?: number;
}) => {
  return <motion.div initial={{
    scaleX: 0,
    opacity: 0
  }} whileInView={{
    scaleX: 1,
    opacity: 1
  }} viewport={{
    once: true
  }} transition={{
    delay,
    duration: 0.8
  }} className="h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 origin-left" />;
};
export const UnifiedDashboard = () => {
  return <section className="relative pt-0 pb-0 md:pt-0 md:pb-0">
      <div className="mx-auto w-full max-w-7xl space-y-12 px-4">
        <AnimatedContainer className="mx-auto max-w-full text-center">
          <h2 className="text-3xl font-bold tracking-wide text-balance md:text-4xl lg:text-5xl xl:font-extrabold">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              All Data på Ett och Samma Ställe
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
          

          {/* Data Flow Visualization */}
          <AnimatedContainer delay={1.0} className="flex justify-center mt-16">
            <DatabaseWithRestApi 
              className="mx-auto scale-125" 
              circleText="Hiems" 
              title="Centraliserad Datahantering via REST API" 
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
          </AnimatedContainer>
        </AnimatedContainer>

        {/* Service Data Flows */}
        <ServiceDataFlow />
      </div>
    </section>;
};