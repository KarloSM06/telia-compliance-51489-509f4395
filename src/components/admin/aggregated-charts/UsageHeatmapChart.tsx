import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UsageHeatmapChartProps {
  data: Array<{
    day: string;
    hour: number;
    value: number;
  }>;
}

export const UsageHeatmapChart = ({ data }: UsageHeatmapChartProps) => {
  const days = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getValueForCell = (day: string, hour: number) => {
    const cell = data.find(d => d.day === day && d.hour === hour);
    return cell?.value || 0;
  };

  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Användningsaktivitet (Heatmap)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="grid grid-cols-25 gap-1 text-xs">
              <div className="col-span-1" />
              {hours.map(hour => (
                <div key={hour} className="text-center text-muted-foreground">
                  {hour}
                </div>
              ))}
              {days.map(day => (
                <>
                  <div key={`${day}-label`} className="text-right pr-2 text-muted-foreground">
                    {day}
                  </div>
                  {hours.map(hour => {
                    const value = getValueForCell(day, hour);
                    const opacity = value / maxValue;
                    return (
                      <div
                        key={`${day}-${hour}`}
                        className="aspect-square rounded-sm"
                        style={{
                          backgroundColor: `hsl(var(--primary) / ${opacity})`,
                        }}
                        title={`${day} ${hour}:00 - ${value} aktiviteter`}
                      />
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
