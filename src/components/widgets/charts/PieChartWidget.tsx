import { WidgetProps } from "@/types/widget.types";
import { BaseWidget } from "../base/BaseWidget";
import { useWidgetData } from "@/hooks/useWidgetData";
import { PieChartComponent } from "@/components/dashboard/charts/PieChartComponent";

export const PieChartWidget = ({ id, config, dataSource, isEditing }: WidgetProps) => {
  const { data, isLoading } = useWidgetData(dataSource, id);
  
  const chartData = data || [];
  const dataKey = config.dataKeys?.[0]?.key || 'value';

  return (
    <BaseWidget config={config} id={id} dataSource={dataSource} isEditing={isEditing}>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Laddar...</p>
        </div>
      ) : (
        <PieChartComponent
          title=""
          data={chartData}
          height={config.height || 340}
        />
      )}
    </BaseWidget>
  );
};
