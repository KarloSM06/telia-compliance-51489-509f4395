import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export const Pricing = () => {
  const plans = [
    {
      name: "Standard",
      price: "500 kr",
      period: "/agent/månad",
      description: "Compliance-fokus för QA och ledning",
      features: [
        "Analys av alla säljsamtal",
        "Identifiering av överträdelser mot riktlinjer eller lagar",
        "Kvalitetsvarning för varje överträdelse",
        "Visar tidpunkt & typ av regelbrott",
        "Enkel rapportering per agent",
        "Inkluderar upp till 100 samtal/månad",
      ],
      priceId: "price_standard_monthly",
      addons: [
        { name: "AI-coach", price: "+199 kr", description: "Analys & feedback på upp till 20 samtal/månad" },
        { name: "Systemintegration", price: "+199 kr", description: "Integration mot Loxysoft/CRM" },
      ],
    },
    {
      name: "Pro",
      price: "849 kr",
      period: "/agent/månad",
      description: "Bundle med coachning och integration",
      features: [
        "Allt i Standard",
        "AI-coach: Analys & feedback på upp till 20 samtal/månad",
        "Systemintegration mot Loxysoft/CRM",
        "Inkluderar upp till 100 samtal/månad",
      ],
      priceId: "price_pro_monthly",
      highlighted: true,
      badge: "Standard + Coach + Integration",
    },
    {
      name: "Premium",
      price: "1 300 kr",
      period: "/agent/månad",
      description: "Fullt ledningsverktyg med team-analys",
      features: [
        "Allt i Pro",
        "Avancerad dashboard för ledning",
        "Team- och KPI-översikt",
        "Proaktiva alerts & notifikationer",
        "Risk för tappad kund",
        "Låg följsamhet",
        "Avvikelser i prestation",
        "Inkluderar upp till 100 samtal/månad",
      ],
      priceId: "price_premium_monthly",
      badge: "Fokus på ledning",
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
              
              {plan.badge && !plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-muted text-foreground px-4 py-1 rounded-full text-xs font-semibold">
                    {plan.badge}
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-xl text-foreground">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
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
                
                {plan.addons && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">TILLÄGG:</p>
                    {plan.addons.map((addon, addonIndex) => (
                      <div key={addonIndex} className="text-xs text-muted-foreground mb-1">
                        <span className="font-semibold">{addon.name}</span> {addon.price} - {addon.description}
                      </div>
                    ))}
                  </div>
                )}
                
                <Button
                  variant={plan.highlighted ? "hero" : "outline"}
                  className="w-full mt-6"
                  size="lg"
                  onClick={() => window.location.href = '/auth'}
                >
                  Kom igång
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-4">Extra samtalsvolym</h3>
          <div className="max-w-2xl mx-auto">
            <div className="p-6 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground mb-2">
                Alla planer inkluderar upp till 100 samtal per agent och månad
              </p>
              <p className="text-lg font-semibold text-foreground">
                Extra samtal: 2 kr/samtal
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                (Premium: 1 kr/samtal)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};