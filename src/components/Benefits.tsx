import { CheckCircle2, Eye, Calendar, Shield } from "lucide-react";

export const Benefits = () => {
  const benefits = [
    {
      icon: Eye,
      title: "Full transparens",
      description: "Se exakt vilka riktlinjer som följs eller bryts i varje samtal.",
    },
    {
      icon: Shield,
      title: "Fångar regelbrott direkt",
      description: "Identifierar samtal som bryter mot lagar eller interna riktlinjer innan det blir problem",
    },
    {
      icon: CheckCircle2,
      title: "Säkrar varumärket",
      description: "Skydda ert företags rykte genom att säkerställa att lagar och interna riktlinjer följs i varje samtal.",
    },
    {
      icon: Calendar,
      title: "Tydliga rapporter", 
      description: "Automatiska rapporter som skickas varje dag med trender och insikter.",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Fördelar med vår lösning
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Skydda ditt varumärke och säkerställ kvalitet i varje kundinteraktion
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