import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

// Lazy load Spline for better initial load performance
const Spline = lazy(() => import('@splinetool/react-spline'));
interface AnimatedHeroProps {
  onBookDemo?: () => void;
  onViewServices?: () => void;
}
function AnimatedHero({
  onBookDemo,
  onViewServices
}: AnimatedHeroProps) {
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLDivElement>(null);
  const [shouldLoadSpline, setShouldLoadSpline] = useState(false);
  const [isSplineLoading, setIsSplineLoading] = useState(true);
  const [splineError, setSplineError] = useState<string | null>(null);
  const [isMacOS, setIsMacOS] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [willChangeActive, setWillChangeActive] = useState(true);

  // Detect Safari and macOS for performance optimization
  useEffect(() => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const safariDetect = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    setIsMacOS(isMac);
    setIsSafari(safariDetect);
    
    if (safariDetect) {
      console.log('🦁 Safari detected - using gradient fallback instead of Spline');
    }
  }, []);

  // will-change management - Remove after 5s to save GPU resources
  useEffect(() => {
    if (!willChangeActive) return;
    
    const timer = setTimeout(() => {
      console.log('⚡ Removing will-change after 5s to save GPU');
      setWillChangeActive(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [willChangeActive]);

  // Intersection Observer - Load Spline only when hero is in viewport (NOT on Safari)
  useEffect(() => {
    if (isMobile || isSafari) return; // Skip on mobile and Safari
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !shouldLoadSpline) {
          console.log('🎯 Hero in viewport - loading Spline...');
          setShouldLoadSpline(true);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, [isMobile, isSafari, shouldLoadSpline]);
  return <div ref={heroRef} className="relative w-full min-h-[85vh] md:min-h-screen lg:min-h-[140vh] overflow-hidden pb-24 md:pb-40">
      {/* Spline 3D Animation - Lazy loaded when in viewport (NOT on Safari) */}
      {!isMobile && !isSafari && shouldLoadSpline && (
        <div className="absolute inset-0 z-5 animate-subtle-float">
          <Suspense fallback={
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-muted-foreground">Laddar 3D-animation...</p>
            </div>
          }>
            {isSplineLoading && <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground">Initierar 3D-scen...</p>
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
            opacity: isMacOS ? 0.4 : 1.0,
            willChange: willChangeActive ? 'opacity, transform' : 'auto',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }} />
          </Suspense>
        </div>
      )}

      {/* Gradient Fallback - För mobil OCH Safari */}
      {(isMobile || isSafari) && (
        <div className="absolute inset-0 z-5 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-60 animate-subtle-float" />
      )}

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
            <button onClick={onViewServices} className="px-8 py-3.5 md:px-10 md:py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-gray-900 text-gray-900 rounded-full text-base font-medium transition-all duration-300 hover:scale-105">
              Se våra tjänster
            </button>
          </div>
        </div>
      </div>
    </div>;
}
export { AnimatedHero };