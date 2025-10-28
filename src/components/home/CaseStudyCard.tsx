import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Quote } from "lucide-react";
import type { CaseStudy } from "@/data/caseStudies";

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  onBookDemo: () => void;
}

export const CaseStudyCard = ({ caseStudy, onBookDemo }: CaseStudyCardProps) => {
  return (
    <Card className="h-full flex flex-col border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:bg-card/90 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1">
      <CardHeader className="relative">
        <div className="flex items-start justify-between mb-2">
          <div>
            <CardTitle className="text-2xl mb-2 font-bold">{caseStudy.company}</CardTitle>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30">{caseStudy.industry}</Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-6">
        {/* Problem */}
        <div className="bg-background/50 rounded-lg p-4 border border-border/50">
          <h4 className="font-bold text-sm text-destructive mb-2 uppercase tracking-wide">Problem</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{caseStudy.problem}</p>
        </div>
        
        {/* Solution */}
        <div className="bg-background/50 rounded-lg p-4 border border-border/50">
          <h4 className="font-bold text-sm text-orange-600 mb-2 uppercase tracking-wide">Lösning</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{caseStudy.solution}</p>
        </div>
        
        {/* Results */}
        <div>
          <h4 className="font-bold text-sm text-primary mb-3 uppercase tracking-wide">Resultat</h4>
          <div className="grid grid-cols-2 gap-3">
            {caseStudy.results.map((result, index) => (
              <div key={index} className="bg-primary/10 rounded-lg p-4 text-center border border-primary/20 hover:bg-primary/20 transition-all duration-300">
                <p className="text-2xl font-bold text-primary mb-1">{result.value}</p>
                <p className="text-xs text-muted-foreground">{result.metric}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Testimonial */}
        <div className="bg-primary/5 rounded-lg p-5 relative border border-primary/10 hover:bg-primary/10 transition-colors duration-300">
          <Quote className="h-8 w-8 text-primary/30 absolute top-3 left-3" />
          <p className="text-sm italic mb-4 mt-2 pl-6 leading-relaxed">{caseStudy.testimonial.text}</p>
          <div className="text-xs pl-6">
            <p className="font-semibold text-foreground">{caseStudy.testimonial.author}</p>
            <p className="text-muted-foreground">{caseStudy.testimonial.role}</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 hover:shadow-2xl hover:shadow-primary/50 transition-all duration-500"
          onClick={onBookDemo}
          size="lg"
        >
          Vill du uppnå samma resultat?
        </Button>
      </CardFooter>
    </Card>
  );
};
