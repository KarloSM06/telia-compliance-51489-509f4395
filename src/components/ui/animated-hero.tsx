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
  return <div className="relative w-full min-h-[85vh] md:min-h-screen lg:min-h-[140vh] overflow-hidden pb-24 md:pb-40">
      {/* Spline 3D Animation - Edge-to-edge, 75% on mobile */}
      <div className="absolute inset-0 z-5">
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
      }} className="scale-75 md:scale-100 transition-transform duration-300" style={{
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 1.0,
        willChange: 'opacity, transform',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden'
      }} />
      </div>

      {/* Hero Content - On top of everything */}
      <div className="relative z-20 container mx-auto max-w-4xl px-6 py-32 lg:py-48">
        <div className="flex flex-col items-center justify-center gap-4 lg:gap-6 text-center">
          {/* Main Headline */}
          <h1 className="animate-hero-title text-5xl md:text-6xl lg:text-7xl font-display font-normal leading-tight md:leading-[1.1] tracking-tighter text-gray-900">
            Vi bygger intelligenta system som gör jobbet åt dig
          </h1>

          {/* Subheadline */}
          <p className="animate-hero-subtitle text-base md:text-lg text-gray-600 max-w-2xl leading-relaxed">
            Hiems hjälper företag att implementera verkliga AI-lösningar — röstagenter, automationer och dashboards som ger resultat, inte bara rapporter
          </p>

          {/* CTA Buttons */}
          <div className="animate-hero-cta flex gap-4 mt-2">
            <button onClick={onBookDemo} className="px-8 py-3.5 md:px-10 md:py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-base font-medium transition-all duration-300 hover:scale-105">
              Boka ett möte
            </button>
          </div>
        </div>
      </div>
    </div>;
}
export { AnimatedHero };