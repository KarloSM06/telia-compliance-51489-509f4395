import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Driver } from "@/hooks/useReviewInsights";

interface TopDriversProps {
  positiveDrivers: Driver[];
  negativeDrivers: Driver[];
}

export const TopDrivers = ({ positiveDrivers, negativeDrivers }: TopDriversProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Positive Drivers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-success">
            <ThumbsUp className="h-5 w-5" />
            Positiva Drivkrafter
          </CardTitle>
        </CardHeader>
        <CardContent>
          {positiveDrivers.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Ingen data tillgänglig
            </p>
          ) : (
            <div className="space-y-3">
              {positiveDrivers.slice(0, 5).map((driver, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border bg-success/5 hover:bg-success/10 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium">{driver.topic}</div>
                    <div className="text-sm text-muted-foreground">
                      Sentiment: {(driver.sentiment * 100).toFixed(0)}%
                    </div>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {driver.mentions} {driver.mentions === 1 ? 'gång' : 'gånger'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Negative Drivers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <ThumbsDown className="h-5 w-5" />
            Negativa Drivkrafter
          </CardTitle>
        </CardHeader>
        <CardContent>
          {negativeDrivers.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Inga negativa drivkrafter funna
            </p>
          ) : (
            <div className="space-y-3">
              {negativeDrivers.slice(0, 5).map((driver, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border bg-destructive/5 hover:bg-destructive/10 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium">{driver.topic}</div>
                    <div className="text-sm text-muted-foreground">
                      Sentiment: {(driver.sentiment * 100).toFixed(0)}%
                    </div>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {driver.mentions} {driver.mentions === 1 ? 'gång' : 'gånger'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
