import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PremiumCard, PremiumCardContent, PremiumCardHeader, PremiumCardTitle } from "@/components/ui/premium-card";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  Info
} from "lucide-react";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { useBusinessMetrics } from "@/hooks/useBusinessMetrics";
import { DateRangePicker, DateRange } from "@/components/dashboard/filters/DateRangePicker";
import { StatCard } from "@/components/communications/StatCard";
import { AreaChartComponent } from "@/components/dashboard/charts/AreaChartComponent";
import { LineChartComponent } from "@/components/dashboard/charts/LineChartComponent";
import { BarChartComponent } from "@/components/dashboard/charts/BarChartComponent";
import { PieChartComponent } from "@/components/dashboard/charts/PieChartComponent";
import { BreakEvenCard } from "@/components/dashboard/BreakEvenCard";
import { ProjectionTabs } from "@/components/dashboard/ProjectionTabs";
import { ServiceROIBreakdown } from "@/components/dashboard/ServiceROIBreakdown";
import { ConversionFunnelChart } from "@/components/dashboard/ConversionFunnelChart";
import { useConversionFunnel } from "@/hooks/useConversionFunnel";

const DashboardAnalytics = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { data, loading } = useAnalyticsData(dateRange);
  const { metrics: businessMetrics } = useBusinessMetrics();
  const { metrics: funnelMetrics } = useConversionFunnel(dateRange || {
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date()
  });

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
      <div className="p-6 space-y-6">
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics & ROI</h1>
          <p className="text-muted-foreground">
            Realtidsövervakning av dina affärsresultat och ROI
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Uppdatera
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard/settings?tab=roi">
              <Settings className="h-4 w-4 mr-2" />
              ROI-inställningar
            </Link>
          </Button>
        </div>
      </div>

      {/* Date Range Picker */}
      <div className="bg-card p-4 rounded-lg border">
        <p className="text-sm font-medium mb-3">Välj tidsperiod:</p>
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

      {/* Section 1: ROI Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Intäkt (Est.)"
          value={`${data.roi.totalRevenue.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK`}
          icon={TrendingUp}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Driftkostnader"
          value={`${data.costs.totalOperatingCost.toLocaleString('sv-SE', { maximumFractionDigits: 2 })} SEK`}
          icon={DollarSign}
          trend={{ value: -5, isPositive: true }}
        />
        <StatCard
          title="Nettovinst"
          value={`${data.roi.netProfit.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK`}
          icon={Award}
          trend={{ value: 18, isPositive: true }}
        />
        <StatCard
          title="ROI"
          value={`${data.roi.roi.toFixed(1)}%`}
          icon={Target}
          trend={{ value: 8, isPositive: true }}
        />
      </div>


      {/* Section 2: Booking Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Totala Bokningar"
          value={data.bookings.length}
          icon={Calendar}
        />
        <StatCard
          title="Genomsnittligt Värde"
          value={`${data.roi.revenuePerBooking.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK`}
          icon={DollarSign}
        />
        <StatCard
          title="Konverteringsgrad"
          value={`${businessMetrics?.meeting_to_payment_probability || 50}%`}
          icon={TrendingUp}
        />
      </div>

      {/* Section 2.5: Cost Breakdown Card */}
      <PremiumCard>
        <PremiumCardHeader>
          <PremiumCardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Kostnadsfördelning
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    Variabla kostnader (Telefoni, SMS, Email) baseras på faktisk användning. 
                    Hiems Plattform är en fast månadskostnad. 
                    Integration är en engångsbetalning vid start.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </PremiumCardTitle>
        </PremiumCardHeader>
        <PremiumCardContent>
          <div className="space-y-3">
            {/* Variable Costs */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Variabla Kostnader</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Telefoni</span>
                </div>
                <span className="font-semibold">
                  {data.costs.telephonyCost.toLocaleString('sv-SE', { maximumFractionDigits: 2 })} SEK
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">SMS</span>
                </div>
                <span className="font-semibold">
                  {data.costs.smsCost.toLocaleString('sv-SE', { maximumFractionDigits: 2 })} SEK
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Email</span>
                </div>
                <span className="font-semibold">
                  {data.costs.emailCost.toLocaleString('sv-SE', { maximumFractionDigits: 2 })} SEK
                </span>
              </div>
            </div>
            
            <Separator />
            
            {/* Operating Costs */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Driftkostnad</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-muted-foreground">Hiems Plattform</span>
                </div>
                <span className="font-semibold text-green-600">
                  {data.costs.hiemsSupportCost.toLocaleString('sv-SE', { maximumFractionDigits: 2 })} SEK
                </span>
              </div>
            </div>
            
            {data.costs.isIntegrationCostIncluded && data.costs.integrationCost > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Startkostnad (Engång)</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-muted-foreground">Integration</span>
                    </div>
                    <span className="font-semibold text-blue-600">
                      {data.costs.integrationCost.toLocaleString('sv-SE', { maximumFractionDigits: 2 })} SEK
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950 p-2 rounded">
                    * Engångsbetalning inkluderad i denna period
                  </p>
                </div>
              </>
            )}
            
            <Separator className="my-2" />
            
            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Totala Driftkostnader</span>
                <span className="font-semibold">
                  {data.costs.totalOperatingCost.toLocaleString('sv-SE', { maximumFractionDigits: 2 })} SEK
                </span>
              </div>
              {data.costs.isIntegrationCostIncluded && (
                <div className="flex justify-between items-center text-lg font-bold pt-2 border-t">
                  <span>Total (inkl. startkostnad)</span>
                  <span className="text-primary">
                    {data.costs.totalCost.toLocaleString('sv-SE', { maximumFractionDigits: 2 })} SEK
                  </span>
                </div>
              )}
              {!data.costs.isIntegrationCostIncluded && (
                <div className="flex justify-between items-center text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">
                    {data.costs.totalCost.toLocaleString('sv-SE', { maximumFractionDigits: 2 })} SEK
                  </span>
                </div>
              )}
            </div>
          </div>
        </PremiumCardContent>
      </PremiumCard>

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

      {/* Section 4.5: Break-Even & Projections */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">ROI-Projektioner</h2>
          <p className="text-muted-foreground mb-6">
            Simulering av intäkter, kostnader och ROI över 12, 24 och 36 månader baserat på din nuvarande data.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BreakEvenCard breakEven={data.breakEven} />
          <PremiumCard>
            <PremiumCardHeader>
              <PremiumCardTitle>Snabböversikt - 12 Månader</PremiumCardTitle>
            </PremiumCardHeader>
            <PremiumCardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Intäkt</span>
                  <span className="font-semibold text-green-600">
                    {data.projection12.totalRevenue.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Kostnad</span>
                  <span className="font-semibold text-red-600">
                    {data.projection12.totalCost.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold">Nettovinst</span>
                  <span className={`text-xl font-bold ${data.projection12.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {data.projection12.netProfit >= 0 ? '+' : ''}{data.projection12.netProfit.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">ROI</span>
                  <span className={`text-xl font-bold ${data.projection12.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {data.projection12.roi.toFixed(1)}%
                  </span>
                </div>
              </div>
            </PremiumCardContent>
          </PremiumCard>
        </div>

        <ProjectionTabs 
          projection12={data.projection12}
          projection24={data.projection24}
          projection36={data.projection36}
        />
      </div>

      {/* Conversion Funnel */}
      {funnelMetrics && (
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Konverteringstratt</h2>
            <p className="text-muted-foreground">
              Spåra hela kundresan från lead till stängd affär
            </p>
          </div>
          <ConversionFunnelChart metrics={funnelMetrics} />
        </div>
      )}

      {/* Service-Based ROI */}
      {data.serviceMetrics && data.serviceMetrics.length > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Tjänstebaserad ROI</h2>
            <p className="text-muted-foreground">
              Lönsamhetsanalys per tjänstekategori
            </p>
          </div>
          <ServiceROIBreakdown services={data.serviceMetrics} />
        </div>
      )}

      {/* Section 5: Message Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Totala Meddelanden"
          value={totalMessages}
          icon={MessageSquare}
        />
        <StatCard
          title="SMS Skickade"
          value={smsCount}
          icon={Smartphone}
        />
        <StatCard
          title="Email Skickade"
          value={emailCount}
          icon={Mail}
        />
        <StatCard
          title="Leveransstatus"
          value={`${deliveryRate.toFixed(1)}%`}
          icon={CheckCircle}
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
        
        <div className="bg-card p-6 rounded-lg border">
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
        </div>
      </div>

      {/* Section 7: Reviews & Customer Satisfaction */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Totala Recensioner"
          value={totalReviews}
          icon={Star}
        />
        <StatCard
          title="Genomsnittsbetyg"
          value={avgRating.toFixed(1)}
          icon={Award}
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
      <div className="bg-card p-6 rounded-lg border">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">AI-Insikter & Rekommendationer</h3>
        </div>
        <div className="space-y-4">
          {data.roi.roi > 100 && (
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertTitle>Stark ROI-trend</AlertTitle>
              <AlertDescription>
                Din ROI på {data.roi.roi.toFixed(1)}% är utmärkt! Fortsätt med nuvarande strategi.
              </AlertDescription>
            </Alert>
          )}
          
          {data.roi.profitMargin < 20 && (
            <Alert>
              <AlertTitle>Optimera vinstmarginal</AlertTitle>
              <AlertDescription>
                Din vinstmarginal är {data.roi.profitMargin.toFixed(1)}%. Överväg att optimera operationella kostnader eller höja priserna.
              </AlertDescription>
            </Alert>
          )}

          {data.bookings.length < 10 && (
            <Alert>
              <AlertTitle>Öka bokningsvolymen</AlertTitle>
              <AlertDescription>
                Du har {data.bookings.length} bokningar. Fokusera på leadgenerering för att öka intäkterna.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
