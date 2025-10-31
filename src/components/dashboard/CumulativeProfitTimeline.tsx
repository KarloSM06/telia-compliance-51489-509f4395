import { PremiumCard, PremiumCardContent, PremiumCardHeader, PremiumCardTitle } from "@/components/ui/premium-card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from "recharts";
import { CumulativeROIMetrics } from "@/lib/roiCalculations";
import { TrendingUp } from "lucide-react";

interface CumulativeProfitTimelineProps {
  data: CumulativeROIMetrics;
}

export const CumulativeProfitTimeline = ({ data }: CumulativeProfitTimelineProps) => {
  // Find break-even point index
  const breakEvenIndex = data.dailyCumulativeData.findIndex(d => d.isBreakEven);
  
  // Format data for chart
  const chartData = data.dailyCumulativeData.map((d, index) => ({
    date: d.date,
    profit: d.cumulativeProfit,
    isBreakEven: d.isBreakEven,
    displayDate: new Date(d.date).toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' })
  }));

  // Only show every Nth label to avoid crowding
  const labelInterval = Math.ceil(chartData.length / 10);

  return (
    <PremiumCard>
      <PremiumCardHeader>
        <PremiumCardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Kumulativ Vinst över Tid
        </PremiumCardTitle>
      </PremiumCardHeader>
      <PremiumCardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="profitGradientPositive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="profitGradientNegative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="displayDate" 
              tick={{ fontSize: 12 }}
              interval={labelInterval}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              formatter={(value: number) => [
                `${value.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK`,
                'Kumulativ Vinst'
              ]}
              labelFormatter={(label) => `Datum: ${label}`}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            
            {/* Break-even reference line at y=0 */}
            <ReferenceLine 
              y={0} 
              stroke="hsl(var(--muted-foreground))" 
              strokeDasharray="5 5"
              label={{ 
                value: 'Break-Even', 
                position: 'right',
                fill: 'hsl(var(--muted-foreground))',
                fontSize: 12
              }}
            />
            
            {/* Break-even vertical marker */}
            {breakEvenIndex >= 0 && (
              <ReferenceLine 
                x={chartData[breakEvenIndex].displayDate}
                stroke="hsl(142, 76%, 36%)"
                strokeWidth={2}
                strokeDasharray="3 3"
                label={{ 
                  value: '✓ Break-Even', 
                  position: 'top',
                  fill: 'hsl(142, 76%, 36%)',
                  fontSize: 12,
                  fontWeight: 'bold'
                }}
              />
            )}
            
            {/* Area under/over the line */}
            <Area
              type="monotone"
              dataKey="profit"
              stroke="none"
              fill="url(#profitGradientNegative)"
              fillOpacity={1}
              isAnimationActive={false}
            />
            
            {/* Main profit line */}
            <Line 
              type="monotone" 
              dataKey="profit" 
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
        
        <div className="mt-4 text-sm text-muted-foreground text-center">
          <p>
            Visar kumulativ vinst från integrationsdatum. 
            {data.isBreakEven ? (
              <span className="text-success font-semibold"> Break-even uppnått! 🎉</span>
            ) : (
              <span> På väg mot break-even.</span>
            )}
          </p>
        </div>
      </PremiumCardContent>
    </PremiumCard>
  );
};
