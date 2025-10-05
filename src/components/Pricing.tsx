import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export const Pricing = () => {
  const plans = [
    {
      name: "Smart Analys",
      price: "599 kr",
      period: "/agent/månad",
      yearlyPrice: "5 750 kr/år",
      description: "AI-analys av dina säljsamtal",
      features: [
        "Analys av säljsamtal (ej andra samtal)",
        "Kontroll mot riktlinjer och produktregler",
        "Dashboard med score 0–100%",
        "Veckovisa sammanfattningar",
        "AI-driven trendanalys",
        "Support & systemintegration",
      ],
      priceId: "price_smart_monthly", // Replace with actual Stripe price ID
      highlighted: true,
    },
    {
      name: "Full Analys",
      price: "+199 kr",
      period: "/agent/månad",
      description: "Analysera ALLA samtal, inte bara försäljning",
      features: [
        "Allt i Smart Analys",
        "Analys av ALLA samtal",
        "Kundtjänst-samtal",
        "Support-samtal",
        "Allmänna kundinteraktioner",
      ],
      priceId: "price_full_addon", // Replace with actual Stripe price ID
      addon: true,
    },
    {
      name: "Leaddesk Integration",
      price: "+199 kr",
      period: "/agent/månad",
      description: "Automatisk integration med Leaddesk",
      features: [
        "Automatisk hämtning av samtal",
        "Realtidsanalys",
        "Automatisk mappning av agenter",
        "Inga manuella uppladdningar",
      ],
      priceId: "price_leaddesk_addon", // Replace with actual Stripe price ID
      addon: true,
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Prissättning
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Flexibel prissättning som växer med dina behov
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Spara 20% med årlig betalning • Volymrabatter från 10+ agenter
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative shadow-card hover:shadow-elegant transition-all duration-300 ${
                plan.highlighted ? 'ring-2 ring-primary md:scale-105' : ''
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Populärast
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-xl text-foreground">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                {plan.yearlyPrice && (
                  <p className="text-sm text-success mt-1">{plan.yearlyPrice}</p>
                )}
                <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-4 w-4 text-success mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  variant={plan.highlighted ? "hero" : "outline"}
                  className="w-full mt-6"
                  size="lg"
                  onClick={() => window.location.href = '/auth'}
                >
                  {plan.addon ? "Lägg till" : "Kom igång"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-4">Volymrabatter</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold text-foreground">549 kr</p>
              <p className="text-sm text-muted-foreground">10-24 agenter</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold text-foreground">499 kr</p>
              <p className="text-sm text-muted-foreground">25-49 agenter</p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-2xl font-bold text-foreground">449 kr</p>
              <p className="text-sm text-muted-foreground">50+ agenter</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};