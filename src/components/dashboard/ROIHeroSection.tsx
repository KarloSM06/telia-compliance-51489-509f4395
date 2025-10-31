import { Award, TrendingUp, DollarSign, Percent, Calendar } from 'lucide-react';
import { ROIMetricCard } from './ROIMetricCard';
import type { AnalyticsData } from '@/hooks/useAnalyticsData';

interface ROIHeroSectionProps {
  data: AnalyticsData | null;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const ROIHeroSection = ({ data }: ROIHeroSectionProps) => {
  if (!data) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 p-8 shadow-2xl">
        <div className="flex items-center justify-center h-48">
          <p className="text-white/60">Laddar ROI-data...</p>
        </div>
      </div>
    );
  }

  const { roi, dailyData } = data;
  
  // Generate sparkline data from dailyData
  const revenueSparkline = dailyData.slice(-7).map(d => d.revenue);
  const costSparkline = dailyData.slice(-7).map(d => d.costs);
  const profitSparkline = dailyData.slice(-7).map(d => d.revenue - d.costs);
  
  // Calculate trends (7-day comparison)
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const last7DaysRevenue = dailyData.slice(-7).reduce((sum, d) => sum + d.revenue, 0);
  const prev7DaysRevenue = dailyData.slice(-14, -7).reduce((sum, d) => sum + d.revenue, 0);
  const revenueTrend = calculateTrend(last7DaysRevenue, prev7DaysRevenue);

  const last7DaysCosts = dailyData.slice(-7).reduce((sum, d) => sum + d.costs, 0);
  const prev7DaysCosts = dailyData.slice(-14, -7).reduce((sum, d) => sum + d.costs, 0);
  const costTrend = calculateTrend(last7DaysCosts, prev7DaysCosts);

  const last7DaysProfit = last7DaysRevenue - last7DaysCosts;
  const prev7DaysProfit = prev7DaysRevenue - prev7DaysCosts;
  const profitTrend = calculateTrend(last7DaysProfit, prev7DaysProfit);

  const roiMetrics = [
    {
      title: 'Total Intäkt',
      value: formatCurrency(roi.totalRevenue),
      trend: revenueTrend,
      icon: TrendingUp,
      sparkline: revenueSparkline,
    },
    {
      title: 'Operationella Kostnader',
      value: formatCurrency(roi.totalCosts),
      trend: costTrend,
      icon: DollarSign,
      sparkline: costSparkline,
    },
    {
      title: 'Nettovinst',
      value: formatCurrency(roi.netProfit),
      trend: profitTrend,
      icon: TrendingUp,
      sparkline: profitSparkline,
    },
    {
      title: 'ROI',
      value: `${roi.roi.toFixed(1)}%`,
      trend: profitTrend,
      icon: Award,
      highlight: true,
    },
    {
      title: 'Genomsnitt/Bokning',
      value: formatCurrency(roi.revenuePerBooking),
      icon: Calendar,
    },
    {
      title: 'Vinstmarginal',
      value: `${roi.profitMargin.toFixed(1)}%`,
      icon: Percent,
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 p-8 shadow-2xl">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
      
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <Award className="h-8 w-8 text-gold-500" />
          <h2 className="text-3xl font-bold text-white">Affärsöversikt - ROI</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {roiMetrics.map((metric) => (
            <ROIMetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              trend={metric.trend}
              sparklineData={metric.sparkline}
              icon={metric.icon}
              highlight={metric.highlight}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
