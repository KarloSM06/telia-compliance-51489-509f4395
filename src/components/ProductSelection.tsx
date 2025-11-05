import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ConsultationModal } from "@/components/ConsultationModal";
import { AnimatedSection } from "@/components/AnimatedSection";
import { StickyPackageCards } from "@/components/home/StickyPackageCards";
import { IndustryGallery } from "@/components/home/IndustryGallery";
import { CustomerJourneyFlow } from "@/components/home/CustomerJourneyFlow";
import { OnboardingTimeline } from "@/components/home/OnboardingTimeline";
import { TechnicalExpertise } from "@/components/home/TechnicalExpertise";
import { CaseStudyCard } from "@/components/home/CaseStudyCard";
import { aiPackages } from "@/data/packages";
import { industries } from "@/data/industries";
import { caseStudies } from "@/data/caseStudies";
import heroBackground from "@/assets/hero-background.jpg";
import karloImage from "@/assets/karlo-mangione.png";
import antonImage from "@/assets/anton-sallnas.png";
import emilImage from "@/assets/emil-westerberg.png";
import { Sparkles, Zap, Target, CheckCircle, Award, Users, Wrench, ArrowRight } from "lucide-react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { AnimatedHero } from "@/components/ui/animated-hero";
import IntegrationHero from "@/components/ui/integration-hero";
import { ClientLogoCloud } from "@/components/ClientLogoCloud";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { UnifiedDashboard } from "@/components/home/UnifiedDashboard";

export const ProductSelection = () => {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  const handleIndustryClick = (industryId: string) => {
    setSelectedIndustry(industryId);
    setIsConsultationModalOpen(true);
  };
  return <div className="relative bg-gradient-hero min-h-screen">
      
      {/* Hero Section and Packages with Aurora Background */}
      <AuroraBackground className="h-auto">
        <section id="hero" className="relative py-20 lg:py-32 flex items-center">
          <AnimatedHero 
            onBookDemo={() => setIsConsultationModalOpen(true)}
            onViewPackages={() => scrollToSection('paket')}
          />
        </section>

        {/* Programmen vi jobbar med */}
        <IntegrationHero />

        {/* Företag vi samarbetar med */}
        <ClientLogoCloud />

        {/* Våra Tjänster & Teknologier */}
        <ServicesGrid />

        {/* All Data på Ett Ställe */}
        <UnifiedDashboard />

        {/* Våra AI-paket / Lösningar */}
        <StickyPackageCards 
          packages={aiPackages}
          onBookDemo={() => setIsConsultationModalOpen(true)}
          onViewDetails={() => scrollToSection('kontakt')}
        />
      </AuroraBackground>

      {/* Branschspecifika lösningar */}
      <section id="branscher" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,hsl(var(--primary)/0.12),transparent_50%)]" />
        
        <div className="relative z-10">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-8 flex flex-col md:flex-row md:items-end md:justify-between md:mb-14 lg:mb-16">
            <AnimatedSection className="flex flex-col gap-4 mb-8 md:mb-0">
              <h2 className="text-3xl font-medium md:text-4xl lg:text-5xl text-foreground">
                Oavsett bransch kan Hiems bygga AI-lösningar som passar just er verksamhet
              </h2>
              <p className="max-w-lg text-muted-foreground">
                Vi har erfarenhet från många olika branscher och kan anpassa våra lösningar efter era unika behov
              </p>
            </AnimatedSection>
          </div>
          
          <AnimatedSection delay={100}>
            <IndustryGallery 
              industries={industries}
              onIndustryClick={handleIndustryClick}
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Kundflöde & värde */}
      <section id="kundflode" className="relative py-24 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-block">
              <h2 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
                Kundflöde & värde
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50 mb-6" />
            </div>
            <p className="text-xl sm:text-2xl max-w-3xl mx-auto font-bold text-slate-800">
              Se hur dina kunder möter Hiems AI – från första kontakten till långsiktig tillväxt
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={200}>
            <CustomerJourneyFlow />
          </AnimatedSection>
        </div>
      </section>

      {/* Teknisk Expertis */}
      <TechnicalExpertise onBookDemo={() => setIsConsultationModalOpen(true)} />

      {/* Onboarding-process */}
      <section id="onboarding" className="relative py-24 pb-48 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,hsl(var(--primary)/0.12),transparent_50%)]" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-20">
            <div className="inline-block">
              <h2 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
                Så implementerar vi AI hos dig
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50" />
            </div>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mt-6 font-light">
              En tydlig process från dag 1 till driftstart – så att ni vet exakt vad som händer
            </p>
          </AnimatedSection>
          
          <OnboardingTimeline />
          
          <AnimatedSection className="text-center mt-16">
            <Button size="lg" className="bg-gradient-gold text-primary hover:shadow-glow transition-all duration-300 font-semibold" onClick={() => setIsConsultationModalOpen(true)}>
              Boka onboarding-möte
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* Case / Kundreferenser - DOLD (Ta bort kommentarerna för att visa igen) */}
      {/* <section id="case" className="relative py-24 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,hsl(var(--primary)/0.15),transparent_50%)]" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-block">
              <h2 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
                Verkliga resultat från våra kunder
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50" />
            </div>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mt-6 font-light">
              Se hur andra företag har transformerat sin verksamhet med Hiems AI-lösningar
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {caseStudies.map((caseStudy, index) => <AnimatedSection key={caseStudy.id} delay={index * 150}>
                <CaseStudyCard caseStudy={caseStudy} onBookDemo={() => setIsConsultationModalOpen(true)} />
              </AnimatedSection>)}
          </div>
        </div>
       </section> */}

      {/* Blogg / Insikter */}
      <section id="blogg" className="relative py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <h3 className="text-3xl font-bold mb-4 text-white">
              Läs våra insikter om AI, automation och ROI
            </h3>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Håll dig uppdaterad med de senaste trenderna och lär dig hur AI kan transformera din verksamhet
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <Input type="email" placeholder="Din e-postadress" className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60" />
                <Button className="bg-gradient-gold text-primary hover:shadow-glow transition-all duration-300">
                  Prenumerera
                </Button>
              </div>
              <p className="text-xs text-white/70 mt-2">
                Få våra nyhetsbrev helt gratis – ingen spam, bara värdefulla insikter
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Kontakt / CTA */}
      <section id="kontakt" className="relative py-24 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,hsl(var(--primary)/0.08),transparent_50%)]" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-20">
            <div className="inline-block">
              <h2 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
                Boka din gratis behovsanalys
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50" />
            </div>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mt-6 font-light">
              Vi visar hur AI och automation kan effektivisera just er verksamhet – utan förpliktelser
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Vänster: Kontaktformulär */}
            <AnimatedSection delay={100}>
              <Card className="group h-full p-8 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:bg-card/90 hover:border-primary/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500">
                <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Kontakta oss
                </h3>
                <form className="space-y-5">
                  <div>
                    <Label className="text-foreground/90 font-medium">Namn *</Label>
                    <Input type="text" required placeholder="Ditt namn" className="mt-1.5 bg-background/50 border-border/50 hover:border-primary/30 focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <Label className="text-foreground/90 font-medium">Företag *</Label>
                    <Input type="text" required placeholder="Ditt företag" className="mt-1.5 bg-background/50 border-border/50 hover:border-primary/30 focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <Label className="text-foreground/90 font-medium">Telefon *</Label>
                    <Input type="tel" required placeholder="070-123 45 67" className="mt-1.5 bg-background/50 border-border/50 hover:border-primary/30 focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <Label className="text-foreground/90 font-medium">E-post *</Label>
                    <Input type="email" required placeholder="din@email.se" className="mt-1.5 bg-background/50 border-border/50 hover:border-primary/30 focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <Label className="text-foreground/90 font-medium">Bransch</Label>
                    <Select>
                      <SelectTrigger className="mt-1.5 bg-background/50 border-border/50 hover:border-primary/30 transition-colors">
                        <SelectValue placeholder="Välj bransch" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map(ind => <SelectItem key={ind.id} value={ind.id}>
                            {ind.name}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold text-lg shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-105" onClick={e => {
                  e.preventDefault();
                  setIsConsultationModalOpen(true);
                }}>
                    Boka behovsanalys
                  </Button>
                </form>
                
                {/* Kontaktuppgifter */}
                <div className="mt-8 pt-8 border-t border-border/50">
                  <h4 className="font-semibold mb-4 text-foreground">Kontaktuppgifter</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>📞 070-657 15 32</p>
                    <p>📧 contact@hiems.se</p>
                  </div>
                </div>
              </Card>
            </AnimatedSection>
            
            {/* Höger: Placeholder för bokningskalender */}
            <AnimatedSection delay={200}>
              <Card className="group h-full p-8 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:bg-card/90 hover:border-primary/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500">
                <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Boka direkt
                </h3>
                <div className="aspect-video bg-background/30 border border-border/30 rounded-lg flex items-center justify-center group-hover:border-primary/20 transition-colors duration-500">
                  <p className="text-muted-foreground text-center px-4">
                    Calendly-integration kommer här
                  </p>
                </div>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>


      <ConsultationModal open={isConsultationModalOpen} onOpenChange={setIsConsultationModalOpen} />
    </div>;
};