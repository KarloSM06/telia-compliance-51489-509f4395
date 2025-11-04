import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectionMetrics } from "@/lib/roiCalculations";
import { TrendingUp, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { useState } from "react";

interface CompactProjectionChartProps {
  projection12: ProjectionMetrics;
  projection24: ProjectionMetrics;
  projection36: ProjectionMetrics;
  isLoading?: boolean;
}

export const CompactProjectionChart = ({ 
  projection12, 
  projection24, 
  projection36,
  isLoading 
}: CompactProjectionChartProps) => {
  const [period, setPeriod] = useState<"12" | "24" | "36">("12");

  const projectionMap = {
    "12": projection12,
    "24": projection24,
    "36": projection36,
  };

  const currentProjection = projectionMap[period];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Projekterad ROI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Projekterad ROI
          </CardTitle>
          <Select value={period} onValueChange={(v) => setPeriod(v as "12" | "24" | "36")}>
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12 månader</SelectItem>
              <SelectItem value="24">24 månader</SelectItem>
              <SelectItem value="36">36 månader</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="text-center p-2 rounded-lg bg-green-500/5 border border-green-500/10">
            <p className="text-xs text-muted-foreground">Nettovinst</p>
            <p className="text-sm font-bold text-green-600">
              {currentProjection.netProfit >= 0 ? '+' : ''}{(currentProjection.netProfit / 1000).toFixed(0)}k SEK
            </p>
          </div>
          <div className="text-center p-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
            <p className="text-xs text-muted-foreground">ROI</p>
            <p className="text-sm font-bold text-blue-600">
              {currentProjection.roi.toFixed(1)}%
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={currentProjection.cumulativeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickFormatter={(value) => `M${value}`}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [
                `${value.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK`,
                ''
              ]}
              labelFormatter={(label) => `Månad ${label}`}
            />
            {currentProjection.breakEvenMonth && (
              <ReferenceLine 
                x={currentProjection.breakEvenMonth} 
                stroke="hsl(var(--primary))" 
                strokeDasharray="3 3"
                label={{ 
                  value: 'Break-even', 
                  position: 'top',
                  fill: 'hsl(var(--primary))',
                  fontSize: 11
                }}
              />
            )}
            <Line 
              type="monotone" 
              dataKey="cumulativeProfit" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
