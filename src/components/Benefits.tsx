import { CheckCircle2, Eye, Calendar, Shield } from "lucide-react";

export const Benefits = () => {
  const benefits = [
    {
      icon: Shield,
      title: "100% Compliance",
      description: "AI granskar varje samtal mot era riktlinjer och lagar. Minska risken för böter och varumärkesskador.",
    },
    {
      icon: CheckCircle2,
      title: "Öka försäljningen med 15-30%",
      description: "Identifiera vad som fungerar i godkända samtal och coacha säljare till bättre resultat.",
    },
    {
      icon: Eye,
      title: "Spara 20 timmar/vecka",
      description: "Automatisera kvalitetsgranskning istället för att lyssna manuellt på hundratals samtal.",
    },
    {
      icon: Calendar,
      title: "Dagliga insikter",
      description: "Få automatiska rapporter med trender, varningar och förbättringsförslag varje dag.",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Konkreta resultat för ditt team
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Våra kunder ser mätbara förbättringar inom första månaden
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center group"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 group-hover:bg-success/20 transition-colors duration-300">
                  <benefit.icon className="h-8 w-8 text-success" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};