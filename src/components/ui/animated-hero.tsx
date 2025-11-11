import { motion } from "framer-motion";
import Spline from '@splinetool/react-spline';
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
  const [isSplineLoading, setIsSplineLoading] = useState(true);
  const [splineError, setSplineError] = useState<string | null>(null);
  return <div className="relative w-full min-h-screen md:min-h-[140vh] overflow-hidden pb-24 md:pb-40">
      {/* Spline 3D Animation - Only on desktop */}
      {!isMobile && (
        <div className="absolute inset-0 z-5 animate-subtle-float">
          {isSplineLoading && <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-muted-foreground">Laddar 3D-animation...</p>
            </div>}
          {splineError && <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-destructive">Kunde inte ladda 3D-animation: {splineError}</p>
            </div>}
          <Spline scene="https://prod.spline.design/dtyy9Rk8l8FAgcgA/scene.splinecode" onLoad={() => {
          console.log('✅ Spline loaded successfully');
          setIsSplineLoading(false);
        }} onError={error => {
          console.error('❌ Spline error:', error);
          setSplineError('Kunde inte ladda 3D-scenen');
          setIsSplineLoading(false);
        }} style={{
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: 1.0
        }} />
        </div>
      )}

      {/* Fallback gradient för mobil */}
      {isMobile && (
        <div className="absolute inset-0 z-5 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-60" />
      )}

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
        }} className="text-5xl md:text-6xl lg:text-7xl font-display font-normal leading-[1.1] tracking-tighter text-gray-900">
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

          {/* Social Proof */}
          <motion.p initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 0.6,
          delay: 0.6,
          ease: "easeOut"
        }} className="text-sm text-gray-500 mt-6">
            Förtrodd av 50+ företag i Sverige
          </motion.p>
        </div>
      </div>
    </div>;
}
export { AnimatedHero };