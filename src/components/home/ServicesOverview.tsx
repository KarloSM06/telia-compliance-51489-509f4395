import { FileText, Bot, BarChart3, Layout, Zap, HeadphonesIcon } from "lucide-react";
import { ServiceCard } from "@/components/services/ServiceCard";
import { AnimatedSection } from "@/components/AnimatedSection";

export function ServicesOverview() {
  const services = [
    {
      title: "Offert & Faktura",
      description: "Automatisera hela processen från offertförfrågan till fakturering med AI-driven prisberäkning och uppföljning.",
      icon: FileText,
      href: "/tjanster/offert-faktura",
      features: [
        "Automatisk offertgenerering",
        "AI-driven prisberäkning",
        "Automatisk fakturering"
      ]
    },
    {
      title: "AI-Receptionist",
      description: "24/7 kundservice som svarar på frågor, bokar möten och hanterar både SMS och email automatiskt.",
      icon: Bot,
      href: "/tjanster/ai-receptionist",
      features: [
        "Svara på frågor dygnet runt",
        "Automatisk mötesbokning",
        "Flerspråkigt stöd"
      ]
    },
    {
      title: "CRM & Analytics",
      description: "Komplett system för leadhantering med ROI-spårning, kommunikationsanalys och anpassade rapporter.",
      icon: BarChart3,
      href: "/tjanster/crm-analytics",
      features: [
        "Lead tracking & management",
        "ROI dashboard",
        "Custom reporting"
      ]
    },
    {
      title: "Anpassade Dashboards",
      description: "Skräddarsydda webbapplikationer och dashboards som du äger helt – med full kontroll över kod och data.",
      icon: Layout,
      href: "/tjanster/custom-dashboards",
      features: [
        "Full kod-äganderätt",
        "Skräddarsydd design",
        "Mobil-responsiv"
      ]
    },
    {
      title: "Workflow Automationer",
      description: "Automatisera repetitiva processer som datahantering, email-flöden och rapportgenerering.",
      icon: Zap,
      href: "/tjanster/automationer",
      features: [
        "Data entry automation",
        "Email workflows",
        "Report generation"
      ]
    },
    {
      title: "Support & Konsultation",
      description: "Kontinuerlig support, träning och konsultation för att säkerställa att din lösning fungerar optimalt.",
      icon: HeadphonesIcon,
      href: "/hur-det-funkar",
      features: [
        "Teknisk support",
        "Användarträning",
        "Strategisk rådgivning"
      ]
    }
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,hsl(var(--primary)/0.12),transparent_50%)]" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-block">
            <h2 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
              Våra tjänster
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50" />
          </div>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mt-6 font-light">
            Från AI-driven automation till skräddarsydda lösningar – allt anpassat efter dina behov
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <AnimatedSection key={service.title} delay={index * 100}>
              <ServiceCard {...service} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}