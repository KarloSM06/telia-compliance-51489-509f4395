import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Package } from 'lucide-react';
interface ServiceRevenueChartProps {
  data: Array<{
    serviceName: string;
    revenue: number;
    bookingCount: number;
  }>;
  isLoading?: boolean;
}
export const ServiceRevenueChart = ({
  data,
  isLoading
}: ServiceRevenueChartProps) => {
  if (isLoading) {
    return <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Package className="h-4 w-4" />
            Intäkt per tjänst
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px]">
            <p className="text-sm text-muted-foreground">Laddar...</p>
          </div>
        </CardContent>
      </Card>;
  }
  if (data.length === 0) {
    return;
  }
  return <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Package className="h-4 w-4" />
          Intäkt per tjänst
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
            <XAxis dataKey="serviceName" className="text-xs" tick={{
            fill: "hsl(var(--muted-foreground))"
          }} angle={-45} textAnchor="end" height={80} />
            <YAxis className="text-xs" tick={{
            fill: "hsl(var(--muted-foreground))"
          }} tickFormatter={v => `${v.toFixed(0)} kr`} />
            <Tooltip contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)"
          }} formatter={(value: number) => [`${value.toFixed(2)} SEK`, 'Intäkt']} />
            <Bar dataKey="revenue" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} name="Intäkt" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>;
};