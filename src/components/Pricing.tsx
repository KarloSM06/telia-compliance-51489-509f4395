import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { DemoBooking } from "@/components/DemoBooking";

export const Pricing = () => {
  const plan = {
    name: "💼 AI Samtalsgranskning",
    price: "599 kr",
    period: "/agent/månad",
    description: "Få en komplett översikt över era säljsamtal med vår AI-drivna analys.",
    features: [
      "Automatiserad kvalitetsgranskning av alla samtal",
      "Kontroll mot aktuella riktlinjer och produktregler",
      "Dashboard med totalscore 0–100% per samtal",
      "Veckovisa sammanfattningar och förbättringstips",
      "AI-driven analys och trendanalys",
      "Support & systemintegration",
    ],
    buttonText: "Boka demo och få offert",
  };

  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Prissättning
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Komplett AI-driven analys av era säljsamtal med kvalitetsgranskning.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-md">
          <Card className="relative shadow-card hover:shadow-elegant transition-all duration-300 ring-2 ring-primary scale-105">
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
              
              <DemoBooking>
                <Button
                  variant="hero"
                  className="w-full mt-6"
                  size="lg"
                >
                  {plan.buttonText}
                </Button>
              </DemoBooking>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};