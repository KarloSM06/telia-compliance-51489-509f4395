import { LazySplineScene } from "./lazy-spline-scene";
interface AnimatedHeroProps {
  onBookDemo?: () => void;
  onViewServices?: () => void;
}
function AnimatedHero({
  onBookDemo,
  onViewServices
}: AnimatedHeroProps) {
  return <div className="relative w-full min-h-[85vh] md:min-h-screen lg:min-h-[140vh] overflow-hidden pb-24 md:pb-40">
      {/* Lazy-loaded Spline 3D Animation with Intersection Observer */}
      <LazySplineScene sceneUrl="https://prod.spline.design/dtyy9Rk8l8FAgcgA/scene.splinecode" />

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