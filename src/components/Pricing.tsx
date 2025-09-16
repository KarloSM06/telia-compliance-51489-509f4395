import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { DemoBooking } from "@/components/DemoBooking";

export const Pricing = () => {
  const plans = [
    {
      name: "💼 Starter",
      price: "699 kr",
      period: "/agent/månad",
      description: "Få en komplett översikt över era säljsamtal med vår AI-drivna analys.",
      features: [
        "1–5 agenter",
        "Automatiserad kvalitetsgranskning av alla samtal",
        "Kontroll mot aktuella riktlinjer och produktregler",
        "Dashboard med totalscore 0–100% per samtal",
        "Veckovisa sammanfattningar och förbättringstips",
        "Standard integration & e-postsupport",
      ],
      buttonText: "Boka demo",
      popular: false,
    },
    {
      name: "📈 Business",
      price: "599 kr",
      period: "/agent/månad",
      description: "Samma kraftfulla analys som Starter, men med extra support och enklare systemintegration.",
      features: [
        "6–20 agenter",
        "Automatiserad kvalitetskontroll och förbättringsförslag",
        "Dashboard med totalscore och trendanalys per agent",
        "Veckovisa insikter och rekommendationer",
        "Prioriterad support & enkel CRM-integration",
      ],
      buttonText: "Boka demo",
      popular: true,
    },
    {
      name: "🏢 Enterprise",
      price: "499 kr",
      period: "/agent/månad",
      description: "För större team som vill ha full kontroll över kvalitet och compliance.",
      features: [
        "21+ agenter",
        "AI-driven analys och automatiserad kvalitetsgranskning",
        "Skräddarsydd dashboard med realtidsinsikter per agent och team",
        "Veckovisa rapporter och trendanalys",
        "Dedikerad kundansvarig & full systemintegration",
      ],
      buttonText: "Kontakta oss",
      popular: false,
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Välj din plan
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Alla paket inkluderar samma AI-analyser och kvalitetskontroll.<br />
            Skillnaden ligger i supportnivå och integration, samt pris per agent.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative shadow-card hover:shadow-elegant transition-all duration-300 ${
                plan.popular ? "ring-2 ring-primary scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
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
                <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-4 w-4 text-success mr-3 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.name === "Enterprise" ? (
                  <Button
                    variant={plan.popular ? "hero" : "default"}
                    className="w-full mt-6"
                    size="lg"
                  >
                    {plan.buttonText}
                  </Button>
                ) : (
                  <DemoBooking>
                    <Button
                      variant={plan.popular ? "hero" : "default"}
                      className="w-full mt-6"
                      size="lg"
                    >
                      {plan.buttonText}
                    </Button>
                  </DemoBooking>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};