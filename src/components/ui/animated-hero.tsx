import { motion } from "framer-motion";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface AnimatedHeroProps {
  onBookDemo?: () => void;
  onViewPackages?: () => void;
}

function AnimatedHero({
  onBookDemo
}: AnimatedHeroProps) {
  const isMobile = useIsMobile();

  return <div className="relative w-full min-h-[85vh] md:min-h-screen lg:min-h-[140vh] overflow-hidden pb-24 md:pb-40">
      {/* Gradient fallback background (bättre prestanda än Spline) */}
      <div className="absolute inset-0 z-5 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-60" />

      {/* Hero Content - On top of everything */}
      <div className="relative z-20 container mx-auto max-w-4xl px-6 py-32 lg:py-48">
        <div className="flex flex-col items-center justify-center gap-4 lg:gap-6 text-center">
          {/* Main Headline */}
          <motion.h1 initial={{
          opacity: 0,
          y: -30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          ease: "easeOut"
        }} className="text-5xl md:text-6xl lg:text-7xl font-display font-normal leading-tight md:leading-[1.1] tracking-tighter text-gray-900">
            Vi bygger intelligenta system som gör jobbet åt dig
          </motion.h1>

          {/* Subheadline */}
          <motion.p initial={{
          opacity: 0,
          y: -20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.2,
          ease: "easeOut"
        }} className="text-base md:text-lg text-gray-600 max-w-2xl leading-relaxed">
            Hiems hjälper företag att implementera verkliga AI-lösningar — röstagenter, automationer och dashboards som ger resultat, inte bara rapporter
          </motion.p>

          {/* CTA Buttons */}
          <motion.div initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.6,
          delay: 0.4,
          ease: "easeOut"
        }} className="flex gap-4 mt-2">
            <button onClick={onBookDemo} className="px-8 py-3.5 md:px-10 md:py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-base font-medium transition-all duration-300 hover:scale-105">
              Boka ett möte
            </button>
          </motion.div>
        </div>
      </div>
    </div>;
}

export { AnimatedHero };