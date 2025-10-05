import { Upload, Bot, BarChart3 } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: "1. Automatisk integration",
      description: "Koppla Hiems till ert befintliga system (Loxysoft, CRM) eller ladda upp samtal manuellt.",
    },
    {
      icon: Bot,
      title: "2. AI analyserar varje samtal",
      description: "Transkribering, compliance-kontroll och kvalitetsanalys sker automatiskt inom minuter.",
    },
    {
      icon: BarChart3,
      title: "3. Få insikter direkt",
      description: "Se överträdelser, trender och förbättringsområden i er dashboard. Exportera rapporter enkelt.",
    },
  ];

  return (
    <section className="py-24 bg-gradient-card">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Problemet vi löser
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Manuell kvalitetsgranskning är tidskrävande, inkonsekvent och skalas inte. 
            Hiems AI analyserar 100% av era samtal automatiskt.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative rounded-lg bg-card p-8 shadow-card hover:shadow-elegant transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};