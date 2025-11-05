import { Button } from "@/components/ui/button";
import React from "react";
const ICONS_ROW1 = ["https://cdn-icons-png.flaticon.com/512/5968/5968854.png", "https://cdn-icons-png.flaticon.com/512/732/732221.png", "https://cdn-icons-png.flaticon.com/512/733/733609.png", "https://cdn-icons-png.flaticon.com/512/732/732084.png", "https://cdn-icons-png.flaticon.com/512/733/733585.png", "https://cdn-icons-png.flaticon.com/512/281/281763.png", "https://cdn-icons-png.flaticon.com/512/888/888879.png"];
const ICONS_ROW2 = ["https://cdn-icons-png.flaticon.com/512/174/174857.png", "https://cdn-icons-png.flaticon.com/512/906/906324.png", "https://cdn-icons-png.flaticon.com/512/888/888841.png", "https://cdn-icons-png.flaticon.com/512/5968/5968875.png", "https://cdn-icons-png.flaticon.com/512/906/906361.png", "https://cdn-icons-png.flaticon.com/512/732/732190.png", "https://cdn-icons-png.flaticon.com/512/888/888847.png"];
const repeatedIcons = (icons: string[], repeat = 4) => Array.from({
  length: repeat
}).flatMap(() => icons);
export default function IntegrationHero() {
  return <section className="relative py-32 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--foreground)/0.04)_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative max-w-7xl mx-auto px-6 text-center">
        
        <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-foreground">
          Programmen vi jobbar med
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
          250+ applikationer är tillgängliga för att integreras sömlöst med ditt arbetsflöde.
        </p>
        

        <div className="mt-12 overflow-hidden relative pb-2">
          <div className="flex gap-10 whitespace-nowrap animate-scroll-left">
            {repeatedIcons(ICONS_ROW1, 4).map((src, i) => <div key={i} className="h-16 w-16 flex-shrink-0 rounded-full bg-card shadow-md flex items-center justify-center border border-border">
                <img src={src} alt="integration icon" className="h-10 w-10 object-contain" />
              </div>)}
          </div>

          <div className="flex gap-10 whitespace-nowrap mt-6 animate-scroll-right">
            {repeatedIcons(ICONS_ROW2, 4).map((src, i) => <div key={i} className="h-16 w-16 flex-shrink-0 rounded-full bg-card shadow-md flex items-center justify-center border border-border">
                <img src={src} alt="integration icon" className="h-10 w-10 object-contain" />
              </div>)}
          </div>

          <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
      </div>
    </section>;
}