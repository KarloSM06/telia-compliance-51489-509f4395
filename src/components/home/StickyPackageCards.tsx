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

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return [ref, inView] as const;
};

// Header Component
const AnimatedHeader = () => {
  const [headerRef, headerInView] = useScrollAnimation();
  const [pRef, pInView] = useScrollAnimation();

  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      <div 
        ref={headerRef}
        className={`inline-block transition-all duration-700 ease-out ${headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <h2 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
          Välj paket för ditt företag / din bransch
        </h2>
        <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50" />
      </div>
      <p 
        ref={pRef}
        className={`text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mt-6 font-light transition-all duration-700 ease-out delay-200 ${pInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        Vi erbjuder sex skräddarsydda AI-paket som kan anpassas efter era specifika behov
      </p>
    </div>
  );
};

interface StickyPackageCardsProps {
  packages: Package[];
  onBookDemo: () => void;
  onViewDetails: (pkg: Package) => void;
}

export function StickyPackageCards({ packages, onBookDemo, onViewDetails }: StickyPackageCardsProps) {
  return (
    <section id="paket" className="relative py-24 md:py-48 bg-gradient-to-b from-background via-background/95 to-background">
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
                
                return (
                  <div
                    key={pkg.id}
                    className="bg-gradient-to-br from-card/40 via-card/20 to-card/10 backdrop-blur-xl border border-primary/20 grid grid-cols-1 md:grid-cols-2 items-center gap-4 md:gap-8 p-8 md:p-12 rounded-3xl mb-16 sticky hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/30 shadow-lg"
                    style={{ top: '200px' }}
                  >
                    {/* Card Content */}
                    <div className={`flex flex-col justify-center ${!isLeft ? 'md:order-2' : ''}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <Icon className="h-10 w-10 text-primary" strokeWidth={1.5} />
                        <h3 className="text-3xl md:text-4xl font-bold text-foreground">
                          {pkg.name}
                        </h3>
                      </div>
                      
                      <p className="text-sm text-muted-foreground font-medium mb-4">
                        {pkg.targetAudience}
                      </p>
                      
                      {pkg.tagline && (
                        <p className="text-lg text-foreground/90 mb-6 font-light">
                          {pkg.tagline}
                        </p>
                      )}

                      {/* Features */}
                      <ul className="space-y-2 mb-6">
                        {allFeatures.slice(0, 4).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                          onClick={() => onViewDetails(pkg)} 
                          variant="outline" 
                          className="flex-1 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                        >
                          Läs mer
                        </Button>
                        <Button 
                          onClick={onBookDemo} 
                          className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-primary/50 transition-all duration-300"
                        >
                          Boka demo
                        </Button>
                      </div>
                    </div>
                    
                    {/* Card Image */}
                    <div className={`mt-8 md:mt-0 ${!isLeft ? 'md:order-1' : ''}`}>
                      {pkg.image ? (
                        <img 
                          src={pkg.image} 
                          alt={pkg.name}
                          loading="lazy"
                          className="w-full h-auto rounded-lg shadow-lg object-cover aspect-[4/3]"
                          onError={(e) => { 
                            e.currentTarget.onerror = null; 
                            e.currentTarget.src = "https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found"; 
                          }}
                        />
                      ) : (
                        <div className="w-full aspect-[4/3] rounded-lg bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 flex items-center justify-center">
                          <Icon className="h-32 w-32 text-primary/20" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
