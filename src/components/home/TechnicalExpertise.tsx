import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/AnimatedSection";
import { expertiseCategories, techFlowSteps } from "@/data/expertise";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface TechnicalExpertiseProps {
  onBookDemo: () => void;
}

export const TechnicalExpertise = ({ onBookDemo }: TechnicalExpertiseProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [activeFlowStep, setActiveFlowStep] = useState<number | null>(null);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <section id="teknisk-expertis" className="relative py-24 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/images/n8n-workflow-background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/95 via-primary/90 to-primary/95"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
            Fullständig teknisk expertis
          </h2>
          <div className="w-24 h-1.5 bg-gradient-gold mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            Vi bygger skräddarsydda AI-system som fungerar direkt i din verksamhet. 
            Hiems är specialister på systemutveckling med AI. Vi kombinerar automatisering, 
            avancerade AI-modeller och fullständig integration av dina verktyg i ett komplett, 
            skalbart ekosystem. Alla system sätts upp på din hårdvara med full kontroll och transparens.
          </p>
        </AnimatedSection>

        {/* 4 Kompetenskategorier */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {expertiseCategories.map((category, index) => {
            const Icon = category.icon;
            const isExpanded = expandedCategories.includes(category.id);

            return (
              <AnimatedSection key={category.id} delay={index * 100}>
                <Card 
                  className="group bg-white/5 backdrop-blur-sm border-white/10 hover:border-accent/50 transition-all duration-300 overflow-hidden h-full"
                  onMouseEnter={() => setActiveFlowStep(index + 1)}
                  onMouseLeave={() => setActiveFlowStep(null)}
                >
                  <CardContent className="p-8">
                    {/* Icon & Title */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} bg-opacity-10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {category.title}
                        </h3>
                        <p className="text-white/70 text-sm leading-relaxed">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    {/* Expandable Items List */}
                    <Collapsible
                      open={isExpanded}
                      onOpenChange={() => toggleCategory(category.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="w-full justify-between text-white/70 hover:text-white hover:bg-white/5 mb-2"
                        >
                          <span className="text-sm font-medium">
                            {isExpanded ? "Dölj verktyg" : `Se alla verktyg (${category.items.length})`}
                          </span>
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="space-y-2 mt-4">
                        <div className="grid grid-cols-2 gap-3">
                          {category.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="group/item bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 hover:bg-white/20 hover:border-accent/50 transition-all duration-300 cursor-pointer"
                            >
                              {item.logo && (
                                <div className="w-full h-16 mb-2 flex items-center justify-center bg-white/90 rounded-md overflow-hidden group-hover/item:scale-105 transition-transform duration-300">
                                  <img 
                                    src={item.logo} 
                                    alt={`${item.name} logo`}
                                    loading="lazy"
                                    className="max-w-full max-h-full object-contain p-2"
                                    onError={(e) => {
                                      const img = e.currentTarget as HTMLImageElement;
                                      img.onerror = null;
                                      img.src = '/placeholder.svg';
                                    }}
                                  />
                                </div>
                              )}
                              <div className="text-center">
                                <span className="font-semibold text-white text-sm block mb-1">{item.name}</span>
                                {item.description && (
                                  <span className="text-white/60 text-xs block">{item.description}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Tech Flow Visualization */}
        <AnimatedSection className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-8 text-white">
            Så hänger teknologin ihop
          </h3>
          <p className="text-center text-white/70 mb-12 max-w-2xl mx-auto">
            Från AI-modeller till dashboards – allt integrerat i ett sömlöst ekosystem
          </p>

          <div className="relative">
            {/* Flow Steps */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8">
              {techFlowSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = activeFlowStep === step.id;

                return (
                  <div key={step.id} className="flex flex-col lg:flex-row items-center gap-4">
                    {/* Step Card */}
                    <div 
                      className={`relative group cursor-pointer transition-all duration-300 ${isActive ? 'scale-110' : ''}`}
                      onMouseEnter={() => setActiveFlowStep(step.id)}
                      onMouseLeave={() => setActiveFlowStep(null)}
                    >
                      <Card className={`bg-white/5 backdrop-blur-sm border-white/10 hover:border-accent/50 transition-all duration-300 w-48 ${isActive ? 'border-accent/80 shadow-glow' : ''}`}>
                        <CardContent className="p-6 text-center">
                          <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center group-hover:scale-110 transition-all duration-300`}>
                            <Icon className="h-7 w-7 text-white" />
                          </div>
                          <h4 className="font-bold text-white mb-2">{step.title}</h4>
                          <p className="text-xs text-white/70">{step.description}</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Arrow */}
                    {index < techFlowSteps.length - 1 && (
                      <ArrowRight className={`h-8 w-8 text-accent/50 flex-shrink-0 rotate-90 lg:rotate-0 transition-all duration-300 ${isActive ? 'text-accent scale-125' : ''}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection className="text-center">
          <Button 
            size="lg"
            className="bg-gradient-gold text-primary hover:shadow-glow transition-all duration-300 font-semibold text-lg px-10 py-7"
            onClick={onBookDemo}
          >
            Se vårt AI-ekosystem i aktion
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
};
