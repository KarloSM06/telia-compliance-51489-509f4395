import { CompactChartWrapper } from "./CompactChartWrapper";

interface HeatmapData {
  day: number;
  hour: number;
  value: number;
}

interface HeatmapChartProps {
  data: HeatmapData[];
  title: string;
  height?: number;
}

export const HeatmapChart = ({ data, title, height = 200 }: HeatmapChartProps) => {
  const days = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'];
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  // Group data by day for rendering
  const dayGroups = Array.from({ length: 7 }, (_, day) => {
    return data.filter(d => d.day === day).sort((a, b) => a.hour - b.hour);
  });

  return (
    <CompactChartWrapper title={title} height={height}>
      <div className="flex flex-col h-full justify-between">
        <div className="flex gap-1 text-[9px] text-muted-foreground mb-1">
          <div className="w-8"></div>
          {[0, 6, 12, 18, 23].map(h => (
            <div key={h} className="flex-1 text-center">{h}</div>
          ))}
        </div>
        {dayGroups.map((dayData, dayIndex) => (
          <div key={dayIndex} className="flex gap-1 items-center">
            <div className="w-8 text-[9px] text-muted-foreground">{days[dayIndex]}</div>
            <div className="flex-1 grid grid-cols-24 gap-[2px]">
              {Array.from({ length: 24 }, (_, hour) => {
                const cell = dayData.find(d => d.hour === hour);
                const value = cell?.value || 0;
                const intensity = value / maxValue;
                return (
                  <div
                    key={hour}
                    className="aspect-square rounded-sm"
                    style={{
                      backgroundColor: intensity > 0 
                        ? `rgba(43, 96, 56, ${Math.max(0.1, intensity)})` 
                        : 'hsl(220 13% 95%)'
                    }}
                    title={`${days[dayIndex]} ${hour}:00 - ${value} bokningar`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </CompactChartWrapper>
  );
};
