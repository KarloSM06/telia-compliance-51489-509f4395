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
    <Card className="border-2 border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 p-5 rounded-2xl">
      <div className="relative flex aspect-square size-12 rounded-full border before:absolute before:-inset-2 before:rounded-full before:border dark:border-white/10 dark:before:border-white/5">
        <Icon className="m-auto size-6 text-primary" strokeWidth={1.5} />
      </div>
      <div className="relative z-10 mt-5 space-y-2">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Card>
  </AnimatedContainer>;
};
export const ServiceDataFlow = () => {
  return <section className="py-32 md:py-48">
    
  </section>;
};