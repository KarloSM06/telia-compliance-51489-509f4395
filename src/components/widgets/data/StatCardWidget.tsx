import { WidgetProps } from "@/types/widget.types";
import { BaseWidget } from "../base/BaseWidget";
import { useWidgetData } from "@/hooks/useWidgetData";
import { TrendingUp, TrendingDown } from "lucide-react";
import { SparklineComponent } from "@/components/dashboard/charts/SparklineComponent";

export const StatCardWidget = ({ id, config, dataSource, isEditing }: WidgetProps) => {
  const { data, isLoading } = useWidgetData(dataSource, id);
  
  const value = data?.[0]?.value || 0;
  const change = config.showTrend ? data?.[0]?.change || 0 : undefined;
  const sparklineData = data?.slice(0, 10) || [];

  return (
    <BaseWidget config={config} id={id} dataSource={dataSource} isEditing={isEditing}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-3xl font-bold">
              {isLoading ? "..." : value.toLocaleString()}
            </div>
            {change !== undefined && (
              <div className="flex items-center gap-1 mt-1 text-sm">
                {change >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
                <span className={change >= 0 ? "text-success" : "text-destructive"}>
                  {Math.abs(change)}%
                </span>
              </div>
            )}
          </div>
        </div>
        {sparklineData.length > 0 && (
          <SparklineComponent data={sparklineData} color={config.color} />
        )}
      </div>
    </BaseWidget>
  );
};
