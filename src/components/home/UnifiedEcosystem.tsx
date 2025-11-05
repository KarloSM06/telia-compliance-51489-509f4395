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
  reverseLayout = false,
}) => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.7,
      }
    },
  };

  const layoutClasses = reverseLayout
    ? "md:grid-cols-2 md:grid-flow-col-dense"
    : "md:grid-cols-2";

  const textOrderClass = reverseLayout ? "md:col-start-2" : "";
  const imageOrderClass = reverseLayout ? "md:col-start-1" : "";

  return (
    <section className="relative py-32 md:py-64 overflow-hidden">
      <div className="container max-w-[1440px] w-full px-6 md:px-10 relative z-10 mx-auto">
        <motion.div
          className={`grid grid-cols-1 gap-32 md:gap-32 w-full items-center ${layoutClasses}`}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Text Content */}
          <motion.div
            className={`flex flex-col items-start gap-6 mt-10 md:mt-0 max-w-[640px] mx-auto md:mx-0 ${textOrderClass}`}
            variants={itemVariants}
          >
            <div className="space-y-3 md:space-y-2">
              <h2 className="text-foreground text-4xl md:text-[56px] font-bold leading-tight md:leading-[68px]">
                Allt administrativt i ett ekosystem
              </h2>
            </div>

            <p className="text-muted-foreground text-base md:text-lg leading-7 md:leading-8">
              Samla all er administration på ett ställe. Från kundhantering och fakturering till projekt och rapporter - allt integrerat i ett smidigt system som sparar tid och minskar komplexitet.
            </p>
          </motion.div>

          {/* App mockup/Image Content */}
          <motion.div
            className={`relative mt-16 md:mt-0 mx-auto ${imageOrderClass} w-full max-w-[400px] md:max-w-[680px]`}
            variants={itemVariants}
          >
            {/* Decorative Background Element - Calendar */}
            <motion.div
              className="absolute w-[420px] h-[420px] md:w-[700px] md:h-[700px] bg-card/50 rounded-[32px] z-0 backdrop-blur-sm shadow-xl"
              style={{
                top: reverseLayout ? 'auto' : '5%',
                bottom: reverseLayout ? '5%' : 'auto',
                left: reverseLayout ? 'auto' : '-15%',
                right: reverseLayout ? '-15%' : 'auto',
                transform: reverseLayout ? 'translate(0, 0)' : 'translateY(8%)',
                filter: 'blur(1px)'
              }}
              initial={{ y: reverseLayout ? 0 : 0 }}
              whileInView={{ y: reverseLayout ? -25 : -35 }}
              transition={{ duration: 1.2 }}
              viewport={{ once: true, amount: 0.5 }}
            >
              <div
                className="relative w-full h-full bg-cover bg-center rounded-[32px]"
                style={{
                  backgroundImage: `url(${secondaryImageSrc})`,
                }}
              />
            </motion.div>

            {/* Main Mockup Card - Dashboard */}
            <motion.div
              className="relative w-full h-[520px] md:h-[860px] bg-card/10 rounded-[32px] backdrop-blur-[15px] backdrop-brightness-[100%] border border-border/50 z-10 overflow-hidden shadow-2xl"
              initial={{ y: reverseLayout ? 0 : 0 }}
              whileInView={{ y: reverseLayout ? 25 : 35 }}
              transition={{ duration: 1.2, delay: 0.1 }}
              viewport={{ once: true, amount: 0.5 }}
            >
              <div className="p-0 h-full">
                <div
                  className="h-full relative"
                  style={{
                    backgroundSize: "100% 100%",
                  }}
                >
                  {/* Primary Image */}
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${primaryImageSrc})`,
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative bottom gradient */}
      <div
        className="absolute w-full h-px bottom-0 left-0 z-0"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, hsl(var(--border) / 0.24) 0%, hsl(var(--border) / 0) 100%)",
        }}
      />
    </section>
  );
};
