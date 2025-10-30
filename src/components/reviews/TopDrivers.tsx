import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Driver } from "@/hooks/useReviewInsights";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface TopDriversProps {
  positiveDrivers: Driver[];
  negativeDrivers: Driver[];
}

export const TopDrivers = ({ positiveDrivers, negativeDrivers }: TopDriversProps) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'hsl(var(--primary))';
      case 'medium': return 'hsl(var(--secondary))';
      default: return 'hsl(var(--muted))';
    }
  };

  const renderDriverList = (drivers: Driver[], isPositive: boolean) => {
    const maxFrequency = Math.max(...drivers.map(d => d.frequency), 1);
    
    return (
      <div className="space-y-3">
        {drivers.map((driver, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-sm font-medium">{driver.driver}</p>
                <p className="text-xs text-muted-foreground">
                  {driver.frequency} {driver.frequency === 1 ? 'gång' : 'gånger'}
                </p>
              </div>
              <Badge 
                variant={driver.impact === 'high' ? 'default' : 'secondary'}
                className="capitalize"
              >
                {driver.impact === 'high' ? 'Hög' : driver.impact === 'medium' ? 'Medel' : 'Låg'}
              </Badge>
            </div>
            <Progress 
              value={(driver.frequency / maxFrequency) * 100}
              className="h-2"
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Positive Drivers */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ThumbsUp className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg">Positiva drivkrafter</CardTitle>
          </div>
          <CardDescription>
            Vad kunder uppskattar mest
          </CardDescription>
        </CardHeader>
        <CardContent>
          {positiveDrivers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Ingen data tillgänglig
            </p>
          ) : (
            renderDriverList(positiveDrivers, true)
          )}
        </CardContent>
      </Card>

      {/* Negative Drivers */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ThumbsDown className="h-5 w-5 text-red-600" />
            <CardTitle className="text-lg">Negativa drivkrafter</CardTitle>
          </div>
          <CardDescription>
            Områden som behöver förbättras
          </CardDescription>
        </CardHeader>
        <CardContent>
          {negativeDrivers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Ingen data tillgänglig
            </p>
          ) : (
            renderDriverList(negativeDrivers, false)
          )}
        </CardContent>
      </Card>
    </div>
  );
};