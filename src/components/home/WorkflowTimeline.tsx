import { Timeline } from "@/components/ui/timeline";
import { Calendar, FileText, Settings, CheckCircle, Rocket } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ReactNode } from "react";
export const WorkflowTimeline = () => {
  const data = [{
    title: "Steg 1",
    content: <Card className="group border-0 bg-muted shadow-none">
          <CardHeader className="pb-3">
            <CardDecorator>
              <Calendar className="h-6 w-6 text-primary" />
            </CardDecorator>
            
            <h4 className="mt-6 text-2xl md:text-3xl font-bold text-foreground text-center">
              Analys & Kartläggning
            </h4>
            
            <p className="text-sm text-primary font-semibold text-center">
              Vi identifierar flaskhalsar, manuella processer och AI-potential
            </p>
          </CardHeader>
          
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              Vi börjar med att förstå era behov, mål och nuvarande arbetssätt genom intervjuer med nyckelpersoner.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              Vi analyserar nuvarande flöden och identifierar områden där AI kan göra störst skillnad.
            </p>
          </CardContent>
        </Card>
  }, {
    title: "Steg 2",
    content: <Card className="group border-0 bg-muted shadow-none">
          <CardHeader className="pb-3">
            <CardDecorator>
              <Settings className="h-6 w-6 text-primary" />
            </CardDecorator>
            
            <h4 className="mt-6 text-2xl md:text-3xl font-bold text-foreground text-center">
              Utveckling & Design
            </h4>
            
            <p className="text-sm text-primary font-semibold text-center">
              Våra ingenjörer skapar anpassade AI-agenter, automationer och datamodeller
            </p>
          </CardHeader>
          
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              Vi utvecklar första versionen av er AI-lösning baserat på behovsanalysen.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              Kontinuerliga feedback-sessioner säkerställer att lösningen möter era förväntningar.
            </p>
          </CardContent>
        </Card>
  }, {
    title: "Steg 3",
    content: <Card className="group border-0 bg-muted shadow-none">
          <CardHeader className="pb-3">
            <CardDecorator>
              <CheckCircle className="h-6 w-6 text-primary" />
            </CardDecorator>
            
            <h4 className="mt-6 text-2xl md:text-3xl font-bold text-foreground text-center">
              Integrering i ditt system
            </h4>
            
            <p className="text-sm text-primary font-semibold text-center">
              Vi kopplar ihop AI:n med era befintliga verktyg – utan att störa den dagliga driften
            </p>
          </CardHeader>
          
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              Vi integrerar AI-lösningen sömlöst med era befintliga system och verktyg.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              Pilot i produktion startar och vi säkerställer att allt fungerar perfekt.
            </p>
          </CardContent>
        </Card>
  }, {
    title: "Steg 4",
    content: <Card className="group border-0 bg-muted shadow-none">
          <CardHeader className="pb-3">
            <CardDecorator>
              <Rocket className="h-6 w-6 text-primary" />
            </CardDecorator>
            
            <h4 className="mt-6 text-2xl md:text-3xl font-bold text-foreground text-center">
              Optimering & Skalning
            </h4>
            
            <p className="text-sm text-primary font-semibold text-center">
              Vi mäter, förbättrar och expanderar – så att AI-lösningen växer med er verksamhet
            </p>
          </CardHeader>
          
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              Full rollout med kontinuerlig övervakning och optimering baserat på verklig data.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              Vi följer upp regelbundet och skalerar lösningen efter era behov och tillväxt.
            </p>
          </CardContent>
        </Card>
  }];
  return <Timeline data={data} />;
};
const CardDecorator = ({
  children
}: {
  children: ReactNode;
}) => <div aria-hidden className="relative mx-auto size-24 md:size-32 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:24px_24px] opacity-10" />
    
  </div>;