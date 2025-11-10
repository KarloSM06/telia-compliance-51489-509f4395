import React, { useState } from "react";
import { expertiseCategories } from "@/data/expertise";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

// Samla alla program-logotyper från expertise data MED namn
const ALL_PROGRAMS = expertiseCategories.flatMap(cat => cat.items.filter(item => item.logo).map(item => ({
  name: item.name,
  logo: item.logo!
})));

// Optimerad repetition för sömlös loop
const repeatedIcons = (programs: typeof ALL_PROGRAMS, repeat = 4) => Array.from({
  length: repeat
}).flatMap(() => programs);
export default function IntegrationHero() {
  const [hoveredProgram, setHoveredProgram] = useState<string | null>(null);

  // Dela upp programmen i två rader
  const halfLength = Math.ceil(ALL_PROGRAMS.length / 2);
  const row1 = ALL_PROGRAMS.slice(0, halfLength);
  const row2 = ALL_PROGRAMS.slice(halfLength);
  return <section className="relative py-8 md:py-12 overflow-hidden overflow-x-hidden bg-white">
      <div className="relative w-full px-6 md:px-12 text-center">
        
        <AnimatedSection>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-3">​Våra favoritverktyg för att skapa resultat</h1>
          <p className="mt-2 text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
            Vi integrerar sömlöst med alla era befintliga system och verktyg.
          </p>
        </AnimatedSection>
        

        <div className="mt-6 md:mt-8 overflow-x-hidden relative pt-16 pb-8">
          {/* Rad 1 - scrollar åt vänster */}
          <AnimatedSection delay={100}>
            <div className="flex gap-8 md:gap-10 whitespace-nowrap carousel-scroll-left transform-gpu will-change-transform">
              {repeatedIcons(row1, 4).map((program, i) => <div key={i} className="h-16 w-16 md:h-20 md:w-20 flex-shrink-0 rounded-full bg-white/80 backdrop-blur-xl border border-gray-100 shadow-md flex items-center justify-center p-3 transition-all duration-300 hover:scale-110 hover:shadow-lg transform-gpu relative group z-30 hover:z-[100]" onMouseEnter={() => setHoveredProgram(program.name)} onMouseLeave={() => setHoveredProgram(null)}>
                  <img src={program.logo} alt={program.name} loading="lazy" decoding="async" className="h-10 w-10 md:h-12 md:w-12 object-contain" />
                  
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[110]">
                    <div className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
                      {program.name}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                        <div className="border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>
          </AnimatedSection>

          {/* Rad 2 - scrollar åt höger */}
          <AnimatedSection delay={200}>
            <div className="flex gap-8 md:gap-10 whitespace-nowrap mt-4 md:mt-6 carousel-scroll-right transform-gpu will-change-transform">
              {repeatedIcons(row2, 4).map((program, i) => <div key={i} className="h-16 w-16 md:h-20 md:w-20 flex-shrink-0 rounded-full bg-white/80 backdrop-blur-xl border border-gray-100 shadow-md flex items-center justify-center p-3 transition-all duration-300 hover:scale-110 hover:shadow-lg transform-gpu relative group hover:z-[100]" onMouseEnter={() => setHoveredProgram(program.name)} onMouseLeave={() => setHoveredProgram(null)}>
                  <img src={program.logo} alt={program.name} loading="lazy" decoding="async" className="h-10 w-10 md:h-12 md:w-12 object-contain" />
                  
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[110]">
                    <div className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
                      {program.name}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                        <div className="border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>
          </AnimatedSection>

          {/* Fade overlays */}
          <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </section>;
}