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
    <Card className="h-full flex flex-col hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div>
            <CardTitle className="text-xl mb-1">{caseStudy.company}</CardTitle>
            <Badge variant="secondary">{caseStudy.industry}</Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-6">
        {/* Problem */}
        <div>
          <h4 className="font-bold text-sm text-destructive mb-2">Problem</h4>
          <p className="text-sm text-muted-foreground">{caseStudy.problem}</p>
        </div>
        
        {/* Solution */}
        <div>
          <h4 className="font-bold text-sm text-orange-600 mb-2">Lösning</h4>
          <p className="text-sm text-muted-foreground">{caseStudy.solution}</p>
        </div>
        
        {/* Results */}
        <div>
          <h4 className="font-bold text-sm text-green-600 mb-3">Resultat</h4>
          <div className="grid grid-cols-2 gap-3">
            {caseStudy.results.map((result, index) => (
              <div key={index} className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-primary mb-1">{result.value}</p>
                <p className="text-xs text-muted-foreground">{result.metric}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Testimonial */}
        <div className="bg-primary/5 rounded-lg p-4 relative">
          <Quote className="h-6 w-6 text-primary/30 absolute top-2 left-2" />
          <p className="text-sm italic mb-3 mt-2">{caseStudy.testimonial.text}</p>
          <div className="text-xs">
            <p className="font-semibold">{caseStudy.testimonial.author}</p>
            <p className="text-muted-foreground">{caseStudy.testimonial.role}</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg"
          onClick={onBookDemo}
        >
          Vill du uppnå samma resultat?
        </Button>
      </CardFooter>
    </Card>
  );
};
