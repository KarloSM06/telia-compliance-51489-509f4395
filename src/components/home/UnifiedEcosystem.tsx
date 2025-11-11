import React from "react";
import { motion } from "framer-motion";
interface UnifiedEcosystemProps {
  primaryImageSrc?: string;
  secondaryImageSrc?: string;
  reverseLayout?: boolean;
}
export const UnifiedEcosystem: React.FC<UnifiedEcosystemProps> = ({
  primaryImageSrc = "/placeholder.svg",
  secondaryImageSrc = "/placeholder.svg",
  reverseLayout = false
}) => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7
      }
    }
  };
  const layoutClasses = reverseLayout ? "md:grid-cols-2 md:grid-flow-col-dense" : "md:grid-cols-2";
  const textOrderClass = reverseLayout ? "md:col-start-2" : "";
  const imageOrderClass = reverseLayout ? "md:col-start-1" : "";
  return <section className="relative py-32 md:py-64 overflow-hidden bg-white">
      <div className="container max-w-[1440px] w-full px-6 md:px-10 relative z-10 mx-auto">
        
      </div>

      {/* Decorative bottom gradient */}
      <div className="absolute w-full h-px bottom-0 left-0 z-0" style={{
      background: "radial-gradient(50% 50% at 50% 50%, hsl(var(--border) / 0.24) 0%, hsl(var(--border) / 0) 100%)"
    }} />
    </section>;
};