import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CaseStudy } from "@/data/caseStudies";
import { TrendingUp, Quote } from "lucide-react";

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  onCTA: () => void;
}

export const CaseStudyCard = ({ caseStudy, onCTA }: CaseStudyCardProps) => {
  return (
    <Card className="h-full transition-all duration-300 hover:shadow-elegant">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div>
            <CardTitle className="text-xl mb-1">{caseStudy.company}</CardTitle>
            <Badge variant="secondary">{caseStudy.industry}</Badge>
          </div>
          <TrendingUp className="h-6 w-6 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-1 text-destructive">Problem</h4>
          <p className="text-sm text-muted-foreground">{caseStudy.problem}</p>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-1 text-primary">Lösning</h4>
          <p className="text-sm text-muted-foreground">{caseStudy.solution}</p>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2">Resultat</h4>
          <div className="grid grid-cols-2 gap-3">
            {caseStudy.results.map((result, index) => (
              <div key={index} className="bg-primary/5 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-primary mb-1">{result.value}</div>
                <div className="text-xs text-muted-foreground">{result.metric}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 relative">
          <Quote className="h-6 w-6 text-primary/30 absolute top-2 left-2" />
          <p className="text-sm italic mb-3 pl-6">{caseStudy.testimonial.text}</p>
          <div className="text-xs font-semibold">{caseStudy.testimonial.author}</div>
          <div className="text-xs text-muted-foreground">{caseStudy.testimonial.role}</div>
        </div>

        <Button onClick={onCTA} className="w-full" variant="outline">
          Vill du uppnå samma resultat?
        </Button>
      </CardContent>
    </Card>
  );
};
