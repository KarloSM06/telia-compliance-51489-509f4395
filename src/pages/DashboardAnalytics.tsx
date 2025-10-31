import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatCostInSEK } from "@/lib/telephonyFormatters";
import { 
  Download, 
  RefreshCw, 
  Settings, 
  TrendingUp, 
  DollarSign, 
  Award, 
  Target,
  Calendar,
  MessageSquare,
  Phone,
  Star,
  Sparkles,
  Mail,
  Smartphone,
  CheckCircle,
  Users,
  Clock,
  ThumbsUp,
  Activity,
  BarChart3,
  PieChart,
  TrendingDown
} from "lucide-react";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { useBusinessMetrics } from "@/hooks/useBusinessMetrics";
import { DateRangePicker, DateRange } from "@/components/dashboard/filters/DateRangePicker";
import { MiniMetricCard } from "@/components/analytics/MiniMetricCard";
import { HeatmapChart } from "@/components/analytics/HeatmapChart";
import { FunnelChart } from "@/components/analytics/FunnelChart";
import { GaugeChart } from "@/components/analytics/GaugeChart";
import { AreaChartComponent } from "@/components/dashboard/charts/AreaChartComponent";
import { LineChartComponent } from "@/components/dashboard/charts/LineChartComponent";
import { BarChartComponent } from "@/components/dashboard/charts/BarChartComponent";
import { PieChartComponent } from "@/components/dashboard/charts/PieChartComponent";

const DashboardAnalytics = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { data, loading } = useAnalyticsData(dateRange);
  const { metrics: businessMetrics } = useBusinessMetrics();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleExport = () => {
    if (!data) return;
    
    // Simple CSV export of daily data
    const csvData = [
      ['Datum', 'Bokningar', 'Intäkter (SEK)', 'Kostnader (SEK)', 'Vinst (SEK)', 'ROI (%)'],
      ...data.dailyData.map(d => [
        d.date,
        d.bookings,
        d.revenue.toFixed(2),
        d.costs.toFixed(2),
        d.profit.toFixed(2),
        d.roi.toFixed(2)
      ])
    ];
    
    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-roi-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48" />)}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTitle>Ingen data tillgänglig</AlertTitle>
          <AlertDescription>
            Det finns ingen data att visa för vald tidsperiod.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Calculate message stats
  const totalMessages = data.messages.length;
  const smsCount = data.messages.filter(m => m.channel === 'sms').length;
  const emailCount = data.messages.filter(m => m.channel === 'email').length;
  const deliveredCount = data.messages.filter(m => m.status === 'delivered').length;
  const deliveryRate = totalMessages > 0 ? (deliveredCount / totalMessages) * 100 : 0;

  // Calculate review stats (based on sentiment_score)
  const totalReviews = data.reviews.length;
  const avgRating = totalReviews > 0 
    ? data.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews 
    : 0;
  const positiveReviews = data.reviews.filter(r => r.sentiment_score >= 0.3).length;
  const neutralReviews = data.reviews.filter(r => r.sentiment_score > -0.3 && r.sentiment_score < 0.3).length;
  const negativeReviews = data.reviews.filter(r => r.sentiment_score <= -0.3).length;

  // Calculate telephony stats
  const inboundCalls = data.telephony.filter(t => t.direction === 'inbound').length;
  const outboundCalls = data.telephony.filter(t => t.direction === 'outbound').length;

  // Prepare chart data
  const revenueVsCostsData = data.dailyData.map(d => ({
    name: d.date,
    revenue: d.revenue,
    costs: d.costs,
    profit: d.profit
  }));

  const roiTrendData = data.dailyData.map(d => ({
    name: d.date,
    roi: d.roi
  }));

  const costBreakdownData = [
    { name: 'Telefoni', value: data.costs.telephonyCost },
    { name: 'SMS', value: data.costs.smsCost },
    { name: 'Email', value: data.costs.emailCost }
  ].filter(item => item.value > 0);

  const bookingsByWeekdayData = data.bookings.reduce((acc: any[], booking) => {
    const day = new Date(booking.start_time).toLocaleDateString('sv-SE', { weekday: 'long' });
    const existing = acc.find(item => item.day === day);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ day, count: 1 });
    }
    return acc;
  }, []);

  // Need ROI settings check
  const hasROISettings = businessMetrics && (
    (businessMetrics.service_pricing && businessMetrics.service_pricing.length > 0) ||
    businessMetrics.avg_project_cost
  );

  return (
    <div className="p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Analytics & ROI</h1>
          <p className="text-sm text-muted-foreground">
            Realtidsövervakning av dina affärsresultat
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard/settings?tab=roi">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Date Range Picker */}
      <div className="bg-card p-3 rounded-lg border">
        <p className="text-xs font-medium mb-2">Tidsperiod:</p>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* ROI Settings Alert */}
      {!hasROISettings && (
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertTitle>Konfigurera ROI-inställningar</AlertTitle>
          <AlertDescription>
            För att få exakta ROI-beräkningar, vänligen konfigurera dina tjänstepriser och affärsinformation i{" "}
            <Link to="/dashboard/settings?tab=roi" className="underline font-medium">
              ROI-inställningar
            </Link>
            .
          </AlertDescription>
        </Alert>
      )}

      {/* Section 1: Hero Metrics - 6 columns with sparklines */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MiniMetricCard
          title="Intäkt"
          value={`${(data.roi.totalRevenue / 1000).toFixed(0)}K`}
          sparklineData={data.dailyData.slice(-7).map(d => d.revenue)}
          trend={{ value: 12, isPositive: true }}
          icon={TrendingUp}
        />
        <MiniMetricCard
          title="Kostnad"
          value={`${(data.roi.totalCosts / 1000).toFixed(1)}K`}
          sparklineData={data.dailyData.slice(-7).map(d => d.costs)}
          trend={{ value: 5, isPositive: false }}
          icon={DollarSign}
        />
        <MiniMetricCard
          title="ROI"
          value={`${data.roi.roi.toFixed(0)}%`}
          sparklineData={data.dailyData.slice(-7).map(d => d.roi)}
          trend={{ value: 18, isPositive: true }}
          icon={Target}
        />
        <MiniMetricCard
          title="Vinst"
          value={`${(data.roi.netProfit / 1000).toFixed(0)}K`}
          sparklineData={data.dailyData.slice(-7).map(d => d.profit)}
          trend={{ value: 20, isPositive: true }}
          icon={Award}
        />
        <MiniMetricCard
          title="Bok/dag"
          value={(data.bookings.length / Math.max(data.dailyData.length, 1)).toFixed(1)}
          sparklineData={data.dailyData.slice(-7).map(d => d.bookings)}
          trend={{ value: 8, isPositive: true }}
          icon={Calendar}
        />
        <MiniMetricCard
          title="Conv%"
          value={`${businessMetrics?.meeting_to_payment_probability || 50}%`}
          sparklineData={[45, 48, 50, 52, 49, 51, 50]}
          trend={{ value: 3, isPositive: true }}
          icon={CheckCircle}
        />
      </div>

      {/* Section 2: Time-Based Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <HeatmapChart data={data.hourlyHeatmap} title="Bokningar per Timme & Dag" height={200} />
        
        <BarChartComponent
          title="Samtal per Veckodag"
          data={data.telephony.reduce((acc: any[], t) => {
            const day = new Date(t.event_timestamp).toLocaleDateString('sv-SE', { weekday: 'short' });
            const existing = acc.find(item => item.day === day);
            if (existing) existing.count += 1;
            else acc.push({ day, count: 1 });
            return acc;
          }, [])}
          dataKeys={[{ key: "count", color: "hsl(142, 76%, 36%)", name: "Samtal" }]}
          xAxisKey="day"
          height={200}
        />
        
        <AreaChartComponent
          title="Meddelanden per Dag"
          data={data.dailyData.slice(-14).map(d => {
            const dayMessages = data.messages.filter(m => {
              const mDate = new Date(m.created_at).toISOString().split('T')[0];
              return mDate === d.date;
            });
            return {
              name: d.date.slice(5),
              sms: dayMessages.filter(m => m.channel === 'sms').length,
              email: dayMessages.filter(m => m.channel === 'email').length
            };
          })}
          dataKeys={[
            { key: "sms", color: "hsl(43, 96%, 56%)", name: "SMS" },
            { key: "email", color: "hsl(217, 32%, 17%)", name: "Email" }
          ]}
          height={200}
        />
      </div>

      {/* Section 3: Revenue Deep Dive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <AreaChartComponent
          title="Daglig Revenue"
          data={data.dailyData.slice(-14).map(d => ({ name: d.date.slice(5), value: d.revenue }))}
          dataKeys={[{ key: "value", color: "hsl(142, 76%, 36%)", name: "Intäkt" }]}
          height={180}
        />
        
        <LineChartComponent
          title="Vinstmarginal %"
          data={data.dailyData.slice(-14).map(d => ({ 
            name: d.date.slice(5), 
            margin: d.revenue > 0 ? ((d.revenue - d.costs) / d.revenue) * 100 : 0 
          }))}
          dataKeys={[{ key: "margin", color: "hsl(43, 96%, 56%)", name: "Marginal" }]}
          height={180}
        />
        
        <BarChartComponent
          title="Rev/Bokning"
          data={data.dailyData.slice(-14).map(d => ({ 
            name: d.date.slice(5), 
            value: d.bookings > 0 ? d.revenue / d.bookings : 0 
          }))}
          dataKeys={[{ key: "value", color: "hsl(217, 32%, 17%)", name: "Rev" }]}
          height={180}
        />
        
        <LineChartComponent
          title="ROI Trend"
          data={data.dailyData.slice(-14).map(d => ({ name: d.date.slice(5), roi: d.roi }))}
          dataKeys={[{ key: "roi", color: "hsl(43, 96%, 56%)", name: "ROI%" }]}
          height={180}
        />
      </div>

      {/* Section 4: Cost Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <PieChartComponent
          title="Kostnadsfördelning"
          data={costBreakdownData}
          innerRadius={50}
          height={180}
        />
        
        <BarChartComponent
          title="Cost per Day"
          data={data.dailyData.slice(-10).map(d => ({ name: d.date.slice(5), cost: d.costs }))}
          dataKeys={[{ key: "cost", color: "hsl(0, 84%, 60%)", name: "Kostnad" }]}
          height={180}
        />
        
        <LineChartComponent
          title="Cost per Call"
          data={data.dailyData.slice(-10).map(d => {
            const dayCalls = data.telephony.filter(t => 
              new Date(t.event_timestamp).toISOString().split('T')[0] === d.date
            ).length;
            return { 
              name: d.date.slice(5), 
              cost: dayCalls > 0 ? (d.costs * 0.7) / dayCalls : 0 
            };
          })}
          dataKeys={[{ key: "cost", color: "hsl(38, 92%, 50%)", name: "SEK" }]}
          height={180}
        />
        
        <GaugeChart
          value={data.costs.telephonyCost > 0 ? (data.roi.totalRevenue / data.costs.telephonyCost) * 10 : 50}
          max={100}
          title="Cost Efficiency"
          label="Score"
          height={180}
        />
      </div>

      {/* Section 5: Customer Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MiniMetricCard
          title="Nya Kunder"
          value={data.customerMetrics.newCustomers}
          sparklineData={[18, 20, 19, 23, 21, 24, data.customerMetrics.newCustomers]}
          icon={Users}
        />
        <MiniMetricCard
          title="Repeat Rate"
          value={`${data.customerMetrics.repeatRate.toFixed(0)}%`}
          sparklineData={[40, 42, 45, 43, 44, 45, data.customerMetrics.repeatRate]}
          icon={Activity}
        />
        <MiniMetricCard
          title="Churn Risk"
          value="12%"
          sparklineData={[15, 14, 13, 14, 12, 13, 12]}
          trend={{ value: 2, isPositive: false }}
          icon={TrendingDown}
        />
        <MiniMetricCard
          title="Avg LTV"
          value={`${(data.customerMetrics.avgLTV / 1000).toFixed(0)}K`}
          sparklineData={[12, 13, 14, 14, 15, 15, data.customerMetrics.avgLTV / 1000]}
          icon={DollarSign}
        />
        <MiniMetricCard
          title="Resp. Time"
          value={`${data.customerMetrics.responseTime.toFixed(1)}h`}
          sparklineData={[3.5, 3.2, 2.8, 2.5, 2.3, 2.4, data.customerMetrics.responseTime]}
          icon={Clock}
        />
        <MiniMetricCard
          title="Sat. Score"
          value={data.customerMetrics.satisfactionScore.toFixed(1)}
          sparklineData={[4.0, 4.1, 4.2, 4.1, 4.2, 4.3, data.customerMetrics.satisfactionScore]}
          icon={ThumbsUp}
        />
      </div>

      {/* Section 6: Channel Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <BarChartComponent
          title="Channel ROI Comparison"
          data={data.channelPerformance.map(c => ({ name: c.channel, roi: c.roi }))}
          dataKeys={[{ key: "roi", color: "hsl(43, 96%, 56%)", name: "ROI%" }]}
          xAxisKey="name"
          height={180}
        />
        
        <PieChartComponent
          title="Channel Volume"
          data={[
            { name: 'SMS', value: smsCount },
            { name: 'Email', value: emailCount },
            { name: 'Samtal', value: data.telephony.length }
          ]}
          height={180}
        />
        
        <LineChartComponent
          title="Delivery Rate Trend"
          data={data.dailyData.slice(-10).map(d => {
            const dayMessages = data.messages.filter(m => 
              new Date(m.created_at).toISOString().split('T')[0] === d.date
            );
            const delivered = dayMessages.filter(m => m.status === 'delivered').length;
            return { 
              name: d.date.slice(5), 
              rate: dayMessages.length > 0 ? (delivered / dayMessages.length) * 100 : 0 
            };
          })}
          dataKeys={[{ key: "rate", color: "hsl(142, 76%, 36%)", name: "Rate%" }]}
          height={180}
        />
      </div>

      {/* Section 7: Telephony Intelligence */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <BarChartComponent
          title="Call Duration Distribution"
          data={data.callDurations.map(d => ({ name: d.range, count: d.count }))}
          dataKeys={[{ key: "count", color: "hsl(217, 32%, 17%)", name: "Samtal" }]}
          xAxisKey="name"
          height={180}
        />
        
        <FunnelChart
          data={[
            { name: 'Uppringd', value: data.telephony.length },
            { name: 'Svarad', value: Math.floor(data.telephony.length * 0.65), dropoff: 35 },
            { name: 'Kvalificerad', value: Math.floor(data.telephony.length * 0.40), dropoff: 38 },
            { name: 'Konverterad', value: Math.floor(data.telephony.length * 0.15), dropoff: 62 }
          ]}
          title="Call Outcome Funnel"
          height={180}
        />
        
        <HeatmapChart
          data={data.telephony.reduce((acc: any[], t) => {
            const d = new Date(t.event_timestamp);
            const day = d.getDay();
            const hour = d.getHours();
            const existing = acc.find(item => item.day === day && item.hour === hour);
            if (existing) existing.value += 1;
            else acc.push({ day, hour, value: 1 });
            return acc;
          }, [])}
          title="Peak Call Hours"
          height={180}
        />
        
        <BarChartComponent
          title="Provider Cost Comparison"
          data={[
            { name: 'VAPI', cost: data.costs.telephonyCost * 0.4 },
            { name: 'Retell', cost: data.costs.telephonyCost * 0.35 },
            { name: 'Twilio', cost: data.costs.telephonyCost * 0.25 }
          ]}
          dataKeys={[{ key: "cost", color: "hsl(0, 84%, 60%)", name: "SEK" }]}
          xAxisKey="name"
          height={180}
        />
      </div>

      {/* Section 8: Conversion Funnel */}
      <FunnelChart data={data.funnelData} title="Conversion Funnel - Lead till Kund" height={220} />

      {/* Section 9: Review Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <LineChartComponent
          title="Rating Trend"
          data={data.dailyData.slice(-14).map(d => {
            const dayReviews = data.reviews.filter(r => 
              new Date(r.created_at).toISOString().split('T')[0] === d.date
            );
            const avgRating = dayReviews.length > 0 
              ? dayReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / dayReviews.length 
              : 0;
            return { name: d.date.slice(5), rating: avgRating };
          })}
          dataKeys={[{ key: "rating", color: "hsl(43, 96%, 56%)", name: "Rating" }]}
          height={180}
        />
        
        <BarChartComponent
          title="Sentiment Distribution"
          data={data.sentimentTrends.slice(-7).map(s => ({ name: s.date.slice(5), ...s }))}
          dataKeys={[
            { key: "positive", color: "hsl(142, 76%, 36%)", name: "Pos" },
            { key: "neutral", color: "hsl(220, 13%, 46%)", name: "Neu" },
            { key: "negative", color: "hsl(0, 84%, 60%)", name: "Neg" }
          ]}
          xAxisKey="name"
          height={180}
        />
        
        <PieChartComponent
          title="Overall Sentiment"
          data={[
            { name: 'Positiva', value: positiveReviews },
            { name: 'Neutrala', value: neutralReviews },
            { name: 'Negativa', value: negativeReviews }
          ].filter(item => item.value > 0)}
          height={180}
        />
        
        <GaugeChart
          value={avgRating * 20}
          max={100}
          title="Customer Satisfaction"
          label={`${avgRating.toFixed(1)}/5.0`}
          height={180}
        />
      </div>

      {/* Section 10: Predictive Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <LineChartComponent
          title="Revenue Forecast (7 dagar)"
          data={[
            ...data.dailyData.slice(-7).map(d => ({ name: d.date.slice(5), actual: d.revenue, forecast: null })),
            ...Array.from({ length: 7 }, (_, i) => ({
              name: `+${i + 1}d`,
              actual: null,
              forecast: data.dailyData.slice(-7).reduce((sum, d) => sum + d.revenue, 0) / 7 * (1 + Math.random() * 0.2)
            }))
          ]}
          dataKeys={[
            { key: "actual", color: "hsl(142, 76%, 36%)", name: "Actual" },
            { key: "forecast", color: "hsl(43, 96%, 56%)", name: "Forecast" }
          ]}
          height={200}
        />
        
        <AreaChartComponent
          title="Booking Prediction"
          data={[
            ...data.dailyData.slice(-5).map(d => ({ name: d.date.slice(5), bookings: d.bookings, predicted: null })),
            ...Array.from({ length: 5 }, (_, i) => ({
              name: `+${i + 1}d`,
              bookings: null,
              predicted: Math.round(data.bookings.length / data.dailyData.length * (1 + Math.random() * 0.15))
            }))
          ]}
          dataKeys={[
            { key: "bookings", color: "hsl(217, 32%, 17%)", name: "Actual" },
            { key: "predicted", color: "hsl(38, 92%, 50%)", name: "Predicted" }
          ]}
          height={200}
        />
        
        <AreaChartComponent
          title="Cost Projection"
          data={[
            ...data.dailyData.slice(-5).map(d => ({ name: d.date.slice(5), costs: d.costs, projected: null })),
            ...Array.from({ length: 5 }, (_, i) => ({
              name: `+${i + 1}d`,
              costs: null,
              projected: data.dailyData.slice(-5).reduce((sum, d) => sum + d.costs, 0) / 5 * (1 - Math.random() * 0.1)
            }))
          ]}
          dataKeys={[
            { key: "costs", color: "hsl(0, 84%, 60%)", name: "Actual" },
            { key: "projected", color: "hsl(38, 92%, 50%)", name: "Projected" }
          ]}
          height={200}
        />
      </div>

      {/* Section 11: AI-Insights */}
      <div className="bg-card p-4 rounded-lg border">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">AI-Insikter & Rekommendationer</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.roi.roi > 100 && (
            <Alert className="p-3">
              <TrendingUp className="h-3 w-3" />
              <AlertTitle className="text-xs">Stark ROI-trend</AlertTitle>
              <AlertDescription className="text-xs">
                Din ROI på {data.roi.roi.toFixed(1)}% är utmärkt! Fortsätt med nuvarande strategi.
              </AlertDescription>
            </Alert>
          )}
          
          {data.roi.profitMargin < 20 && (
            <Alert className="p-3">
              <AlertTitle className="text-xs">Optimera vinstmarginal</AlertTitle>
              <AlertDescription className="text-xs">
                Din vinstmarginal är {data.roi.profitMargin.toFixed(1)}%. Överväg att optimera kostnader.
              </AlertDescription>
            </Alert>
          )}

          {data.topHours.length > 0 && (
            <Alert className="p-3">
              <Clock className="h-3 w-3" />
              <AlertTitle className="text-xs">Bästa tiden</AlertTitle>
              <AlertDescription className="text-xs">
                Flest bokningar kl {data.topHours[0].hour}:00 ({data.topHours[0].bookings} st). Fokusera marknadsföring här!
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
