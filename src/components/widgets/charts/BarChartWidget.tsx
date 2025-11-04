import { WidgetProps } from "@/types/widget.types";
import { BaseWidget } from "../base/BaseWidget";
import { useWidgetData } from "@/hooks/useWidgetData";
import { BarChartComponent } from "@/components/dashboard/charts/BarChartComponent";

export const BarChartWidget = ({ id, config, dataSource, isEditing }: WidgetProps) => {
  const { data, isLoading } = useWidgetData(dataSource, id);
  
  const chartData = data || [];
  const dataKeys = config.dataKeys || [
    { key: 'value', color: config.color || 'hsl(var(--primary))', name: 'Värde' }
  ];

  return (
    <BaseWidget config={config} id={id} dataSource={dataSource} isEditing={isEditing}>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Laddar...</p>
        </div>
      ) : (
        <BarChartComponent
          title=""
          data={chartData}
          dataKeys={dataKeys}
          xAxisKey={config.xAxisKey || 'name'}
          height={config.height || 340}
        />
      )}
    </BaseWidget>
  );
};
