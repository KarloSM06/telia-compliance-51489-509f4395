import { Card, CardContent } from "@/components/ui/card";
import { Award, TrendingUp, Target, DollarSign, BarChart3, Percent } from "lucide-react";
import { ROIMetricCard } from "./ROIMetricCard";
import { AnalyticsData } from "@/hooks/useAnalyticsData";

interface ROIHeroSectionProps {
  data: AnalyticsData | null;
  loading?: boolean;
}

export const ROIHeroSection = ({ data, loading }: ROIHeroSectionProps) => {
  if (loading || !data) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-[#0A1F3D] via-[#1A2F4D] to-[#0A1F3D] p-8 shadow-2xl animate-pulse">
        <div className="h-32" />
      </div>
    );
  }

  const roi = data.roi;
  
  // Calculate sparkline data (last 7 days)
  const revenueSparkline = data.dailyData.slice(-7).map(d => ({ value: d.revenue }));
  const costSparkline = data.dailyData.slice(-7).map(d => ({ value: d.costs }));
  const profitSparkline = data.dailyData.slice(-7).map(d => ({ value: d.profit }));
  const roiSparkline = data.dailyData.slice(-7).map(d => ({ value: d.roi }));

  // Calculate trends (comparing last 7 days to previous 7 days)
  const recentData = data.dailyData.slice(-7);
  const previousData = data.dailyData.slice(-14, -7);
  
  const recentRevenue = recentData.reduce((sum, d) => sum + d.revenue, 0);
  const previousRevenue = previousData.reduce((sum, d) => sum + d.revenue, 0);
  const revenueTrend = previousRevenue > 0 ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

  const recentCosts = recentData.reduce((sum, d) => sum + d.costs, 0);
  const previousCosts = previousData.reduce((sum, d) => sum + d.costs, 0);
  const costTrend = previousCosts > 0 ? ((recentCosts - previousCosts) / previousCosts) * 100 : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-[#0A1F3D] via-[#1A2F4D] to-[#0A1F3D] p-8 shadow-2xl">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37]">
            <Award className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Affärsöversikt</h2>
            <p className="text-white/60 text-sm">Return on Investment</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <ROIMetricCard
            title="Total Intäkt (est.)"
            value={`${roi.totalRevenue.toLocaleString('sv-SE')} kr`}
            trend={revenueTrend}
            sparkline={revenueSparkline}
            icon={DollarSign}
          />
          
          <ROIMetricCard
            title="Operationella Kostnader"
            value={`${roi.totalCosts.toLocaleString('sv-SE')} kr`}
            trend={costTrend}
            sparkline={costSparkline}
            icon={BarChart3}
          />
          
          <ROIMetricCard
            title="Nettovinst"
            value={`${roi.netProfit.toLocaleString('sv-SE')} kr`}
            trend={roi.roi > 0 ? roi.roi : undefined}
            sparkline={profitSparkline}
            icon={TrendingUp}
          />
          
          <ROIMetricCard
            title="ROI %"
            value={`${roi.roi.toFixed(1)}%`}
            trend={roi.roi > 0 ? roi.roi : undefined}
            sparkline={roiSparkline}
            icon={Percent}
            highlighted
          />
          
          <ROIMetricCard
            title="Värde/Bokning"
            value={`${roi.revenuePerBooking.toLocaleString('sv-SE')} kr`}
            icon={Target}
          />
          
          <ROIMetricCard
            title="Vinstmarginal"
            value={`${roi.profitMargin.toFixed(1)}%`}
            icon={TrendingUp}
          />
        </div>
      </div>
    </div>
  );
};
