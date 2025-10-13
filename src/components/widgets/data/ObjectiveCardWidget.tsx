import { WidgetProps } from "@/types/widget.types";
import { BaseWidget } from "../base/BaseWidget";
import { useWidgetData } from "@/hooks/useWidgetData";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";

export const ObjectiveCardWidget = ({ id, config, dataSource, isEditing }: WidgetProps) => {
  const { data, isLoading } = useWidgetData(dataSource, id);
  
  const current = data?.[0]?.value || 0;
  const target = config.target || 1000;
  const percentage = Math.min((current / target) * 100, 100);
  const isComplete = current >= target;

  return (
    <BaseWidget config={config} id={id} dataSource={dataSource} isEditing={isEditing}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-2xl font-bold">
            {isLoading ? "..." : current.toLocaleString()}{config.unit} / {target.toLocaleString()}{config.unit}
          </p>
        </div>
        <div className="p-2 rounded-lg bg-muted/50">
          <Target className="h-5 w-5" style={{ color: config.color }} />
        </div>
      </div>
      
      <div className="space-y-2">
        <Progress 
          value={percentage} 
          className="h-2"
          style={{
            '--progress-background': config.color || 'hsl(var(--success))',
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
    </BaseWidget>
  );
};
