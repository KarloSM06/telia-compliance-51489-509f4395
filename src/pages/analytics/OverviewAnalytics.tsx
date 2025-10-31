import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatCostInSEK } from "@/lib/telephonyFormatters";
import { 
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
  CheckCircle
} from "lucide-react";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { useBusinessMetrics } from "@/hooks/useBusinessMetrics";
import { DateRangePicker, DateRange } from "@/components/dashboard/filters/DateRangePicker";
import { StatCard } from "@/components/communications/StatCard";
import { AreaChartComponent } from "@/components/dashboard/charts/AreaChartComponent";
import { LineChartComponent } from "@/components/dashboard/charts/LineChartComponent";
import { BarChartComponent } from "@/components/dashboard/charts/BarChartComponent";
import { PieChartComponent } from "@/components/dashboard/charts/PieChartComponent";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface OverviewAnalyticsProps {
  dateRange?: DateRange;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export const OverviewAnalytics = ({ dateRange, onDateRangeChange }: OverviewAnalyticsProps) => {
  const { data, loading } = useAnalyticsData(dateRange);
  const { metrics: businessMetrics } = useBusinessMetrics();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-6">
        <Alert className="bg-card/80 backdrop-blur-xl border-border/50">
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

  // Calculate review stats
  const totalReviews = data.reviews.length;
  const avgRating = totalReviews > 0 
    ? data.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews 
    : 0;
  const positiveReviews = data.reviews.filter(r => r.sentiment === 'positive').length;
  const neutralReviews = data.reviews.filter(r => r.sentiment === 'neutral').length;
  const negativeReviews = data.reviews.filter(r => r.sentiment === 'negative').length;

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
    <div className="max-w-7xl mx-auto px-6 space-y-8 pb-12">
      {/* Date Range Picker */}
      <Card className={cn(
        "p-6 bg-card/80 backdrop-blur-xl border-border/50",
        "hover:shadow-card transition-all duration-500"
      )}>
        <p className="text-sm font-semibold mb-4 text-foreground">Välj tidsperiod:</p>
        <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
      </Card>

      {/* ROI Settings Alert */}
      {!hasROISettings && (
        <Alert className="bg-card/80 backdrop-blur-xl border-secondary/30">
          <Sparkles className="h-4 w-4 text-secondary" />
          <AlertTitle>Konfigurera ROI-inställningar</AlertTitle>
          <AlertDescription>
            För att få exakta ROI-beräkningar, vänligen konfigurera dina tjänstepriser och affärsinformation i{" "}
            <Link to="/dashboard/settings?tab=roi" className="underline font-semibold text-secondary hover:text-secondary/80">
              ROI-inställningar
            </Link>
            .
          </AlertDescription>
        </Alert>
      )}

      {/* Section 1: ROI Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Intäkt (Est.)"
          value={`${data.roi.totalRevenue.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK`}
          icon={TrendingUp}
          trend={{ value: 12, isPositive: true }}
          className="bg-card/80 backdrop-blur-xl border-border/50"
        />
        <StatCard
          title="Operationella Kostnader"
          value={`${data.roi.totalCosts.toLocaleString('sv-SE', { maximumFractionDigits: 2 })} SEK`}
          icon={DollarSign}
          trend={{ value: -5, isPositive: true }}
          className="bg-card/80 backdrop-blur-xl border-border/50"
        />
        <StatCard
          title="Nettovinst"
          value={`${data.roi.netProfit.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK`}
          icon={Award}
          trend={{ value: 18, isPositive: true }}
          className="bg-card/80 backdrop-blur-xl border-border/50"
        />
        <StatCard
          title="ROI"
          value={`${data.roi.roi.toFixed(1)}%`}
          icon={Target}
          trend={{ value: 8, isPositive: true }}
          className="bg-card/80 backdrop-blur-xl border-border/50"
        />
      </div>

      {/* Section 2: Booking Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Totala Bokningar"
          value={data.bookings.length}
          icon={Calendar}
          className="bg-card/80 backdrop-blur-xl border-border/50"
        />
        <StatCard
          title="Genomsnittligt Värde"
          value={`${data.roi.revenuePerBooking.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK`}
          icon={DollarSign}
          className="bg-card/80 backdrop-blur-xl border-border/50"
        />
        <StatCard
          title="Konverteringsgrad"
          value={`${businessMetrics?.meeting_to_payment_probability || 50}%`}
          icon={TrendingUp}
          className="bg-card/80 backdrop-blur-xl border-border/50"
        />
      </div>

      {/* Section 3: Main Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AreaChartComponent
          title="Intäkter vs Kostnader - Daglig"
          data={revenueVsCostsData}
          dataKeys={[
            { key: "revenue", color: "hsl(142, 76%, 36%)", name: "Intäkter" },
            { key: "costs", color: "hsl(0, 84%, 60%)", name: "Kostnader" },
            { key: "profit", color: "hsl(43, 96%, 56%)", name: "Vinst" }
          ]}
          height={400}
        />
        
        <LineChartComponent
          title="ROI-utveckling (%)"
          data={roiTrendData}
          dataKeys={[
            { key: "roi", color: "hsl(43, 96%, 56%)", name: "ROI %" }
          ]}
          height={400}
        />
      </div>

      {/* Section 4: Cost Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PieChartComponent
          title="Kostnadsfördelning"
          data={costBreakdownData}
          innerRadius={60}
        />
        
        <BarChartComponent
          title="Bokningar per Veckodag"
          data={bookingsByWeekdayData}
          dataKeys={[
            { key: "count", color: "hsl(142, 76%, 36%)", name: "Bokningar" }
          ]}
          xAxisKey="day"
        />
        
        <BarChartComponent
          title="Vinstmarginal per Dag"
          data={data.dailyData.slice(-7)}
          dataKeys={[
            { key: "profit", color: "hsl(43, 96%, 56%)", name: "Vinst (SEK)" }
          ]}
          xAxisKey="date"
        />
      </div>

      {/* Section 5: Message Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Totala Meddelanden"
          value={totalMessages}
          icon={MessageSquare}
          className="bg-card/80 backdrop-blur-xl border-border/50"
        />
        <StatCard
          title="SMS Skickade"
          value={smsCount}
          icon={Smartphone}
          className="bg-card/80 backdrop-blur-xl border-border/50"
        />
        <StatCard
          title="Email Skickade"
          value={emailCount}
          icon={Mail}
          className="bg-card/80 backdrop-blur-xl border-border/50"
        />
        <StatCard
          title="Leveransstatus"
          value={`${deliveryRate.toFixed(1)}%`}
          icon={CheckCircle}
          className="bg-card/80 backdrop-blur-xl border-border/50"
        />
      </div>

      {/* Section 6: Telephony Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AreaChartComponent
          title="Samtalsvolym - Daglig"
          data={data.dailyData.map(d => {
            const dayTelephony = data.telephony.filter(t => {
              const tDate = new Date(t.event_timestamp).toISOString().split('T')[0];
              return tDate === d.date;
            });
            return {
              name: d.date,
              inbound: dayTelephony.filter(t => t.direction === 'inbound').length,
              outbound: dayTelephony.filter(t => t.direction === 'outbound').length
            };
          })}
          dataKeys={[
            { key: "inbound", color: "hsl(142, 76%, 36%)", name: "Inkommande" },
            { key: "outbound", color: "hsl(217, 32%, 17%)", name: "Utgående" }
          ]}
        />
        
        <Card className="p-6 bg-card/80 backdrop-blur-xl border-border/50 hover:shadow-card transition-all duration-500">
          <h3 className="text-lg font-semibold mb-4">Telefoni-statistik</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Inkommande samtal</span>
              <span className="font-bold">{inboundCalls}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Utgående samtal</span>
              <span className="font-bold">{outboundCalls}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total kostnad</span>
              <span className="font-bold">{formatCostInSEK(data.costs.telephonyCost)}</span>
            </div>
            <div className="flex justify-between items-center border-t pt-4">
              <span className="text-muted-foreground">Totala samtal</span>
              <span className="font-bold text-lg">{data.telephony.length}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Section 7: Reviews & Customer Satisfaction */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Totala Recensioner"
          value={totalReviews}
          icon={Star}
          className="bg-card/80 backdrop-blur-xl border-border/50"
        />
        <StatCard
          title="Genomsnittsbetyg"
          value={avgRating.toFixed(1)}
          icon={Award}
          className="bg-card/80 backdrop-blur-xl border-border/50"
        />
        <PieChartComponent
          title="Sentimentfördelning"
          data={[
            { name: 'Positiva', value: positiveReviews },
            { name: 'Neutrala', value: neutralReviews },
            { name: 'Negativa', value: negativeReviews }
          ].filter(item => item.value > 0)}
        />
      </div>

      {/* Section 8: AI-Insights */}
      <Card className="p-6 bg-card/80 backdrop-blur-xl border-border/50 hover:shadow-card transition-all duration-500">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-secondary" />
          <h3 className="text-lg font-semibold">AI-Insikter & Rekommendationer</h3>
        </div>
        <div className="space-y-4">
          {data.roi.roi > 100 && (
            <Alert className="bg-success/10 border-success/30">
              <TrendingUp className="h-4 w-4 text-success" />
              <AlertTitle className="text-success">Stark ROI-trend</AlertTitle>
              <AlertDescription className="text-success/80">
                Din ROI på {data.roi.roi.toFixed(1)}% är utmärkt! Fortsätt med nuvarande strategi.
              </AlertDescription>
            </Alert>
          )}
          
          {data.roi.profitMargin < 20 && (
            <Alert className="bg-warning/10 border-warning/30">
              <AlertTitle className="text-warning">Optimera vinstmarginal</AlertTitle>
              <AlertDescription className="text-warning/80">
                Din vinstmarginal är {data.roi.profitMargin.toFixed(1)}%. Överväg att optimera operationella kostnader eller höja priserna.
              </AlertDescription>
            </Alert>
          )}

          {data.bookings.length < 10 && (
            <Alert className="bg-primary/10 border-primary/30">
              <AlertTitle>Öka bokningsvolymen</AlertTitle>
              <AlertDescription>
                Du har {data.bookings.length} bokningar. Fokusera på leadgenerering för att öka intäkterna.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Card>
    </div>
  );
};
