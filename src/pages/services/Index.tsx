import { FileText, Bot, BarChart3, Layout, Zap, HeadphonesIcon, ArrowRight } from "lucide-react";
import { Header1 } from "@/components/ui/header";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ConsultationModal } from "@/components/ConsultationModal";
import { Link } from "react-router-dom";

export default function ServicesIndex() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const services = [
    {
      title: "Offert & Faktura",
      description: "Automatisera hela processen från offertförfrågan till fakturering med AI-driven prisberäkning.",
      icon: FileText,
      href: "/tjanster/offert-faktura",
      features: [
        "Automatisk offertgenerering",
        "AI-driven prisberäkning",
        "Automatisk fakturering & uppföljning"
      ]
    },
    {
      title: "AI-Receptionist",
      description: "24/7 kundservice som svarar på frågor, bokar möten och hanterar både SMS och email.",
      icon: Bot,
      href: "/tjanster/ai-receptionist",
      features: [
        "Dygnet-runt-support",
        "Automatisk mötesbokning",
        "Flerspråkigt stöd"
      ]
    },
    {
      title: "CRM & Analytics",
      description: "Komplett system för leadhantering med ROI-spårning och anpassade rapporter.",
      icon: BarChart3,
      href: "/tjanster/crm-analytics",
      features: [
        "Lead tracking & management",
        "ROI dashboard",
        "Välj egen eller vår plattform"
      ]
    },
    {
      title: "Anpassade Dashboards",
      description: "Skräddarsydda webbapplikationer och dashboards som du äger helt och hållet.",
      icon: Layout,
      href: "/tjanster/custom-dashboards",
      features: [
        "Full kod-äganderätt",
        "Skräddarsydd design",
        "Modern tech stack"
      ]
    },
    {
      title: "Workflow-automationer",
      description: "Automatisera repetitiva processer som datahantering och email-flöden.",
      icon: Zap,
      href: "/tjanster/automationer",
      features: [
        "Email & data automation",
        "Workflow-byggare",
        "Integration med befintliga system"
      ]
    },
    {
      title: "Support & Konsultation",
      description: "Kontinuerlig support, träning och strategisk rådgivning för optimal drift.",
      icon: HeadphonesIcon,
      href: "/hur-det-funkar",
      features: [
        "Teknisk support",
        "Användarträning",
        "Strategisk rådgivning"
      ]
    }
  ];

  const packages = [
    {
      title: "Starter",
      price: "Från 15 000 kr",
      description: "Perfekt för småföretag som vill börja med automation",
      features: [
        "1-2 automatiseringar",
        "Basic setup & träning",
        "Email-support"
      ]
    },
    {
      title: "Professional",
      price: "Från 50 000 kr",
      description: "För företag som vill ha en komplett lösning",
      features: [
        "Custom dashboard eller app",
        "Flera integrationer",
        "Prioriterad support",
        "Kontinuerlig optimering"
      ],
      highlight: true
    },
    {
      title: "Enterprise",
      price: "Kontakta oss",
      description: "Skräddarsydda lösningar för stora organisationer",
      features: [
        "Fullständig custom-utveckling",
        "Dedikerad projektledare",
        "SLA-garantier",
        "On-premise möjlighet"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header1 />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,hsl(var(--primary)/0.15),transparent_50%)]" />
          
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <AnimatedSection className="text-center">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Våra tjänster
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12">
                Från AI-driven automation till skräddarsydda lösningar – allt ni behöver för att digitalisera och effektivisera er verksamhet
              </p>
              <Button 
                size="lg"
                className="bg-gradient-gold text-primary hover:shadow-glow transition-all duration-300 font-semibold text-lg px-8"
                onClick={() => setIsModalOpen(true)}
              >
                Boka kostnadsfri konsultation
              </Button>
            </AnimatedSection>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <AnimatedSection key={service.title} delay={index * 100}>
                  <ServiceCard {...service} />
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Packages */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-background via-primary/5 to-background">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <AnimatedSection className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Prispaket</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Välj det paket som passar era behov – eller skräddarsy en lösning
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {packages.map((pkg, index) => (
                <AnimatedSection key={index} delay={index * 150}>
                  <Card className={`p-8 h-full relative ${
                    pkg.highlight 
                      ? 'border-primary/30 bg-gradient-to-br from-primary/10 via-card/80 to-accent/10 scale-105' 
                      : 'border-primary/10 bg-gradient-to-br from-card/80 to-card/50'
                  } backdrop-blur-md`}>
                    {pkg.highlight && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-gold text-primary text-sm font-bold">
                        POPULÄRAST
                      </div>
                    )}
                    
                    <h3 className="text-2xl font-bold mb-2">{pkg.title}</h3>
                    <p className="text-3xl font-bold text-primary mb-4">{pkg.price}</p>
                    <p className="text-muted-foreground mb-6">{pkg.description}</p>
                    
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ArrowRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className="w-full bg-gradient-gold text-primary hover:shadow-glow"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Kom igång
                    </Button>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* How We Work CTA */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <AnimatedSection>
              <Card className="p-12 border-primary/20 bg-gradient-to-br from-primary/5 via-card/50 to-accent/5">
                <div className="text-center max-w-3xl mx-auto">
                  <h2 className="text-4xl font-bold mb-6">Hur vi arbetar</h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    Transparent process från behovsanalys till lansering och kontinuerlig support
                  </p>
                  <Link to="/hur-det-funkar">
                    <Button 
                      size="lg"
                      variant="outline"
                      className="border-primary/30 hover:bg-primary/10 font-semibold text-lg px-8"
                    >
                      Se vår arbetsprocess
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
      <ConsultationModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}