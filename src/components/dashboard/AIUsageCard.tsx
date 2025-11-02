import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAIUsage } from "@/hooks/useAIUsage";
import { Brain, TrendingUp, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { startOfMonth, endOfMonth } from "date-fns";

export function AIUsageCard() {
  const navigate = useNavigate();
  const { usage, isLoading } = useAIUsage({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-användning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Laddar...</div>
        </CardContent>
      </Card>
    );
  }

  const topModel = usage?.costByModel?.[0]?.model.split('/').pop() || 'Ingen data';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-användning denna månad
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/dashboard/integrations?tab=ai')}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Kostnad och statistik för AI-anrop
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold">
              {usage?.totalCostSEK.toFixed(2) || '0.00'} SEK
            </div>
            <div className="text-xs text-muted-foreground">Total kostnad</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {usage?.totalCalls || 0}
            </div>
            <div className="text-xs text-muted-foreground">Antal anrop</div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Mest använd modell</span>
            <span className="font-medium">{topModel}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-muted-foreground">Snitt kostnad/anrop</span>
            <span className="font-medium">
              {usage?.totalCalls 
                ? `${(usage.totalCostSEK / usage.totalCalls).toFixed(2)} SEK`
                : '0.00 SEK'}
            </span>
          </div>
        </div>

        {usage && usage.dailyCosts.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>
              {usage.dailyCosts.length} dagar med AI-användning
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
