import { Button } from "@/components/ui/button";
import React from "react";
const ICONS_ROW1 = ["https://cdn-icons-png.flaticon.com/512/5968/5968854.png", "https://cdn-icons-png.flaticon.com/512/732/732221.png", "https://cdn-icons-png.flaticon.com/512/733/733609.png", "https://cdn-icons-png.flaticon.com/512/732/732084.png", "https://cdn-icons-png.flaticon.com/512/733/733585.png", "https://cdn-icons-png.flaticon.com/512/281/281763.png", "https://cdn-icons-png.flaticon.com/512/888/888879.png"];
const ICONS_ROW2 = ["https://cdn-icons-png.flaticon.com/512/174/174857.png", "https://cdn-icons-png.flaticon.com/512/906/906324.png", "https://cdn-icons-png.flaticon.com/512/888/888841.png", "https://cdn-icons-png.flaticon.com/512/5968/5968875.png", "https://cdn-icons-png.flaticon.com/512/906/906361.png", "https://cdn-icons-png.flaticon.com/512/732/732190.png", "https://cdn-icons-png.flaticon.com/512/888/888847.png"];
const repeatedIcons = (icons: string[], repeat = 4) => Array.from({
  length: repeat
}).flatMap(() => icons);
export default function IntegrationHero() {
  return <section className="relative py-48 md:py-64 overflow-hidden">
      <div className="relative w-full px-6 md:px-12 text-center">
        
        <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-foreground mb-6">
          Programmen vi jobbar med
        </h1>
        <p className="mt-6 text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto">
          250+ applikationer är tillgängliga för att integreras sömlöst med ditt arbetsflöde.
        </p>
        

        <div className="mt-16 md:mt-24 overflow-hidden relative pb-4">
          <div className="flex gap-16 md:gap-24 whitespace-nowrap animate-scroll-left">
            {repeatedIcons(ICONS_ROW1, 4).map((src, i) => <div key={i} className="h-24 w-24 md:h-32 md:w-32 lg:h-40 lg:w-40 flex-shrink-0 rounded-2xl bg-card shadow-lg flex items-center justify-center border border-border p-4">
                <img src={src} alt="integration icon" className="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 object-contain" />
              </div>)}
          </div>

          <div className="flex gap-16 md:gap-24 whitespace-nowrap mt-8 md:mt-12 animate-scroll-right">
            {repeatedIcons(ICONS_ROW2, 4).map((src, i) => <div key={i} className="h-24 w-24 md:h-32 md:w-32 lg:h-40 lg:w-40 flex-shrink-0 rounded-2xl bg-card shadow-lg flex items-center justify-center border border-border p-4">
                <img src={src} alt="integration icon" className="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 object-contain" />
              </div>)}
          </div>
        </div>
      </div>
    </section>;
}