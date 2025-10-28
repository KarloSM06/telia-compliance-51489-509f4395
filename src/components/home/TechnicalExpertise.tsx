import { Button } from "@/components/ui/button";
import { expertiseCategories } from "@/data/expertise";
import { ExpertiseCategoryCard } from "./ExpertiseCategoryCard";
import { OptimizedAnimatedSection } from "@/components/OptimizedAnimatedSection";

interface TechnicalExpertiseProps {
  onBookDemo: () => void;
}

export const TechnicalExpertise = ({ onBookDemo }: TechnicalExpertiseProps) => {
  return (
    <section id="teknologi" className="relative py-24 overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 space-y-6">
          <div className="inline-block">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
              Vår Tekniska Expertis
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50" />
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
            Vi kombinerar de bästa AI-verktygen och plattformarna för att skapa kraftfulla, skräddarsydda lösningar som levererar resultat
          </p>
        </div>

        {/* Expertise Categories - Alternating Layout */}
        <div className="space-y-16 mb-20">
          {expertiseCategories.map((category, index) => (
            <OptimizedAnimatedSection 
              key={category.id} 
              delay={index * 200} 
              direction={index % 2 === 0 ? 'left' : 'right'}
            >
              <ExpertiseCategoryCard 
                category={category}
                imagePosition={index % 2 === 0 ? "left" : "right"}
              />
            </OptimizedAnimatedSection>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-24">
          <div className="max-w-2xl mx-auto mb-10 space-y-4">
            <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Redo att transformera er verksamhet?
            </h3>
            <p className="text-lg text-muted-foreground">
              Låt oss visa hur vår tekniska expertis kan skapa konkreta resultat för just er
            </p>
          </div>
          <Button 
            size="lg"
            onClick={onBookDemo}
            className="text-lg px-10 py-7 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-2xl hover:shadow-primary/50 transition-all duration-500 hover:scale-105"
          >
            Boka Kostnadsfri Demo
          </Button>
        </div>
      </div>
    </section>
  );
};
