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
    <section className="relative py-32 md:py-64 overflow-hidden bg-white">
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
              <h2 className="text-gray-900 text-4xl md:text-[56px] font-bold leading-tight md:leading-[68px]">
                Allt administrativt i ett ekosystem
              </h2>
            </div>

            <p className="text-gray-600 text-base md:text-lg leading-7 md:leading-8">
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
              className="absolute w-[420px] h-[420px] md:w-[700px] md:h-[700px] bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[32px] z-0 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl cursor-pointer"
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
              whileHover={{ scale: 1.05, filter: 'blur(0px)' }}
              transition={{ duration: 0.2 }}
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
              className="relative w-full h-[520px] md:h-[860px] bg-white/80 rounded-[32px] backdrop-blur-xl border border-gray-100 z-10 overflow-hidden shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] hover:border-purple-600/30 cursor-pointer"
              initial={{ y: reverseLayout ? 0 : 0 }}
              whileInView={{ y: reverseLayout ? 25 : 35 }}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.2 }}
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
