import { Calendar, FileText, Settings, CheckCircle, Rocket } from "lucide-react";
import { OnboardingStepCard } from "./OnboardingStepCard";
import { OptimizedAnimatedSection } from "@/components/OptimizedAnimatedSection";

const onboardingSteps = [
  {
    day: "Dag 1",
    title: "Startmöte & förväntanssättning",
    description: "Vi träffas för att förstå era behov och mål",
    deliverable: "Onboarding-guide + tidsplan levereras",
    icon: Calendar,
    image: undefined // Add image URL here when ready
  },
  {
    day: "Dag 3-5",
    title: "Insamling av kunddata",
    description: "Ni fyller i onboardingformulär och delar nödvändig information",
    deliverable: "Komplett dataunderlag för implementation",
    icon: FileText,
    image: undefined // Add image URL here when ready
  },
  {
    day: "Dag 7-14",
    title: "Teknisk implementation",
    description: "Vi konfigurerar AI-receptionist och integrerar med era befintliga system",
    deliverable: "Färdig AI-lösning redo för test",
    icon: Settings,
    image: undefined // Add image URL here when ready
  },
  {
    day: "Dag 15",
    title: "Test & genomgång",
    description: "Live-demo för er organisation och justering baserat på feedback",
    deliverable: "Godkänd lösning redo för driftstart",
    icon: CheckCircle,
    image: undefined // Add image URL here when ready
  },
  {
    day: "Dag 16+",
    title: "Driftstart & uppföljning",
    description: "Aktiv pilot startar med kontinuerlig support och optimering",
    deliverable: "7-dagars check-in + löpande förbättringar",
    icon: Rocket,
    image: undefined // Add image URL here when ready
  }
];

export const OnboardingTimeline = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Grid Layout - Responsive and Symmetrical */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {onboardingSteps.map((step, index) => (
          <OptimizedAnimatedSection 
            key={index} 
            delay={index * 150}
            direction="up"
          >
            <OnboardingStepCard
              day={step.day}
              title={step.title}
              description={step.description}
              deliverable={step.deliverable}
              icon={step.icon}
              image={step.image}
              stepNumber={index + 1}
            />
          </OptimizedAnimatedSection>
        ))}
      </div>

      {/* Timeline Connection Line - Desktop Only (removed to prevent overlap) */}
    </div>
  );
};
