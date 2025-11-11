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
      <Card className="p-4 bg-white/80 backdrop-blur-xl border border-gray-100 hover:border-purple-600/40 transition-all duration-300">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon className="size-5 text-purple-600" />
              <span className="text-sm text-gray-600">{label}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
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
  return <section className="relative pt-0 pb-0 md:pt-0 md:pb-0 bg-white">
      <div className="mx-auto w-full max-w-7xl space-y-12 px-4">
        <AnimatedContainer className="mx-auto max-w-full text-center">
          <h2 className="text-3xl font-bold tracking-wide text-balance md:text-4xl lg:text-5xl xl:font-extrabold text-gray-900">
            All Data på Ett och Samma Ställe
          </h2>
          <p className="text-gray-600 mt-4 text-sm tracking-wide text-balance md:text-base">
            Med Hiems samlas all er data från AI-receptionist, CRM, försäljning, kommunikation och automation
            i en enda, överskådlig dashboard. Få insikter i realtid och fatta bättre beslut snabbare.
            <br />
            <span className="font-semibold text-gray-900">En plattform. All data. Total kontroll.</span>
          </p>
        </AnimatedContainer>

        {/* Service Data Flows */}
        <ServiceDataFlow />
      </div>
    </section>;
};