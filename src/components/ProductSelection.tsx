import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useCallback } from "react";
import { ConsultationModal } from "@/components/ConsultationModal";
import { AnimatedSection } from "@/components/AnimatedSection";
import { PackageCard } from "@/components/home/PackageCard";
import { IndustryCard } from "@/components/home/IndustryCard";
import { OptimizedIndustryGrid } from "@/components/home/OptimizedIndustryGrid";
import { CustomerJourneyFlow } from "@/components/home/CustomerJourneyFlow";
import { OnboardingTimeline } from "@/components/home/OnboardingTimeline";
import { TechnicalExpertise } from "@/components/home/TechnicalExpertise";
import { CaseStudyCard } from "@/components/home/CaseStudyCard";
import { smoothScrollToElement } from "@/lib/smoothScroll";
import { aiPackages } from "@/data/packages";
import { industries } from "@/data/industries";
import { caseStudies } from "@/data/caseStudies";
import heroBackground from "@/assets/hero-background.jpg";
import karloImage from "@/assets/karlo-mangione.png";
import antonImage from "@/assets/anton-sallnas.png";
import emilImage from "@/assets/emil-westerberg.png";
import { Sparkles, Zap, Target, CheckCircle, Award, Users, Wrench, ArrowRight } from "lucide-react";

export const ProductSelection = () => {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  
  const scrollToSection = useCallback((id: string) => {
    smoothScrollToElement(id, { offset: 80 });
  }, []);
  
  const handleIndustryClick = useCallback((industryId: string) => {
    setSelectedIndustry(industryId);
    setIsConsultationModalOpen(true);
  }, []);
  return <div className="relative overflow-hidden bg-gradient-hero min-h-screen">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Hero Section */}
      <section id="hero" className="relative py-40 lg:py-56 min-h-screen flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <img src={heroBackground} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/80 to-primary/95"></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-6 lg:px-12 relative z-10 w-full">
          <AnimatedSection className="max-w-7xl mx-auto text-center">
            <h1 className="text-6xl sm:text-7xl text-white mb-8 leading-tight font-extrabold lg:text-8xl">
              AI som driver din verksamhet –{" "}
              <span className="bg-gradient-gold bg-clip-text text-transparent">
                effektivt, skalbart och vinstdrivande
              </span>
            </h1>
            
            <p className="text-2xl sm:text-3xl text-white/95 mb-16 leading-relaxed max-w-4xl mx-auto font-light">
              Hiems levererar ett komplett AI-ekosystem som automatiserar kundflöden, 
              försäljning, bokningar, administration och dataanalys.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-gradient-gold text-primary hover:shadow-glow transition-all duration-300 font-bold text-xl px-12 py-8 h-auto" onClick={() => scrollToSection('paket')}>
                Se våra paket
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white bg-white/10 hover:bg-white hover:text-primary transition-all duration-300 font-bold text-xl px-12 py-8 h-auto" onClick={() => setIsConsultationModalOpen(true)}>
                Boka demo
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Våra AI-paket / Lösningar */}
      <section id="paket" className="relative py-48 bg-gradient-to-b from-background via-primary/5 to-background">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-20">
            <div className="inline-block">
              <h2 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
                Välj paket för ditt företag / din bransch
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50" />
            </div>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mt-6 font-light">
              Vi erbjuder sex skräddarsydda AI-paket som kan anpassas efter era specifika behov
            </p>
          </AnimatedSection>
          
        <div className="max-w-[1800px] mx-auto space-y-12 mb-12">
          {aiPackages.map((pkg, index) => <AnimatedSection key={pkg.id} delay={index * 200} direction={index % 2 === 0 ? 'left' : 'right'}>
              <PackageCard package={pkg} imagePosition={index % 2 === 0 ? 'left' : 'right'} onBookDemo={() => setIsConsultationModalOpen(true)} />
            </AnimatedSection>)}
        </div>
        </div>
      </section>

      {/* Branschspecifika lösningar */}
      <section id="branscher" className="relative py-24 overflow-hidden" style={{ contain: 'content' }}>
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,hsl(var(--primary)/0.12),transparent_50%)]" style={{ transform: 'translateZ(0)', willChange: 'auto' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,hsl(var(--primary)/0.08),transparent_50%)]" style={{ transform: 'translateZ(0)', willChange: 'auto' }} />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-block">
              <h2 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text mb-4 text-white">
                Oavsett bransch kan Hiems bygga AI-lösningar som passar just er verksamhet
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50" />
            </div>
            <p className="text-xl sm:text-2xl max-w-3xl mx-auto mt-6 font-light text-slate-200">
              Vi har erfarenhet från många olika branscher och kan anpassa våra lösningar efter era unika behov
            </p>
          </AnimatedSection>
          
          <OptimizedIndustryGrid className="industry-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {industries.map((industry) => (
              <div key={industry.id} className="industry-card-wrapper">
                <IndustryCard industry={industry} onClick={() => handleIndustryClick(industry.id)} />
              </div>
            ))}
          </OptimizedIndustryGrid>
          
          <AnimatedSection className="text-center">
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
          
          <CustomerJourneyFlow />
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

      {/* Om oss Section */}
      <section id="about" className="relative py-32">
        
      </section>

      {/* Varför Hiems Section */}
      <section className="relative py-24 bg-white/5 animate-fade-in">
        
      </section>

      <ConsultationModal open={isConsultationModalOpen} onOpenChange={setIsConsultationModalOpen} />
    </div>;
};