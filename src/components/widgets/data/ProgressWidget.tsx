import { WidgetProps } from "@/types/widget.types";
import { BaseWidget } from "../base/BaseWidget";
import { useWidgetData } from "@/hooks/useWidgetData";
import { Progress } from "@/components/ui/progress";

export const ProgressWidget = ({ id, config, dataSource, isEditing }: WidgetProps) => {
  const { data, isLoading } = useWidgetData(dataSource, id);
  
  const current = data?.[0]?.value || 0;
  const target = config.target || 100;
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <BaseWidget config={config} id={id} dataSource={dataSource} isEditing={isEditing}>
      <div className="space-y-4">
        <div className="flex justify-between items-baseline">
          <span className="text-2xl font-bold">
            {isLoading ? "..." : current.toLocaleString()}{config.unit || ""}
          </span>
          <span className="text-sm text-muted-foreground">
            / {target.toLocaleString()}{config.unit || ""}
          </span>
        </div>
        <div className="space-y-2">
          <Progress 
            value={percentage} 
            className="h-3"
            style={{
              '--progress-background': config.color || 'hsl(var(--primary))',
            } as React.CSSProperties}
          />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{percentage.toFixed(1)}% uppnått</span>
            {percentage >= 100 && (
              <span className="text-success font-medium">✓ Mål uppnått</span>
            )}
          </div>
        </div>
      </div>
    </BaseWidget>
  );
};
