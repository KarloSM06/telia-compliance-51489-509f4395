import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ConsultationModal } from "@/components/ConsultationModal";
import { AnimatedSection } from "@/components/AnimatedSection";
import { StickyPackageCards } from "@/components/home/StickyPackageCards";
import { IndustryCard } from "@/components/home/IndustryCard";
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
      <section id="branscher" className="relative py-16 md:py-32">
        <div className="@container mx-auto max-w-7xl px-6">
          <AnimatedSection className="text-center">
            <h2 className="text-balance text-4xl font-semibold lg:text-5xl mb-4">
              Oavsett bransch kan Hiems bygga AI-lösningar som passar just er verksamhet
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Vi har erfarenhet från många olika branscher och kan anpassa våra lösningar efter era unika behov
            </p>
          </AnimatedSection>
          
          <div className="@min-4xl:max-w-full @min-4xl:grid-cols-4 mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => {
              const Icon = industry.icon;
              return (
                <AnimatedSection key={industry.id}>
                  <Card 
                    className="group border-0 bg-muted shadow-none cursor-pointer hover:bg-muted/80 transition-all duration-300 transform-gpu"
                    onClick={() => handleIndustryClick(industry.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="relative mx-auto size-36 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
                        <div className="absolute inset-0 [--border:black] dark:[--border:white] bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-10"/>
                        <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l">
                          <Icon className="size-6" aria-hidden />
                        </div>
                      </div>
                      <h3 className="mt-6 font-medium">{industry.name}</h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{industry.description}</p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              );
            })}
          </div>
          
          <AnimatedSection className="text-center mt-12" delay={200}>
            <Button size="lg" className="bg-gradient-gold text-primary hover:shadow-glow transition-all duration-300 font-semibold" onClick={() => setIsConsultationModalOpen(true)}>
              Boka branschspecifik konsultation
            </Button>
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

      {/* Blogg / Insikter - Redesigned with Minimal Gradient Background */}
      <section id="blogg" className="relative py-32 overflow-hidden">
        {/* Animated CSS-only Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--accent)/0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,hsl(var(--primary)/0.06),transparent_50%)]" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center">
            <div className="inline-block mb-8">
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
                Håll dig uppdaterad
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-accent via-accent/60 to-transparent mx-auto rounded-full shadow-lg shadow-accent/30" />
            </div>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Få de senaste insikterna om AI, automation och ROI direkt till din inkorg
            </p>
            
            <div className="max-w-lg mx-auto">
              <Card className="p-8 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:border-primary/20 transition-all duration-500 shadow-xl">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input 
                    type="email" 
                    placeholder="din@email.se" 
                    className="flex-1 bg-background/50 border-border/50 hover:border-primary/30 focus:border-primary transition-colors"
                  />
                  <Button className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-semibold shadow-lg hover:shadow-accent/50 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                    Prenumerera
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-left">
                  📬 Inga spam-mails. Bara värdefulla insikter, tips och uppdateringar.
                </p>
              </Card>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Kontakt / CTA - Redesigned Split Screen */}
      <section id="kontakt" className="relative py-32 overflow-hidden">
        {/* Animated CSS background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,hsl(var(--accent)/0.08),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,hsl(var(--primary)/0.06),transparent_40%)]" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-20">
            <div className="inline-block mb-6">
              <h2 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent/60 bg-clip-text text-transparent mb-4">
                Ta steget mot AI-automation
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-accent via-accent/60 to-transparent mx-auto rounded-full shadow-lg shadow-accent/30" />
            </div>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              Boka en gratis behovsanalys och upptäck hur vi kan effektivisera er verksamhet
            </p>
          </AnimatedSection>
          
          {/* Split Screen Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* Vänster: Kontaktformulär - Enhanced */}
            <AnimatedSection delay={100} direction="left">
              <Card className="group h-full p-8 border border-primary/10 bg-gradient-to-br from-card via-card/90 to-card/80 backdrop-blur-md hover:border-accent/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-500 transform-gpu">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary via-primary/80 to-accent/60 bg-clip-text text-transparent">
                      Kontakta oss
                    </h3>
                    <p className="text-muted-foreground">
                      Fyll i formuläret så återkommer vi inom 24 timmar
                    </p>
                  </div>
                  
                  <form className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-foreground/90 font-medium">Namn *</Label>
                      <Input 
                        type="text" 
                        required 
                        placeholder="Ditt för- och efternamn" 
                        className="bg-background/70 border-border/50 hover:border-primary/30 focus:border-accent transition-all duration-300"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-foreground/90 font-medium">Företag *</Label>
                      <Input 
                        type="text" 
                        required 
                        placeholder="Företagsnamn" 
                        className="bg-background/70 border-border/50 hover:border-primary/30 focus:border-accent transition-all duration-300"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-foreground/90 font-medium">Telefon *</Label>
                        <Input 
                          type="tel" 
                          required 
                          placeholder="070-123 45 67" 
                          className="bg-background/70 border-border/50 hover:border-primary/30 focus:border-accent transition-all duration-300"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-foreground/90 font-medium">E-post *</Label>
                        <Input 
                          type="email" 
                          required 
                          placeholder="din@email.se" 
                          className="bg-background/70 border-border/50 hover:border-primary/30 focus:border-accent transition-all duration-300"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-foreground/90 font-medium">Bransch</Label>
                      <Select>
                        <SelectTrigger className="bg-background/70 border-border/50 hover:border-primary/30 transition-all duration-300">
                          <SelectValue placeholder="Välj din bransch" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map(ind => (
                            <SelectItem key={ind.id} value={ind.id}>
                              {ind.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-semibold text-lg py-6 shadow-lg hover:shadow-accent/50 transition-all duration-300 hover:scale-105 transform-gpu"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsConsultationModalOpen(true);
                      }}
                    >
                      Boka behovsanalys
                    </Button>
                  </form>
                  
                  {/* Kontaktuppgifter */}
                  <div className="pt-6 border-t border-border/30">
                    <h4 className="font-semibold mb-3 text-foreground text-sm uppercase tracking-wide">Direktkontakt</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <span className="text-lg">📞</span>
                        <a href="tel:0706571532" className="hover:text-accent transition-colors">070-657 15 32</a>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-lg">📧</span>
                        <a href="mailto:contact@hiems.se" className="hover:text-accent transition-colors">contact@hiems.se</a>
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </AnimatedSection>
            
            {/* Höger: Bokningskalender - Enhanced */}
            <AnimatedSection delay={200} direction="right">
              <Card className="group h-full p-8 border border-primary/10 bg-gradient-to-br from-card via-card/90 to-card/80 backdrop-blur-md hover:border-accent/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-500 transform-gpu">
                <div className="space-y-6 h-full flex flex-col">
                  <div>
                    <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary via-primary/80 to-accent/60 bg-clip-text text-transparent">
                      Boka direkt
                    </h3>
                    <p className="text-muted-foreground">
                      Välj en tid som passar dig i vår bokningskalender
                    </p>
                  </div>
                  
                  {/* Calendly Placeholder */}
                  <div className="flex-1 bg-gradient-to-br from-background/50 to-background/30 border border-border/30 rounded-lg flex flex-col items-center justify-center group-hover:border-accent/20 transition-all duration-500 min-h-[400px]">
                    <div className="text-center px-6 space-y-4">
                      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <span className="text-4xl">📅</span>
                      </div>
                      <p className="text-muted-foreground text-lg">
                        Calendly-integration
                      </p>
                      <p className="text-sm text-muted-foreground/70 max-w-xs">
                        Här kommer vår bokningskalender att visas så att du enkelt kan välja tid
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>


      <ConsultationModal open={isConsultationModalOpen} onOpenChange={setIsConsultationModalOpen} />
    </div>;
};