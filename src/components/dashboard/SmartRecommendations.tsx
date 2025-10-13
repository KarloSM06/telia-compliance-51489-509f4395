import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, ArrowRight } from "lucide-react";
import { useProductRecommendations } from "@/hooks/useProductRecommendations";
import { useNavigate } from "react-router-dom";

export function SmartRecommendations() {
  const { recommendations, hasRecommendations } = useProductRecommendations();
  const navigate = useNavigate();

  if (!hasRecommendations) {
    return null;
  }

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'upgrade':
        return 'border-warning/50 bg-warning/5';
      case 'cross-sell':
        return 'border-primary/50 bg-primary/5';
      case 'upsell':
        return 'border-accent/50 bg-accent/5';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-warning" />
          Förslag till dig
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.slice(0, 3).map((rec, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${getRecommendationColor(rec.type)}`}
          >
            <h4 className="font-semibold mb-2">{rec.title}</h4>
            <p className="text-sm text-muted-foreground mb-3">
              {rec.description}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => navigate('/dashboard/packages')}
            >
              Läs mer
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
