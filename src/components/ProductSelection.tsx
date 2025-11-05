import { AnimatedHero } from "@/components/ui/animated-hero";
import { PackageCard } from "./home/PackageCard";
import { IndustryCard } from "./home/IndustryCard";
import { IndustryModal } from "./IndustryModal";
import { ConsultationModal } from "./ConsultationModal";
import { AuroraBackground } from "./ui/aurora-background";
import { ServicesGrid } from "./home/ServicesGrid";
import { BentoGrid } from "./home/BentoGrid";
import { AboutTeam } from "./home/AboutTeam";
import { TestimonialsGrid } from "./home/TestimonialsGrid";
import { TechnicalExpertise } from "./home/TechnicalExpertise";
import { OnboardingTimeline } from "./home/OnboardingTimeline";
import { aiPackages } from "@/data/packages";
import { industries } from "@/data/industries";
import { AnimatedSection } from "./ui/animated-section";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ProductSelection = () => {
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState("");

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleIndustryClick = (industryId: string) => {
    setSelectedIndustry(industryId);
    setIsConsultationModalOpen(true);
  };

  const handleBookDemo = () => {
    setIsConsultationModalOpen(true);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-hero min-h-screen">
      {/* Hero Section with Aurora Background */}
      <AuroraBackground className="h-auto min-h-[200vh]">
        <section id="hero" className="relative min-h-screen flex items-center">
          <AnimatedHero
            onBookDemo={handleBookDemo}
            onViewPackages={() => scrollToSection("ai-paket")}
          />
        </section>

        {/* AI Packages Section */}
        <AnimatedSection id="ai-paket" className="py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="container mx-auto max-w-7xl px-6 space-y-16"
          >
            <div className="text-center space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm"
              >
                AI-paket
              </motion.div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Välj rätt <span className="bg-gradient-gold bg-clip-text text-transparent">AI-paket</span> för er
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Skräddarsydda lösningar som växer med ditt företag
              </p>
            </div>

            <div className="space-y-12">
              {aiPackages.map((pkg, index) => (
                <PackageCard
                  key={pkg.id}
                  package={pkg}
                  onBookDemo={handleBookDemo}
                  imagePosition={index % 2 === 0 ? "left" : "right"}
                />
              ))}
            </div>
          </motion.div>
        </AnimatedSection>
      </AuroraBackground>

      {/* Services Grid */}
      <ServicesGrid />

      {/* Industry Solutions */}
      <AnimatedSection id="branschlosningar" className="py-24 bg-gradient-to-b from-background via-background to-muted/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto max-w-7xl px-6 space-y-12 border border-muted rounded-3xl py-12"
        >
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm"
            >
              Branscher
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Branschspecifika <span className="bg-gradient-gold bg-clip-text text-transparent">lösningar</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Vi förstår din bransch och anpassar AI-lösningarna efter dina unika behov
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry) => (
              <IndustryCard
                key={industry.id}
                industry={industry}
                onClick={() => handleIndustryClick(industry.id)}
              />
            ))}
          </div>
        </motion.div>
      </AnimatedSection>

      {/* Bento Grid */}
      <BentoGrid />

      {/* About & Team */}
      <AboutTeam />

      {/* Technical Expertise */}
      <TechnicalExpertise onBookDemo={handleBookDemo} />

      {/* Onboarding Timeline */}
      <OnboardingTimeline />

      {/* Testimonials */}
      <TestimonialsGrid />

      {/* Newsletter */}
      <AnimatedSection id="blogg" className="py-24 bg-gradient-to-b from-muted/5 to-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto max-w-7xl px-6"
        >
          <div className="text-center space-y-4 mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm"
            >
              Nyhetsbrev
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Håll dig <span className="bg-gradient-gold bg-clip-text text-transparent">uppdaterad</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Få de senaste insikterna om AI-automation direkt i din inkorg
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-card/50 backdrop-blur-md border border-primary/10 rounded-3xl p-8 shadow-xl">
            <form className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Din e-postadress"
                  className="flex-1 bg-background/80 border-primary/20 focus:border-primary rounded-3xl"
                />
                <Button className="bg-gradient-gold hover:shadow-glow transition-all duration-300 rounded-3xl">
                  Prenumerera
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </AnimatedSection>

      {/* Contact Form */}
      <AnimatedSection id="kontakt" className="py-24 bg-gradient-to-b from-background to-muted/20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto max-w-4xl px-6 border border-muted rounded-3xl py-12"
        >
          <div className="text-center space-y-4 mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm"
            >
              Kontakt
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Låt oss <span className="bg-gradient-gold bg-clip-text text-transparent">hjälpa dig</span>
            </h2>
          </div>

          <div className="bg-card/50 backdrop-blur-md border border-primary/10 rounded-3xl p-8 shadow-xl">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Förnamn" className="bg-background/80 border-primary/20 rounded-3xl" />
                <Input placeholder="Efternamn" className="bg-background/80 border-primary/20 rounded-3xl" />
              </div>
              <Input type="email" placeholder="E-post" className="bg-background/80 border-primary/20 rounded-3xl" />
              <Input type="tel" placeholder="Telefon" className="bg-background/80 border-primary/20 rounded-3xl" />
              <Select>
                <SelectTrigger className="bg-background/80 border-primary/20 rounded-3xl">
                  <SelectValue placeholder="Välj bransch" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry.id} value={industry.id}>
                      {industry.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea placeholder="Berätta mer..." className="bg-background/80 border-primary/20 min-h-[120px] rounded-3xl" />
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" className="w-full bg-gradient-gold hover:shadow-glow transition-all duration-300 font-semibold text-lg rounded-3xl">
                  Skicka förfrågan
                </Button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </AnimatedSection>

      <ConsultationModal open={isConsultationModalOpen} onOpenChange={setIsConsultationModalOpen} />
      <IndustryModal industryId={selectedIndustry} open={!!selectedIndustry && isConsultationModalOpen} onOpenChange={(open) => !open && setSelectedIndustry("")} />
    </div>
  );
};
