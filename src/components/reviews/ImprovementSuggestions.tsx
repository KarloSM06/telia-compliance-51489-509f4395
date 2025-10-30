import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp } from "lucide-react";
import { ImprovementSuggestion } from "@/hooks/useReviewInsights";

interface ImprovementSuggestionsProps {
  suggestions: ImprovementSuggestion[];
}

export const ImprovementSuggestions = ({ suggestions }: ImprovementSuggestionsProps) => {
  const sortedSuggestions = [...suggestions].sort((a, b) => {
    const priority = { high: 3, medium: 2, low: 1 };
    return priority[b.priority] - priority[a.priority];
  });

  const priorityColors = {
    high: 'destructive',
    medium: 'default',
    low: 'secondary',
  } as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Förbättringsförslag
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedSuggestions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Inga förbättringsförslag tillgängliga ännu
          </p>
        ) : (
          <div className="space-y-4">
            {sortedSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-semibold">{suggestion.title}</h3>
                  <Badge variant={priorityColors[suggestion.priority]}>
                    {suggestion.priority === 'high' ? 'Hög' : 
                     suggestion.priority === 'medium' ? 'Medel' : 'Låg'}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {suggestion.description}
                </p>

                <div className="flex items-start gap-2 mb-3 p-2 rounded bg-muted/50">
                  <TrendingUp className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{suggestion.impact}</p>
                </div>

                {suggestion.actionable_steps && suggestion.actionable_steps.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-2">Rekommenderade åtgärder:</p>
                    <ul className="space-y-1.5 pl-4">
                      {suggestion.actionable_steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="text-sm text-muted-foreground list-disc">
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
