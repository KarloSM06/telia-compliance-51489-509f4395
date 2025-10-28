import { Button } from "@/components/ui/button";
import { expertiseCategories } from "@/data/expertise";
import { ExpertiseCategoryCard } from "./ExpertiseCategoryCard";

interface TechnicalExpertiseProps {
  onBookDemo: () => void;
}

export const TechnicalExpertise = ({ onBookDemo }: TechnicalExpertiseProps) => {
  return (
    <section id="teknologi" className="relative py-24 overflow-hidden bg-gradient-to-b from-background via-background/95 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Vår Tekniska Expertis
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-purple-500 mx-auto rounded-full" />
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Vi kombinerar de bästa AI-verktygen och plattformarna för att skapa kraftfulla, skräddarsydda lösningar som levererar resultat
          </p>
        </div>

        {/* Expertise Categories - Alternating Layout */}
        <div className="space-y-12 mb-16">
          {expertiseCategories.map((category, index) => (
            <div 
              key={category.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ExpertiseCategoryCard 
                category={category}
                imagePosition={index % 2 === 0 ? "left" : "right"}
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <div className="max-w-2xl mx-auto mb-8">
            <h3 className="text-2xl font-bold mb-4">Redo att transformera er verksamhet?</h3>
            <p className="text-muted-foreground">
              Låt oss visa hur vår tekniska expertis kan skapa konkreta resultat för just er
            </p>
          </div>
          <Button 
            size="lg"
            onClick={onBookDemo}
            className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 shadow-2xl hover:shadow-primary/50 transition-all duration-300"
          >
            Boka Kostnadsfri Demo
          </Button>
        </div>
      </div>
    </section>
  );
};
