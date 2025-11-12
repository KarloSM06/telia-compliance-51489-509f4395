import { Suspense, lazy, useState, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

// Lazy load Spline only when needed
const Spline = lazy(() => import('@splinetool/react-spline'));

interface LazySplineSceneProps {
  sceneUrl: string;
}

function SplineSceneSkeleton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50/40 via-indigo-50/40 to-purple-50/40">
      <div className="text-muted-foreground animate-pulse">Laddar 3D-animation...</div>
    </div>
  );
}

function SplineSceneContent({ sceneUrl }: LazySplineSceneProps) {
  const [isSplineLoading, setIsSplineLoading] = useState(true);
  const [splineError, setSplineError] = useState<string | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Use Intersection Observer to only load when visible
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-5 animate-subtle-float">
      {isSplineLoading && <SplineSceneSkeleton />}
      
      {splineError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-destructive">Kunde inte ladda 3D-animation</p>
        </div>
      )}
      
      {shouldLoad && (
        <Spline 
          scene={sceneUrl}
          onLoad={() => {
            console.log('✅ Spline loaded successfully');
            setIsSplineLoading(false);
          }}
          onError={(error) => {
            console.error('❌ Spline error:', error);
            setSplineError('Kunde inte ladda 3D-scenen');
            setIsSplineLoading(false);
          }}
          style={{
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: 0.6, // Reduced opacity for better performance and less visual weight
            willChange: 'opacity, transform',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
        />
      )}
    </div>
  );
}

export function LazySplineScene({ sceneUrl }: LazySplineSceneProps) {
  const isMobile = useIsMobile();

  // Don't render Spline on mobile for better performance
  if (isMobile) {
    return (
      <div className="absolute inset-0 z-5 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-60" />
    );
  }

  return (
    <Suspense fallback={<SplineSceneSkeleton />}>
      <SplineSceneContent sceneUrl={sceneUrl} />
    </Suspense>
  );
}
