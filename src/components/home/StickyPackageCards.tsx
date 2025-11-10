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
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900">​Våra färdiga paket</h2>
      </div>
      <p ref={pRef} className={`text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mt-6 transition-all duration-700 ease-out delay-200 ${pInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{
      transformStyle: 'preserve-3d'
    }}>
        Vi erbjuder sex skräddarsydda AI-paket som kan anpassas efter era specifika behov
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
  return <section id="paket" className="relative py-16 md:py-24 bg-white">
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
              const isPopular = index === 1 || index === 4; // Mark 2nd and 5th as popular
              return <div key={pkg.id} className="bg-white/80 backdrop-blur-xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-12 p-10 md:p-16 rounded-3xl mb-20 sticky shadow-lg hover:shadow-xl transition-all" style={{
                top: '200px'
              }}>
                    {/* Card Content */}
                    <div className={`flex flex-col justify-center ${!isLeft ? 'md:order-2' : ''}`}>
                      <div className="flex items-center gap-4 mb-6">
                        {isPopular && (
                          <div className="bg-gray-900 text-white px-4 py-1 rounded-full text-sm font-medium">
                            Populär
                          </div>
                        )}
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                          {pkg.name}
                        </h3>
                      </div>
                      
                      <p className="text-base md:text-lg text-gray-600 font-medium mb-6">
                        {pkg.targetAudience}
                      </p>
                      
                      {pkg.tagline && <p className="text-xl md:text-2xl text-gray-900 mb-8 font-light">
                          {pkg.tagline}
                        </p>}

                      {/* Features */}
                      <ul className="space-y-3 mb-8">
                        {allFeatures.slice(0, 4).map((feature, idx) => <li key={idx} className="flex items-start gap-3 text-base md:text-lg text-gray-700">
                            <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-gray-900 flex-shrink-0 mt-1" />
                            <span>{feature}</span>
                          </li>)}
                      </ul>

                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button onClick={() => onViewDetails(pkg)} variant="outline" className="flex-1 border-gray-300 hover:border-gray-400 hover:bg-gray-50">
                          Läs mer
                        </Button>
                        <Button onClick={onBookDemo} className="flex-1 bg-gray-900 hover:bg-gray-800 text-white shadow-lg transition-all duration-300">
                          Boka demo
                        </Button>
                      </div>
                    </div>
                    
                    {/* Card Image */}
                    <div className={`mt-8 md:mt-0 ${!isLeft ? 'md:order-1' : ''}`}>
                      {pkg.image ? <img src={pkg.image} alt={pkg.name} loading="lazy" className="w-full h-auto rounded-lg shadow-lg object-cover aspect-[4/3]" onError={e => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found";
                  }} /> : <div className="w-full aspect-[4/3] rounded-lg bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 flex items-center justify-center">
                          <Icon className="h-32 w-32 text-primary/20" />
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