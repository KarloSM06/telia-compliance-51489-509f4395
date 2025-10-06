import { Upload, Bot, BarChart3 } from "lucide-react";
export const HowItWorks = () => {
  const steps = [{
    icon: Upload,
    title: "1. Samtal laddas upp",
    description: "Integrera ditt system eller ladda upp ljudfiler batch-vis."
  }, {
    icon: Bot,
    title: "2. AI granskar",
    description: "Samtalen granskas av AI för att säkerställa att lagar och riktlinjer följs"
  }, {
    icon: BarChart3,
    title: "3. Tydliga rapporter",
    description: "Få detaljerade rapporter och insikter direkt i dashboarden."
  }];
  return <section className="py-24 bg-gradient-card">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Så här fungerar det
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">Manuell granskning av samtal är tidskrävande och inkonsekvent. Hiems AI analyserar era samtal automatiskt. Varje samtal granskas för att säkra att inga lagar eller riktlinjer bryts, samt analyseras säljtekniskt för att öka er försäljning. </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {steps.map((step, index) => <div key={index} className="relative rounded-lg bg-card p-8 shadow-card hover:shadow-elegant transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {step.description}
                </p>
              </div>)}
          </div>
        </div>
      </div>
    </section>;
};