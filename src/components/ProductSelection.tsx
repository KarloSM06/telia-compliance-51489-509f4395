import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ConsultationModal } from "@/components/ConsultationModal";
import { AnimatedSection } from "@/components/AnimatedSection";
import { PackageCard } from "@/components/home/PackageCard";
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

  return (
    <div className="relative overflow-hidden bg-gradient-hero min-h-screen">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      {/* Hero Section */}
      <section id="hero" className="relative py-32 lg:py-48">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={heroBackground} 
            alt="Hero" 
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/80 to-primary/95"></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <AnimatedSection className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              AI som driver din verksamhet –{" "}
              <span className="bg-gradient-gold bg-clip-text text-transparent">
                effektivt, skalbart och vinstdrivande
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
              Hiems levererar ett komplett AI-ekosystem som automatiserar kundflöden, 
              försäljning, bokningar, administration och dataanalys.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-gold text-primary hover:shadow-glow transition-all duration-300 font-semibold text-lg px-10 py-7"
                onClick={() => scrollToSection('paket')}
              >
                Se våra paket
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white text-white bg-white/10 hover:bg-white hover:text-primary transition-all duration-300 font-semibold text-lg px-10 py-7"
                onClick={() => setIsConsultationModalOpen(true)}
              >
                Boka demo
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Våra AI-paket / Lösningar */}
      <section id="paket" className="relative py-24 bg-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
              Välj paket för ditt företag / din bransch
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Vi erbjuder sex skräddarsydda AI-paket som kan anpassas efter era specifika behov
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {aiPackages.map((pkg, index) => (
              <AnimatedSection key={pkg.id} delay={index * 100}>
                <PackageCard 
                  package={pkg} 
                  onBookDemo={() => setIsConsultationModalOpen(true)}
                />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Branschspecifika lösningar */}
      <section id="branscher" className="relative py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
              Oavsett bransch kan Hiems bygga AI-lösningar som passar just er verksamhet
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Vi har erfarenhet från många olika branscher och kan anpassa våra lösningar efter era unika behov
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {industries.map((industry, index) => (
              <AnimatedSection key={industry.id} delay={index * 80}>
                <IndustryCard 
                  industry={industry} 
                  onClick={() => handleIndustryClick(industry.id)}
                />
              </AnimatedSection>
            ))}
          </div>
          
          <AnimatedSection className="text-center">
            <Button 
              size="lg"
              className="bg-gradient-gold text-primary hover:shadow-glow transition-all duration-300 font-semibold"
              onClick={() => setIsConsultationModalOpen(true)}
            >
              Boka branschspecifik konsultation
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* Kundflöde & värde */}
      <section id="kundflode" className="relative py-24 bg-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
              Kundflöde & värde
            </h2>
            <div className="w-24 h-1.5 bg-gradient-gold mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Se hur dina kunder möter Hiems AI – från första kontakten till långsiktig tillväxt
            </p>
          </AnimatedSection>
          
          <CustomerJourneyFlow />
        </div>
      </section>

      {/* Teknisk Expertis */}
      <TechnicalExpertise onBookDemo={() => setIsConsultationModalOpen(true)} />

      {/* Onboarding-process */}
      <section id="onboarding" className="relative py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
              Så implementerar vi AI hos dig
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              En tydlig process från dag 1 till driftstart – så att ni vet exakt vad som händer
            </p>
          </AnimatedSection>
          
          <OnboardingTimeline />
          
          <AnimatedSection className="text-center mt-12">
            <Button 
              size="lg"
              className="bg-gradient-gold text-primary hover:shadow-glow transition-all duration-300 font-semibold"
              onClick={() => setIsConsultationModalOpen(true)}
            >
              Boka onboarding-möte
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* Case / Kundreferenser */}
      <section id="case" className="relative py-24 bg-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
              Verkliga resultat från våra kunder
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Se hur andra företag har transformerat sin verksamhet med Hiems AI-lösningar
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {caseStudies.map((caseStudy, index) => (
              <AnimatedSection key={caseStudy.id} delay={index * 150}>
                <CaseStudyCard 
                  caseStudy={caseStudy}
                  onBookDemo={() => setIsConsultationModalOpen(true)}
                />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

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
                <Input 
                  type="email" 
                  placeholder="Din e-postadress"
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
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
      <section id="kontakt" className="relative py-24 bg-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
              Boka din gratis behovsanalys
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Vi visar hur AI och automation kan effektivisera just er verksamhet – utan förpliktelser
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Vänster: Kontaktformulär */}
            <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10">
              <h3 className="text-2xl font-bold mb-6 text-white">Kontakta oss</h3>
              <form className="space-y-4">
                <div>
                  <Label className="text-white">Namn *</Label>
                  <Input type="text" required placeholder="Ditt namn" className="bg-white/10 border-white/20 text-white placeholder:text-white/60" />
                </div>
                <div>
                  <Label className="text-white">Företag *</Label>
                  <Input type="text" required placeholder="Ditt företag" className="bg-white/10 border-white/20 text-white placeholder:text-white/60" />
                </div>
                <div>
                  <Label className="text-white">Telefon *</Label>
                  <Input type="tel" required placeholder="070-123 45 67" className="bg-white/10 border-white/20 text-white placeholder:text-white/60" />
                </div>
                <div>
                  <Label className="text-white">E-post *</Label>
                  <Input type="email" required placeholder="din@email.se" className="bg-white/10 border-white/20 text-white placeholder:text-white/60" />
                </div>
                <div>
                  <Label className="text-white">Bransch</Label>
                  <Select>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Välj bransch" />
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
                  className="w-full bg-gradient-gold text-primary hover:shadow-glow transition-all duration-300 font-semibold"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsConsultationModalOpen(true);
                  }}
                >
                  Boka behovsanalys
                </Button>
              </form>
              
              {/* Kontaktuppgifter */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <h4 className="font-semibold mb-4 text-white">Kontaktuppgifter</h4>
                <div className="space-y-2 text-sm text-white/70">
                  <p>📞 070-657 15 32</p>
                  <p>📧 contact@hiems.se</p>
                </div>
              </div>
            </Card>
            
            {/* Höger: Placeholder för bokningskalender */}
            <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10">
              <h3 className="text-2xl font-bold mb-6 text-white">Boka direkt</h3>
              <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center">
                <p className="text-white/70 text-center px-4">
                  Calendly-integration kommer här
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Om oss Section */}
      <section id="about" className="relative py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="mx-auto max-w-3xl text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 mb-6 backdrop-blur-sm border border-accent/20">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-white">Om oss – Hiems</span>
            </div>
            <h2 className="text-5xl font-display font-bold mb-6 text-white">Vi är unga, drivna och brinner för AI</h2>
            <div className="w-24 h-1.5 bg-gradient-gold mx-auto rounded-full mb-8"></div>
            <p className="text-lg text-white/90 leading-relaxed">
              Hiems grundades av ett team som ser möjligheterna med AI och vill göra tekniken tillgänglig för alla företag, inte bara stora aktörer. Vi kombinerar ung drivkraft, nyfikenhet och teknisk expertis med förståelse för olika verksamheter. Vårt mål är enkelt: skapa lösningar som sparar tid, minskar dubbelarbete och gör vardagen enklare.
            </p>
          </AnimatedSection>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            <AnimatedSection delay={0} className="group text-center">
              <div className="relative rounded-lg bg-white/5 p-8 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-300 h-full">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 rounded-lg transition-opacity"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Zap className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-3 text-white">Tillgänglig AI för alla</h3>
                  <p className="text-white/70 leading-relaxed">Vi tror på tillgänglig AI som alla kan använda, oavsett företagsstorlek eller teknisk expertis.</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={100} className="group text-center">
              <div className="relative rounded-lg bg-white/5 p-8 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-300 h-full">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 rounded-lg transition-opacity"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Wrench className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-3 text-white">Hands-on & kreativa</h3>
                  <p className="text-white/70 leading-relaxed">Vi är hands-on och kreativa, och bygger lösningar som faktiskt fungerar i verkligheten.</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200} className="group text-center">
              <div className="relative rounded-lg bg-white/5 p-8 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-300 h-full">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 rounded-lg transition-opacity"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Users className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-3 text-white">Personliga relationer</h3>
                  <p className="text-white/70 leading-relaxed">Vi värdesätter personliga relationer med våra kunder och ser er framgång som vår framgång.</p>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Team Section */}
          <AnimatedSection className="mb-12">
            <h3 className="text-3xl font-display font-bold text-center mb-12 text-white">Möt teamet</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatedSection delay={0} className="rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 p-8 text-center hover:border-accent/50 transition-all duration-300">
                <img 
                  src={antonImage} 
                  alt="Anton Sallnäs" 
                  className="w-64 h-64 rounded-full mx-auto mb-6 object-cover border-2 border-accent/30"
                  loading="lazy"
                />
                <h4 className="text-xl font-bold mb-2 text-white">Anton Sallnäs</h4>
                <p className="text-lg text-white/70 mb-4">CEO</p>
                <p className="text-sm text-white/60 mb-1">anton@hiems.se</p>
                <p className="text-sm text-white/60">070-657 15 32</p>
                <p className="text-xs text-white/50 italic mt-4">"Jag brinner för att göra AI begripligt"</p>
              </AnimatedSection>
              
              <AnimatedSection delay={100} className="rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 p-8 text-center hover:border-accent/50 transition-all duration-300">
                <img 
                  src={karloImage} 
                  alt="Karlo Mangione" 
                  className="w-64 h-64 rounded-full mx-auto mb-6 object-cover border-2 border-accent/30"
                  loading="lazy"
                />
                <h4 className="text-xl font-bold mb-2 text-white">Karlo Mangione</h4>
                <p className="text-lg text-white/70 mb-4">COO</p>
                <p className="text-sm text-white/60 mb-1">karlo.mangione@hiems.se</p>
                <p className="text-sm text-white/60">070-231 22 71</p>
                <p className="text-xs text-white/50 italic mt-4">"AI ska vara enkelt att använda"</p>
              </AnimatedSection>
              
              <AnimatedSection delay={200} className="rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 p-8 text-center hover:border-accent/50 transition-all duration-300">
                <img 
                  src={emilImage} 
                  alt="Emil Westerberg" 
                  className="w-64 h-64 rounded-full mx-auto mb-6 object-cover border-2 border-accent/30"
                  loading="lazy"
                />
                <h4 className="text-xl font-bold mb-2 text-white">Emil Westerberg</h4>
                <p className="text-lg text-white/70 mb-4">CLO</p>
                <p className="text-sm text-white/60 mb-1">emil@hiems.se</p>
                <p className="text-sm text-white/60">072-327 34 65</p>
                <p className="text-xs text-white/50 italic mt-4">"Teknologi som skapar verkligt värde"</p>
              </AnimatedSection>
              
              <AnimatedSection delay={300} className="rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 p-8 text-center hover:border-accent/50 transition-all duration-300">
                <div className="w-64 h-64 rounded-full mx-auto mb-6 bg-gradient-primary flex items-center justify-center border-2 border-accent/30">
                  <span className="text-6xl font-bold text-white">ME</span>
                </div>
                <h4 className="text-xl font-bold mb-2 text-white">Malte Ekbäck</h4>
                <p className="text-lg text-white/70 mb-4">CFO</p>
                <p className="text-sm text-white/60 mb-1">malte@hiems.se</p>
                <p className="text-sm text-white/60">073-024 66 28</p>
                <p className="text-xs text-white/50 italic mt-4">"Smart tillväxt med AI"</p>
              </AnimatedSection>
            </div>
          </AnimatedSection>

          {/* CTA */}
          <AnimatedSection delay={400} className="text-center mt-16">
            <Button 
              onClick={() => setIsConsultationModalOpen(true)} 
              size="lg" 
              className="bg-gradient-gold text-accent-foreground hover:opacity-90 shadow-button font-semibold text-lg px-8 py-6 h-auto"
            >
              Boka behovsanalys
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* Varför Hiems Section */}
      <section className="relative py-24 bg-white/5 animate-fade-in">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <AnimatedSection className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-white mb-4">Varför Hiems?</h2>
            <div className="w-20 h-1 bg-gradient-gold mx-auto rounded-full"></div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <AnimatedSection delay={0} className="group text-center">
              <div className="relative rounded-2xl bg-white/5 p-10 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-300 h-full">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Target className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-3">Skräddarsydd AI</h3>
                  <p className="text-white/70 leading-relaxed">Vi skapar AI-lösningar helt anpassade efter er verksamhet och era mål – inget standardpaket, allt designat för maximal effekt.</p>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={100} className="group text-center">
              <div className="relative rounded-2xl bg-white/5 p-10 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-300 h-full">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <CheckCircle className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-3">Ni ser bara resultaten</h3>
                  <p className="text-white/70 leading-relaxed">Vi tar hand om allt – från utveckling till implementation. Ni behöver inte lyfta ett finger, utan får direkt värde och mätbara resultat.</p>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={200} className="group text-center">
              <div className="relative rounded-2xl bg-white/5 p-10 backdrop-blur-sm border border-white/10 hover:border-accent/50 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Award className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-3">Svensk support dygnet runt</h3>
                  <p className="text-white/70 leading-relaxed">Vi finns alltid tillgängliga för er, med svensk kundservice och teknisk support som förstår er verksamhet.</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <ConsultationModal 
        open={isConsultationModalOpen} 
        onOpenChange={setIsConsultationModalOpen}
      />
    </div>
  );
};
