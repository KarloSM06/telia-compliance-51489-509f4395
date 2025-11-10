import { AnimatedSection } from "@/components/AnimatedSection";
import { caseStudies } from "@/data/caseStudies";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { ArrowRight } from "lucide-react";

export const CaseStudiesGrid = () => {
  const featuredCases = caseStudies.slice(0, 3);

  return (
    <section className="relative py-24 md:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
            Bevisat Resultat med Verkliga Företag
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Se hur våra AI-lösningar har transformerat verksamheter inom olika branscher
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCases.map((caseStudy, index) => (
            <AnimatedSection key={caseStudy.id} delay={index * 150}>
              <Card className="border-2 border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105 h-full">
                <CardHeader>
                  <Badge className="w-fit mb-3 bg-primary/20 backdrop-blur-sm">
                    {caseStudy.industry}
                  </Badge>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {caseStudy.company}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {caseStudy.packageUsed}
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Problem:</span>{" "}
                      {caseStudy.problem}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Lösning:</span>{" "}
                      {caseStudy.solution}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    {caseStudy.results.slice(0, 2).map((result, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-2xl font-bold text-primary mb-1">
                          {result.value}
                        </div>
                        <p className="text-xs text-muted-foreground">{result.metric}</p>
                      </div>
                    ))}
                  </div>

                  <button className="flex items-center gap-2 text-sm text-primary hover:gap-4 transition-all duration-300 group">
                    Läs hela case studien
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};
