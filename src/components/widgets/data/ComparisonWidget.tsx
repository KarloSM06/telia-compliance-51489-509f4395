import { WidgetProps } from "@/types/widget.types";
import { BaseWidget } from "../base/BaseWidget";
import { useWidgetData } from "@/hooks/useWidgetData";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export const ComparisonWidget = ({ id, config, dataSource, isEditing }: WidgetProps) => {
  const { data, isLoading } = useWidgetData(dataSource, id);
  
  const current = data?.[0]?.current || 0;
  const previous = data?.[0]?.previous || 0;
  const change = previous !== 0 ? ((current - previous) / previous) * 100 : 0;

  return (
    <BaseWidget config={config} id={id} dataSource={dataSource} isEditing={isEditing}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Nuvarande period</div>
            <div className="text-2xl font-bold">{isLoading ? "..." : current.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Föregående period</div>
            <div className="text-2xl font-bold text-muted-foreground">{previous.toLocaleString()}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
          {change > 0 ? (
            <>
              <TrendingUp className="h-5 w-5 text-success" />
              <span className="font-medium text-success">+{change.toFixed(1)}%</span>
            </>
          ) : change < 0 ? (
            <>
              <TrendingDown className="h-5 w-5 text-destructive" />
              <span className="font-medium text-destructive">{change.toFixed(1)}%</span>
            </>
          ) : (
            <>
              <Minus className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-muted-foreground">Ingen förändring</span>
            </>
          )}
        </div>
      </div>
    </BaseWidget>
  );
};
