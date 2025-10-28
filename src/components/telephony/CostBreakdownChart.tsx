import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { formatCost, getProviderDisplayName } from '@/lib/telephonyFormatters';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const CostBreakdownChart = ({ metrics }: { metrics: any }) => {
  // Prepare data for pie chart
  const pieData = Object.entries(metrics.byProvider).map(([provider, data]: [string, any]) => ({
    name: getProviderDisplayName(provider),
    value: data.cost,
    calls: data.calls,
    sms: data.sms,
  }));

  // Prepare data for bar chart - top 10 most expensive calls
  const topExpensiveCalls = [...metrics.events]
    .sort((a, b) => (parseFloat(b.cost_amount as any) || 0) - (parseFloat(a.cost_amount as any) || 0))
    .slice(0, 10)
    .map((event, index) => ({
      name: `Samtal ${index + 1}`,
      cost: parseFloat(event.cost_amount as any) || 0,
      duration: event.duration_seconds || 0,
      provider: getProviderDisplayName(event.provider),
    }));

  return (
    <div className="space-y-6">
      {/* Pie chart - Cost per provider */}
      <Card>
        <CardHeader>
          <CardTitle>Kostnad per leverantör</CardTitle>
        </CardHeader>
        <CardContent>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCost(value, 'SEK')}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-8">Ingen data att visa</p>
          )}
        </CardContent>
      </Card>

      {/* Bar chart - Top 10 most expensive calls */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 dyraste samtalen</CardTitle>
        </CardHeader>
        <CardContent>
          {topExpensiveCalls.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topExpensiveCalls}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => formatCost(value, 'SEK')}
                />
                <Bar dataKey="cost" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-8">Ingen data att visa</p>
          )}
        </CardContent>
      </Card>

      {/* Detailed table */}
      <Card>
        <CardHeader>
          <CardTitle>Kostnadsuppdelning - Detaljer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(metrics.byProvider).map(([provider, data]: [string, any]) => (
              <div key={provider} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{getProviderDisplayName(provider)}</h4>
                  <span className="text-lg font-bold">{formatCost(data.cost, 'SEK')}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">{data.calls}</span> samtal
                  </div>
                  <div>
                    <span className="font-medium">{data.sms}</span> SMS
                  </div>
                  <div>
                    <span className="font-medium">{Math.round(data.duration / 60)}</span> minuter
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
