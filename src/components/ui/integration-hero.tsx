import React from "react";
import { expertiseCategories } from "@/data/expertise";

// Samla alla program-logotyper från expertise data
const ALL_PROGRAM_LOGOS = expertiseCategories.flatMap(cat => 
  cat.items.map(item => item.logo).filter(Boolean)
) as string[];

// Optimerad repetition för sömlös loop - 4 repetitioner för -50% animation
const repeatedIcons = (icons: string[], repeat = 4) => Array.from({
  length: repeat
}).flatMap(() => icons);

export default function IntegrationHero() {
  // Dela upp logotyperna i två rader
  const halfLength = Math.ceil(ALL_PROGRAM_LOGOS.length / 2);
  const row1 = ALL_PROGRAM_LOGOS.slice(0, halfLength);
  const row2 = ALL_PROGRAM_LOGOS.slice(halfLength);

  return <section className="relative py-8 md:py-12 overflow-hidden">
      <div className="relative w-full px-6 md:px-12 text-center">
        
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-3">
          Programmen vi jobbar med
        </h1>
        <p className="mt-2 text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
          Vi integrerar sömlöst med alla era befintliga system och verktyg.
        </p>
        
        <div className="mt-6 md:mt-8 overflow-hidden relative pb-2">
          {/* Rad 1 - scrollar åt vänster */}
          <div className="flex gap-10 whitespace-nowrap animate-scroll-left">
            {repeatedIcons(row1, 4).map((src, i) => (
              <div key={i} className="h-16 w-16 md:h-20 md:w-20 flex-shrink-0 rounded-full bg-card shadow-md flex items-center justify-center border border-border p-3">
                <img src={src} alt="integration icon" className="h-10 w-10 md:h-12 md:w-12 object-contain" />
              </div>
            ))}
          </div>

          {/* Rad 2 - scrollar åt höger */}
          <div className="flex gap-10 whitespace-nowrap mt-4 md:mt-6 animate-scroll-right">
            {repeatedIcons(row2, 4).map((src, i) => (
              <div key={i} className="h-16 w-16 md:h-20 md:w-20 flex-shrink-0 rounded-full bg-card shadow-md flex items-center justify-center border border-border p-3">
                <img src={src} alt="integration icon" className="h-10 w-10 md:h-12 md:w-12 object-contain" />
              </div>
            ))}
          </div>

          {/* Fade overlays */}
          <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
      </div>
      
      {/* Inline styles för stabil animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }
        .animate-scroll-right {
          animation: scroll-right 30s linear infinite;
        }
      `}} />
    </section>;
}