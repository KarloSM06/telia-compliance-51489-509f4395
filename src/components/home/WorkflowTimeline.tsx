import { Timeline } from "@/components/ui/timeline";
import { Calendar, FileText, Settings, CheckCircle, Rocket } from "lucide-react";

export const WorkflowTimeline = () => {
  const data = [
    {
      title: "Steg 1",
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Gratis behovsanalys
              </h4>
              <p className="text-sm text-primary font-semibold mb-3">
                Dag 1 – Startmöte & förväntanssättning
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Vi börjar med att förstå era behov, mål och nuvarande arbetssätt.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-2">
                Du får en onboarding-guide och en tydlig tidsplan för hela processen.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Steg 2",
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Offertmöte
              </h4>
              <p className="text-sm text-primary font-semibold mb-3">
                Dag 3–5 – Insamling av kunddata
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Tillsammans går vi igenom lösningsförslaget och samlar in den information som behövs.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-2">
                Ni fyller i vårt onboardingformulär – och vi säkerställer ett komplett dataunderlag för implementation.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Steg 3",
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Onboarding & teknisk implementation
              </h4>
              <p className="text-sm text-primary font-semibold mb-3">
                Dag 7–14 – Konfiguration & integration
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Vi anpassar AI-receptionisten efter era behov och integrerar den med era befintliga system.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-2">
                Resultatet: en färdig AI-lösning redo för test.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Steg 4",
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Test & justering
              </h4>
              <p className="text-sm text-primary font-semibold mb-3">
                Dag 15 – Live-demo & feedback
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Ni får testa lösningen i realtid.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-2">
                Vi går igenom resultatet tillsammans och gör eventuella justeringar tills allt känns perfekt.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Steg 5",
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Rocket className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Driftstart & uppföljning
              </h4>
              <p className="text-sm text-primary font-semibold mb-3">
                Dag 16+ – Aktiv pilot & kontinuerlig optimering
              </p>
              <p className="text-muted-foreground leading-relaxed">
                AI-receptionisten går live!
              </p>
              <p className="text-muted-foreground leading-relaxed mt-2">
                Vi följer upp efter 7 dagar, ger löpande support och optimerar systemet baserat på verklig användning.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return <Timeline data={data} />;
};
