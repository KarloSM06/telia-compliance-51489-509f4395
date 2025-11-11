import { motion, useReducedMotion } from "framer-motion";
import { servicesData } from "@/data/services";
import { FeatureCard } from "@/components/ui/grid-feature-cards";
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
export const ServicesGrid = () => {
  return <section className="relative py-24 md:py-40 bg-white">
      
    </section>;
};