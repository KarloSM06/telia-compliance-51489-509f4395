import { Card } from '@/components/ui/card';
import { TrendingUp, DollarSign, Award, Target, ArrowUp, ArrowDown } from 'lucide-react';
import { SparklineComponent } from '@/components/dashboard/charts/SparklineComponent';
interface ROIHeroSectionProps {
  data: any;
}
export const ROIHeroSection = ({
  data
}: ROIHeroSectionProps) => {
  if (!data) return null;
  const roiMetrics = [{
    title: 'Total Intäkt (Est.)',
    value: `${data.roi.totalRevenue.toLocaleString('sv-SE')} SEK`,
    subtitle: `${data.bookings.length} bokningar`,
    trend: {
      value: 12.5,
      isPositive: true
    },
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-500/10',
    sparkline: data.dailyData.map((d: any) => d.revenue)
  }, {
    title: 'Operationella Kostnader',
    value: `${data.roi.totalCosts.toLocaleString('sv-SE', {
      maximumFractionDigits: 2
    })} SEK`,
    subtitle: 'Telefoni, SMS, Email',
    trend: {
      value: -5.2,
      isPositive: true
    },
    icon: DollarSign,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
    sparkline: data.dailyData.map((d: any) => d.costs)
  }, {
    title: 'Nettovinst',
    value: `${data.roi.netProfit.toLocaleString('sv-SE')} SEK`,
    subtitle: `Marginal: ${data.roi.profitMargin.toFixed(1)}%`,
    trend: {
      value: 18.7,
      isPositive: true
    },
    icon: Award,
    color: 'text-amber-600',
    bgColor: 'bg-amber-500/10',
    sparkline: data.dailyData.map((d: any) => d.profit || d.revenue - d.costs)
  }, {
    title: 'ROI',
    value: `${data.roi.roi.toFixed(1)}%`,
    subtitle: 'Return on Investment',
    trend: {
      value: 25.3,
      isPositive: true
    },
    icon: Target,
    color: 'text-purple-600',
    bgColor: 'bg-purple-500/10',
    highlight: true
  }];
  return <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">ROI-översikt</h2>
        <span className="text-sm text-muted-foreground">
          Senaste 7 dagarna
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roiMetrics.map(metric => <Card key={metric.title} className={`p-6 hover:shadow-lg transition-all ${metric.highlight ? 'ring-2 ring-primary' : ''}`}>
            {/* Icon */}
            <div className="flex items-center justify-between mb-4">
              
              {metric.trend && <div className={`flex items-center gap-1 text-sm font-semibold ${metric.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.trend.isPositive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  {Math.abs(metric.trend.value)}%
                </div>}
            </div>

            {/* Title */}
            <p className="text-muted-foreground mb-1 text-2xl">{metric.title}</p>

            {/* Value */}
            <p className="text-3xl font-bold mb-1">{metric.value}</p>

            {/* Subtitle */}
            <p className="text-xs text-muted-foreground mb-3">{metric.subtitle}</p>

            {/* Sparkline */}
            {metric.sparkline && metric.sparkline.length > 0 && <div className="h-12">
                <SparklineComponent data={metric.sparkline.map((val: number) => ({
            value: val
          }))} color={metric.color.replace('text-', 'hsl(var(--chart-1))')} />
              </div>}
          </Card>)}
      </div>
    </div>;
};