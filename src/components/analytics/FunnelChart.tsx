import { CompactChartWrapper } from "./CompactChartWrapper";

interface FunnelStage {
  name: string;
  value: number;
  dropoff?: number;
}

interface FunnelChartProps {
  data: FunnelStage[];
  title: string;
  height?: number;
}

export const FunnelChart = ({ data, title, height = 200 }: FunnelChartProps) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  return (
    <CompactChartWrapper title={title} height={height}>
      <div className="flex flex-col gap-2 justify-center h-full px-2">
        {data.map((stage, i) => {
          const widthPercent = (stage.value / maxValue) * 100;
          return (
            <div key={i} className="flex items-center gap-2">
              <div className="w-20 text-xs text-right font-medium truncate">{stage.name}</div>
              <div className="flex-1 relative">
                <div
                  className="h-7 bg-gradient-to-r from-secondary to-secondary/70 rounded-r-lg flex items-center px-2 shadow-sm"
                  style={{ width: `${widthPercent}%` }}
                >
                  <span className="text-xs font-bold text-primary">{stage.value}</span>
                </div>
              </div>
              {stage.dropoff !== undefined && (
                <div className="w-12 text-xs text-destructive font-medium">-{stage.dropoff}%</div>
              )}
            </div>
          );
        })}
      </div>
    </CompactChartWrapper>
  );
};
