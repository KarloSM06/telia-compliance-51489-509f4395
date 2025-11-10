"use client"

import React, { useState, useEffect, useRef } from "react";
import { expertiseCategories } from "@/data/expertise";

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
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);

  // Dela upp programmen i två rader
  const halfLength = Math.ceil(ALL_PROGRAMS.length / 2);
  const row1 = ALL_PROGRAMS.slice(0, halfLength);
  const row2 = ALL_PROGRAMS.slice(halfLength);

  // Smooth requestAnimationFrame animation
  useEffect(() => {
    let topAnimationId: number;
    let bottomAnimationId: number;
    let topPosition = 0;
    let bottomPosition = 0;

    const animateTopRow = () => {
      if (topRowRef.current) {
        topPosition -= 0.5;
        if (Math.abs(topPosition) >= topRowRef.current.scrollWidth / 2) {
          topPosition = 0;
        }
        topRowRef.current.style.transform = `translateX(${topPosition}px)`;
      }
      topAnimationId = requestAnimationFrame(animateTopRow);
    };

    const animateBottomRow = () => {
      if (bottomRowRef.current) {
        bottomPosition -= 0.65;
        if (Math.abs(bottomPosition) >= bottomRowRef.current.scrollWidth / 2) {
          bottomPosition = 0;
        }
        bottomRowRef.current.style.transform = `translateX(${bottomPosition}px)`;
      }
      bottomAnimationId = requestAnimationFrame(animateBottomRow);
    };

    topAnimationId = requestAnimationFrame(animateTopRow);
    bottomAnimationId = requestAnimationFrame(animateBottomRow);

    return () => {
      cancelAnimationFrame(topAnimationId);
      cancelAnimationFrame(bottomAnimationId);
    };
  }, []);

  return (
    <section className="relative w-full min-h-screen overflow-hidden flex items-center justify-center">
      {/* Carousel container - fullscreen */}
      <div className="relative w-full h-[400px] overflow-x-hidden">
        {/* Rad 1 - scrollar åt vänster */}
        <div
          ref={topRowRef}
          className="flex gap-6 md:gap-8 whitespace-nowrap absolute top-20"
          style={{ willChange: "transform" }}
          >
            {repeatedIcons(row1, 4).map((program, i) => (
              <div
                key={i}
                className="h-20 w-20 md:h-24 md:w-24 flex-shrink-0 rounded-2xl bg-card flex items-center justify-center p-3 transition-all duration-300 hover:scale-110 transform-gpu relative group hover:z-[100]"
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.04) 0px 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 1px 1px 0px, rgba(0, 0, 0, 0.04) 0px 3px 3px -1.4px, rgba(0, 0, 0, 0.04) 0px 6px 6px -3px, rgba(0, 0, 0, 0.04) 0px 12px 12px -6px"
                }}
                onMouseEnter={() => setHoveredProgram(program.name)}
                onMouseLeave={() => setHoveredProgram(null)}
              >
                <img
                  src={program.logo}
                  alt={program.name}
                  loading="lazy"
                  decoding="async"
                  className="h-10 w-10 md:h-12 md:w-12 object-contain"
                />
                
                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[110]">
                  <div className="bg-foreground text-background px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
                    {program.name}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                      <div className="border-4 border-transparent border-t-foreground"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        {/* Rad 2 - scrollar åt höger */}
        <div
          ref={bottomRowRef}
          className="flex gap-6 md:gap-8 whitespace-nowrap absolute top-[220px]"
          style={{ willChange: "transform" }}
          >
            {repeatedIcons(row2, 4).map((program, i) => (
              <div
                key={i}
                className="h-20 w-20 md:h-24 md:w-24 flex-shrink-0 rounded-2xl bg-card flex items-center justify-center p-3 transition-all duration-300 hover:scale-110 transform-gpu relative group hover:z-[100]"
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.04) 0px 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 1px 1px 0px, rgba(0, 0, 0, 0.04) 0px 3px 3px -1.4px, rgba(0, 0, 0, 0.04) 0px 6px 6px -3px, rgba(0, 0, 0, 0.04) 0px 12px 12px -6px"
                }}
                onMouseEnter={() => setHoveredProgram(program.name)}
                onMouseLeave={() => setHoveredProgram(null)}
              >
                <img
                  src={program.logo}
                  alt={program.name}
                  loading="lazy"
                  decoding="async"
                  className="h-10 w-10 md:h-12 md:w-12 object-contain"
                />
                
                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-[110]">
                  <div className="bg-foreground text-background px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
                    {program.name}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                      <div className="border-4 border-transparent border-t-foreground"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        {/* Fade overlays - förbättrade */}
        <div 
          className="absolute top-0 left-0 bottom-0 w-60 h-[400px] z-10 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(90deg, hsl(var(--background)), rgba(0, 0, 0, 0))"
          }}
        />
        <div 
          className="absolute top-0 right-0 bottom-0 w-60 h-[400px] z-10 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(90deg, rgba(0, 0, 0, 0), hsl(var(--background)))"
          }}
        />
      </div>
    </section>
  );
}