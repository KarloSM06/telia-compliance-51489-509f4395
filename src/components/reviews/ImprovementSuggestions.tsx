import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, AlertCircle } from "lucide-react";
import { ImprovementSuggestion } from "@/hooks/useReviewInsights";

interface ImprovementSuggestionsProps {
  suggestions: ImprovementSuggestion[];
}

export const ImprovementSuggestions = ({ suggestions }: ImprovementSuggestionsProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4" />;
      case 'medium': return <TrendingUp className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      service: 'Service',
      product: 'Produkt',
      communication: 'Kommunikation',
      process: 'Process',
      other: 'Övrigt'
    };
    return labels[category] || category;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          <CardTitle>Förbättringsförslag</CardTitle>
        </div>
        <CardDescription>
          AI-genererade rekommendationer baserat på kunddata
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-0.5">
                    {getPriorityIcon(suggestion.priority)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{suggestion.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {suggestion.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Förväntad effekt:</span>
                      <span className="font-medium">{suggestion.expectedImpact}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge variant={getPriorityColor(suggestion.priority)}>
                    {suggestion.priority === 'high' ? 'Hög' : suggestion.priority === 'medium' ? 'Medel' : 'Låg'}
                  </Badge>
                  <Badge variant="outline">
                    {getCategoryLabel(suggestion.category)}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};