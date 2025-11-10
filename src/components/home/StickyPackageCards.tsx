import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import type { Package } from "@/data/packages";

// Custom Hook for Scroll Animation
const useScrollAnimation = () => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return [ref, inView] as const;
};

// Header Component
const AnimatedHeader = () => {
  const [headerRef, headerInView] = useScrollAnimation();
  const [pRef, pInView] = useScrollAnimation();
  return <div className="text-center max-w-5xl mx-auto mb-20">
      <div ref={headerRef} className={`transition-all duration-700 ease-out ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{
      transformStyle: 'preserve-3d'
    }}>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">​Våra AI-paket</h2>
      </div>
      <p ref={pRef} className={`text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mt-6 transition-all duration-700 ease-out delay-200 ${pInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{
      transformStyle: 'preserve-3d'
    }}>
        Skräddarsydda lösningar som kan anpassas efter era unika behov
      </p>
    </div>;
};
interface StickyPackageCardsProps {
  packages: Package[];
  onBookDemo: () => void;
  onViewDetails: (pkg: Package) => void;
}
export function StickyPackageCards({
  packages,
  onBookDemo,
  onViewDetails
}: StickyPackageCardsProps) {
  return <section id="paket" className="relative py-16 md:py-24">
      <div className="px-[5%]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center">
            <AnimatedHeader />

            {/* Container for sticky cards */}
            <div className="w-full">
              {packages.map((pkg, index) => {
              const Icon = pkg.icon;
              const allFeatures = [...(pkg.components || []), ...(pkg.valueBullets || [])];
              const isLeft = index % 2 === 0;
              return <div key={pkg.id} className="relative bg-gradient-to-br from-card/50 via-card/30 to-card/20 backdrop-blur-xl border border-border/50 hover:border-accent/30 grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-12 p-8 md:p-14 rounded-3xl mb-16 sticky shadow-card hover:shadow-elegant transition-all duration-500 group" style={{
                top: `${120 + index * 20}px`
              }}>
                    {/* Popular Badge */}
                    {pkg.isPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                        <div className="bg-gradient-accent text-white px-6 py-2 rounded-full text-sm font-bold shadow-button">
                          Populärast
                        </div>
                      </div>
                    )}

                    {/* Card Content */}
                    <div className={`flex flex-col justify-center ${!isLeft ? 'md:order-2' : ''}`}>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30">
                          <Icon className="h-8 w-8 text-accent" />
                        </div>
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                          {pkg.name}
                        </h3>
                      </div>
                      
                      <p className="text-base md:text-lg text-muted-foreground font-medium mb-4">
                        {pkg.targetAudience}
                      </p>
                      
                      {pkg.tagline && <p className="text-lg md:text-xl text-foreground/90 mb-6 font-light">
                          {pkg.tagline}
                        </p>}

                      {/* Starting Price */}
                      <div className="mb-6 pb-6 border-b border-border/50">
                        <p className="text-sm text-muted-foreground mb-1">Startpris</p>
                        <p className="text-2xl md:text-3xl font-bold text-accent">
                          {pkg.startingPrice}
                        </p>
                      </div>

                      {/* Features */}
                      <ul className="space-y-3 mb-8">
                        {allFeatures.slice(0, 4).map((feature, idx) => <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-muted-foreground">
                            <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>)}
                      </ul>

                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                          onClick={onBookDemo} 
                          size="lg"
                          className="flex-1 bg-gradient-accent hover:opacity-90 text-white shadow-button hover:shadow-glow transition-all duration-300 hover:scale-105 font-bold"
                        >
                          Boka demo
                        </Button>
                        <Button 
                          onClick={() => onViewDetails(pkg)} 
                          variant="outline" 
                          size="lg"
                          className="flex-1 border-border hover:border-accent/50 hover:bg-accent/5 transition-all duration-300"
                        >
                          Läs mer
                        </Button>
                      </div>
                    </div>
                    
                    {/* Card Image */}
                    <div className={`mt-8 md:mt-0 ${!isLeft ? 'md:order-1' : ''}`}>
                      {pkg.image ? <img src={pkg.image} alt={pkg.name} loading="lazy" className="w-full h-auto rounded-2xl shadow-elegant object-cover aspect-[4/3] group-hover:scale-[1.02] transition-transform duration-500" onError={e => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found";
                  }} /> : <div className="w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-accent/5 via-accent/10 to-accent/5 flex items-center justify-center border border-border/50">
                          <Icon className="h-32 w-32 text-accent/20" />
                        </div>}
                    </div>
                  </div>;
            })}
            </div>
          </div>
        </div>
      </div>
    </section>;
}