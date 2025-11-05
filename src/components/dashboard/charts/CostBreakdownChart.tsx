import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiLineChart } from "./MultiLineChart";
import { useMemo, useRef } from "react";
import { ChartActionMenu } from "./enhanced/ChartActionMenu";
import { useChartExport } from "@/hooks/useChartExport";

interface CostBreakdownChartProps {
  dailyData: Array<{ date: string; costs: number }>;
  telephonyData?: any[];
  messagesData?: any[];
  aiUsageData?: any[];
  hiemsMonthlyCost?: number;
  isLoading?: boolean;
}

export const CostBreakdownChart = ({ 
  dailyData, 
  telephonyData = [],
  messagesData = [],
  aiUsageData = [],
  hiemsMonthlyCost = 0,
  isLoading 
}: CostBreakdownChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const { exportToPNG, exportToCSV } = useChartExport();
  const chartData = useMemo(() => {
    if (!dailyData || dailyData.length === 0) return [];

    const dailyHiemsCost = hiemsMonthlyCost / 30;

    return dailyData.map(day => {
      // Calculate telephony cost for this day
      const dayTelephony = telephonyData.filter(t => {
        const tDate = new Date(t.event_timestamp).toISOString().split('T')[0];
        return tDate === day.date;
      });
      const telephonyCost = dayTelephony.reduce((sum, t) => {
        return sum + (t.aggregate_cost_amount || 0);
      }, 0);

      // Calculate SMS/Email cost for this day
      const dayMessages = messagesData.filter(m => {
        const mDate = new Date(m.created_at).toISOString().split('T')[0];
        return mDate === day.date;
      });
      const smsCost = dayMessages
        .filter(m => m.message_type === 'sms')
        .reduce((sum, m) => sum + ((m.metadata as any)?.cost_sek || 0), 0);
      const emailCost = dayMessages
        .filter(m => m.message_type === 'email')
        .reduce((sum, m) => sum + ((m.metadata as any)?.cost_sek || 0), 0);

      // Calculate AI cost for this day
      const dayAI = aiUsageData.filter(ai => {
        const aiDate = new Date(ai.created_at).toISOString().split('T')[0];
        return aiDate === day.date;
      });
      const aiCost = dayAI.reduce((sum, ai) => sum + parseFloat(ai.cost_sek || 0), 0);

      return {
        date: day.date,
        telephony: telephonyCost,
        sms: smsCost,
        email: emailCost,
        ai: aiCost,
        hiems: dailyHiemsCost
      };
    });
  }, [dailyData, telephonyData, messagesData, aiUsageData, hiemsMonthlyCost]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kostnadsfördelning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[320px]">
            <p className="text-muted-foreground">Laddar...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kostnadsfördelning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[320px]">
            <p className="text-muted-foreground">Ingen data tillgänglig</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card ref={chartRef}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Kostnadsfördelning per Dag</CardTitle>
            <p className="text-sm text-muted-foreground">
              Detaljerad uppdelning av kostnader per kategori
            </p>
          </div>
          <ChartActionMenu
            onExportPNG={() => exportToPNG(chartRef.current, 'kostnadsfordelning')}
            onExportCSV={() => exportToCSV(chartData, 'kostnadsfordelning')}
          />
        </div>
      </CardHeader>
      <CardContent>
        <MultiLineChart
          data={chartData}
          lines={[
            { dataKey: 'telephony', color: 'hsl(217, 91%, 60%)', name: 'Telefoni' },
            { dataKey: 'sms', color: 'hsl(271, 70%, 60%)', name: 'SMS' },
            { dataKey: 'email', color: 'hsl(189, 94%, 43%)', name: 'Email' },
            { dataKey: 'ai', color: 'hsl(330, 81%, 60%)', name: 'AI (OpenRouter)' },
            { dataKey: 'hiems', color: 'hsl(142, 76%, 36%)', name: 'Hiems' }
          ]}
          yAxisFormatter={(v) => `${v.toFixed(0)} kr`}
          tooltipFormatter={(v) => `${v.toFixed(2)} SEK`}
          height={380}
          showBrush
        />
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Klicka på kategorinamnen i förklaringen för att visa/dölja dem
        </p>
      </CardContent>
    </Card>
  );
};
