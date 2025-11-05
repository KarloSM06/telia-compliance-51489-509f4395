import { Button } from "@/components/ui/button";
import React from "react";
const ICONS_ROW1 = [
  "/images/logos/openai-new.png",
  "/images/logos/claude.png",
  "/images/logos/deepseek.png",
  "/images/logos/gemini.png",
  "/images/logos/vapi.png",
  "/images/logos/retell-backup.png",
  "/images/logos/n8n.png",
  "/images/logos/make.png",
  "/images/logos/lovable.png"
];

const ICONS_ROW2 = [
  "/images/logos/telnyx.png",
  "/images/logos/twilio.png",
  "/images/logos/google-calendar.png",
  "/images/logos/outlook.png",
  "/images/logos/calendly.png",
  "/images/logos/apollo.png",
  "/images/logos/apify.png",
  "/images/logos/eniro.png",
  "/images/logos/explorium.png"
];
const repeatedIcons = (icons: string[], repeat = 4) => Array.from({
  length: repeat
}).flatMap(() => icons);
export default function IntegrationHero() {
  return <section className="relative py-64 overflow-hidden">

      <div className="relative max-w-7xl mx-auto px-6 text-center">
        
        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground">
          Programmen vi jobbar med
        </h1>
        <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
          18+ kraftfulla verktyg som arbetar sömlöst tillsammans i era AI-lösningar
        </p>
        

        <div className="mt-20 overflow-hidden relative pb-2">
          <div className="flex gap-20 whitespace-nowrap animate-scroll-left">
            {repeatedIcons(ICONS_ROW1, 4).map((src, i) => <div key={i} className="h-32 w-32 flex-shrink-0 rounded-2xl bg-card shadow-lg flex items-center justify-center border border-border p-4">
                <img src={src} alt="integration icon" className="h-20 w-20 object-contain" />
              </div>)}
          </div>

          <div className="flex gap-20 whitespace-nowrap mt-10 animate-scroll-right">
            {repeatedIcons(ICONS_ROW2, 4).map((src, i) => <div key={i} className="h-32 w-32 flex-shrink-0 rounded-2xl bg-card shadow-lg flex items-center justify-center border border-border p-4">
                <img src={src} alt="integration icon" className="h-20 w-20 object-contain" />
              </div>)}
          </div>

          <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
      </div>
    </section>;
}