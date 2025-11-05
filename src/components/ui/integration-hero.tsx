import React from "react";
import { expertiseCategories } from "@/data/expertise";

// Samla alla program-logotyper från expertise data
const ALL_PROGRAM_LOGOS = expertiseCategories.flatMap(cat => 
  cat.items.map(item => item.logo).filter(Boolean)
) as string[];

const repeatedIcons = (icons: string[], repeat = 3) => Array.from({
  length: repeat
}).flatMap(() => icons);
export default function IntegrationHero() {
  // Dela upp logotyperna i två rader
  const halfLength = Math.ceil(ALL_PROGRAM_LOGOS.length / 2);
  const row1 = ALL_PROGRAM_LOGOS.slice(0, halfLength);
  const row2 = ALL_PROGRAM_LOGOS.slice(halfLength);

  return <section className="relative py-12 md:py-16 overflow-hidden">
      <div className="relative w-full px-6 md:px-12 text-center">
        
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-3">
          Programmen vi jobbar med
        </h1>
        <p className="mt-2 text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
          Vi integrerar sömlöst med alla era befintliga system och verktyg.
        </p>
        

        <div className="mt-8 md:mt-10 overflow-hidden relative pb-2">
          <div className="flex gap-8 md:gap-10 whitespace-nowrap animate-scroll-left">
            {repeatedIcons(row1, 3).map((src, i) => <div key={i} className="h-16 w-16 md:h-20 md:w-20 flex-shrink-0 rounded-xl bg-card shadow-md flex items-center justify-center border border-border p-3">
                <img src={src} alt="integration icon" className="h-10 w-10 md:h-12 md:w-12 object-contain" />
              </div>)}
          </div>

          <div className="flex gap-8 md:gap-10 whitespace-nowrap mt-4 md:mt-6 animate-scroll-right">
            {repeatedIcons(row2, 3).map((src, i) => <div key={i} className="h-16 w-16 md:h-20 md:w-20 flex-shrink-0 rounded-xl bg-card shadow-md flex items-center justify-center border border-border p-3">
                <img src={src} alt="integration icon" className="h-10 w-10 md:h-12 md:w-12 object-contain" />
              </div>)}
          </div>
        </div>
      </div>
    </section>;
}