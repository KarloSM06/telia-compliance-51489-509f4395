import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";

interface ObjectiveCardProps {
  title: string;
  current: number;
  target: number;
  unit?: string;
  icon: LucideIcon;
  color?: string;
}

export const ObjectiveCard = ({
  title,
  current,
  target,
  unit = "",
  icon: Icon,
  color = "hsl(142, 76%, 36%)",
}: ObjectiveCardProps) => {
  const percentage = Math.min((current / target) * 100, 100);
  const isComplete = current >= target;

  return (
    <Card className="transition-all hover:shadow-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl font-bold">
              {current.toLocaleString()}{unit} / {target.toLocaleString()}{unit}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-muted/50">
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
        </div>
        
        <div className="space-y-2">
          <Progress 
            value={percentage} 
            className="h-2"
            style={{
              '--progress-background': color,
            } as React.CSSProperties}
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {percentage.toFixed(1)}% uppnått
            </span>
            {isComplete && (
              <span className="text-success font-medium">✓ Mål uppnått</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
