import { Calendar, FileText, Settings, CheckCircle, Rocket } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
const SimpleTimeline = ({
  data
}: {
  data: {
    title: string;
    content: ReactNode;
  }[];
}) => {
  const shouldReduceMotion = useReducedMotion();
  return <div className="relative mx-auto w-full max-w-5xl space-y-12 py-12">
      {data.map((item, index) => <motion.div key={index} initial={shouldReduceMotion ? {} : {
      opacity: 0,
      y: 20
    }} whileInView={shouldReduceMotion ? {} : {
      opacity: 1,
      y: 0
    }} viewport={{
      once: true
    }} transition={{
      delay: index * 0.1,
      duration: 0.5
    }} className="relative">
          {item.content}
        </motion.div>)}
    </div>;
};
export const WorkflowTimeline = () => {
  const data = [{
    title: "Steg 1",
    content: <Card className="group border-0 bg-muted shadow-none">
          <CardHeader className="pb-3">
            <CardDecorator>
              <Calendar className="h-6 w-6 text-primary" />
            </CardDecorator>
            
            <h4 className="mt-6 text-2xl md:text-3xl font-bold text-foreground text-center">
              Gratis behovsanalys
            </h4>
            
            <p className="text-sm text-primary font-semibold text-center">
              Dag 1 – Startmöte & förväntanssättning
            </p>
          </CardHeader>
          
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              Vi börjar med att förstå era behov, mål och nuvarande arbetssätt.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              Du får en onboarding-guide och en tydlig tidsplan för hela processen.
            </p>
          </CardContent>
        </Card>
  }, {
    title: "Steg 2",
    content: <Card className="group border-0 bg-muted shadow-none">
          <CardHeader className="pb-3">
            <CardDecorator>
              <FileText className="h-6 w-6 text-primary" />
            </CardDecorator>
            
            <h4 className="mt-6 text-2xl md:text-3xl font-bold text-foreground text-center">
              Offertmöte
            </h4>
            
            <p className="text-sm text-primary font-semibold text-center">
              Dag 3–5 – Insamling av kunddata
            </p>
          </CardHeader>
          
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              Tillsammans går vi igenom lösningsförslaget och samlar in den information som behövs.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              Ni fyller i vårt onboardingformulär – och vi säkerställer ett komplett dataunderlag för implementation.
            </p>
          </CardContent>
        </Card>
  }, {
    title: "Steg 3",
    content: <Card className="group border-0 bg-muted shadow-none">
          <CardHeader className="pb-3">
            <CardDecorator>
              <Settings className="h-6 w-6 text-primary" />
            </CardDecorator>
            
            <h4 className="mt-6 text-2xl md:text-3xl font-bold text-foreground text-center">
              Onboarding & teknisk implementation
            </h4>
            
            <p className="text-sm text-primary font-semibold text-center">
              Dag 7–14 – Konfiguration & integration
            </p>
          </CardHeader>
          
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              Vi anpassar AI-receptionisten efter era behov och integrerar den med era befintliga system.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              Resultatet: en färdig AI-lösning redo för test.
            </p>
          </CardContent>
        </Card>
  }, {
    title: "Steg 4",
    content: <Card className="group border-0 bg-muted shadow-none">
          <CardHeader className="pb-3">
            <CardDecorator>
              <CheckCircle className="h-6 w-6 text-primary" />
            </CardDecorator>
            
            <h4 className="mt-6 text-2xl md:text-3xl font-bold text-foreground text-center">
              Test & justering
            </h4>
            
            <p className="text-sm text-primary font-semibold text-center">
              Dag 15 – Live-demo & feedback
            </p>
          </CardHeader>
          
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              Ni får testa lösningen i realtid.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              Vi går igenom resultatet tillsammans och gör eventuella justeringar tills allt känns perfekt.
            </p>
          </CardContent>
        </Card>
  }, {
    title: "Steg 5",
    content: <Card className="group border-0 bg-muted shadow-none">
          <CardHeader className="pb-3">
            <CardDecorator>
              <Rocket className="h-6 w-6 text-primary" />
            </CardDecorator>
            
            <h4 className="mt-6 text-2xl md:text-3xl font-bold text-foreground text-center">
              Driftstart & uppföljning
            </h4>
            
            <p className="text-sm text-primary font-semibold text-center">
              Dag 16+ – Aktiv pilot & kontinuerlig optimering
            </p>
          </CardHeader>
          
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              AI-receptionisten går live!
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              Vi följer upp efter 7 dagar, ger löpande support och optimerar systemet baserat på verklig användning.
            </p>
          </CardContent>
        </Card>
  }];
  return <SimpleTimeline data={data} />;
};
const CardDecorator = ({
  children
}: {
  children: ReactNode;
}) => <div aria-hidden className="relative mx-auto size-24 md:size-32 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:24px_24px] opacity-10" />
    
  </div>;