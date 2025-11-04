import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";

interface ActivityHeatmapChartProps {
  data: Array<{
    day: string;
    hour: number;
    value: number;
  }>;
}

export const ActivityHeatmapChart = ({ data }: ActivityHeatmapChartProps) => {
  const maxValue = useMemo(() => Math.max(...data.map(d => d.value), 1), [data]);
  const days = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'];
  
  // Group data by day
  const dataByDay = useMemo(() => {
    return days.map(day => ({
      day,
      hours: data.filter(d => d.day === day).sort((a, b) => a.hour - b.hour),
    }));
  }, [data]);

  const getColor = (value: number) => {
    const intensity = value / maxValue;
    if (intensity === 0) return 'hsl(var(--muted))';
    if (intensity < 0.25) return 'hsl(var(--chart-1) / 0.3)';
    if (intensity < 0.5) return 'hsl(var(--chart-1) / 0.5)';
    if (intensity < 0.75) return 'hsl(var(--chart-1) / 0.7)';
    return 'hsl(var(--chart-1))';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivitetsmönster (Veckodag × Timme)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {dataByDay.map(({ day, hours }) => (
            <div key={day} className="flex items-center gap-2">
              <span className="text-xs font-medium w-8 text-muted-foreground">{day}</span>
              <div className="flex gap-1 flex-1">
                {hours.map(({ hour, value }) => (
                  <div
                    key={hour}
                    className="flex-1 h-6 rounded transition-all hover:scale-110 cursor-pointer"
                    style={{ backgroundColor: getColor(value) }}
                    title={`${day} ${hour}:00 - ${value} inloggningar`}
                  />
                ))}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
            <span>00:00</span>
            <span>12:00</span>
            <span>23:00</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
