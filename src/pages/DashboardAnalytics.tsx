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
  Info,
  Brain,
  ExternalLink,
  Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { useBusinessMetrics } from "@/hooks/useBusinessMetrics";
import { useAIUsage } from "@/hooks/useAIUsage";
import { DateRangePicker, DateRange } from "@/components/dashboard/filters/DateRangePicker";
import { StatCard } from "@/components/communications/StatCard";
import { PremiumTelephonyStatCard } from "@/components/telephony/PremiumTelephonyStatCard";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { AreaChartComponent } from "@/components/dashboard/charts/AreaChartComponent";
import { LineChartComponent } from "@/components/dashboard/charts/LineChartComponent";
import { BarChartComponent } from "@/components/dashboard/charts/BarChartComponent";
import { PieChartComponent } from "@/components/dashboard/charts/PieChartComponent";
import { BreakEvenCard } from "@/components/dashboard/BreakEvenCard";
import { ProjectionTabs } from "@/components/dashboard/ProjectionTabs";
import { ServiceROIBreakdown } from "@/components/dashboard/ServiceROIBreakdown";
import { ConversionFunnelChart } from "@/components/dashboard/ConversionFunnelChart";
import { useConversionFunnel } from "@/hooks/useConversionFunnel";
import hiemsLogoSnowflake from '@/assets/hiems-logo-snowflake.png';

const DashboardAnalytics = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { data, loading } = useAnalyticsData(dateRange);
  const { metrics: businessMetrics } = useBusinessMetrics();
  const { metrics: funnelMetrics } = useConversionFunnel(dateRange || {
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date()
  });
  const { usage: aiUsage, isLoading: aiLoading } = useAIUsage(dateRange);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleExport = () => {
    if (!data) return;
    
    // Simple CSV export of daily data
    const csvData = [
      ['Datum', 'Bokningar', 'Intäkter (SEK)', 'Kostnader (SEK)', 'AI-kostnad (SEK)', 'OpenRouter-kostnad (SEK)', 'Vinst (SEK)', 'ROI (%)'],
      ...data.dailyData.map(d => {
        const dayAICost = aiUsage?.dailyCosts.find(ai => ai.date === d.date)?.cost || 0;
        return [
          d.date,
          d.bookings,
          d.revenue.toFixed(2),
          d.costs.toFixed(2),
          dayAICost.toFixed(2),
          dayAICost.toFixed(2), // All AI cost is from OpenRouter
          d.profit.toFixed(2),
          d.roi.toFixed(2)
        ];
      })
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

  const totalVariableCost = data.costs.telephonyCost + data.costs.smsCost + data.costs.emailCost + data.costs.aiCost;
  const costBreakdownData = [
    { 
      name: 'Telefoni', 
      value: data.costs.telephonyCost,
      percentage: totalVariableCost > 0 ? ((data.costs.telephonyCost / totalVariableCost) * 100).toFixed(1) : '0'
    },
    { 
      name: 'SMS', 
      value: data.costs.smsCost,
      percentage: totalVariableCost > 0 ? ((data.costs.smsCost / totalVariableCost) * 100).toFixed(1) : '0'
    },
    { 
      name: 'Email', 
      value: data.costs.emailCost,
      percentage: totalVariableCost > 0 ? ((data.costs.emailCost / totalVariableCost) * 100).toFixed(1) : '0'
    },
    { 
      name: 'AI (OpenRouter)', 
      value: data.costs.aiCost,
      percentage: totalVariableCost > 0 ? ((data.costs.aiCost / totalVariableCost) * 100).toFixed(1) : '0'
    }
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
        
        {/* Snowflakes */}
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] opacity-5 pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_60s_linear_infinite]" />
        </div>
        <div className="absolute -top-20 -left-20 w-[450px] h-[450px] opacity-[0.03] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_40s_linear_infinite_reverse]" />
        </div>
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[350px] h-[350px] opacity-[0.04] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_50s_linear_infinite]" />
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-block">
                <span className="text-sm font-semibold tracking-wider text-primary uppercase">Realtidsövervakning</span>
                <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50 mt-2" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
                Analytics & ROI
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                Realtidsövervakning av dina affärsresultat och ROI
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="relative py-8 border-y border-primary/10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={100}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 hover:scale-105 transition-transform duration-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-semibold text-green-600 uppercase tracking-wide">Live</span>
                </div>
                <Badge variant="outline">{data.bookings.length} bokningar denna period</Badge>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={handleRefresh} className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Uppdatera
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport} className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm" asChild className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                  <Link to="/dashboard/settings?tab=roi">
                    <Settings className="h-4 w-4 mr-2" />
                    ROI-inställningar
                  </Link>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Date Range Picker & Alert */}
      <section className="relative py-8">
        <div className="container mx-auto px-6 lg:px-8 space-y-4">
          <AnimatedSection delay={150}>
            <div className="bg-card p-4 rounded-lg border border-primary/10">
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
          </AnimatedSection>
        </div>
      </section>

      {/* ROI Stats Overview */}
      <section className="relative py-16 bg-gradient-to-b from-background via-primary/3 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,hsl(var(--primary)/0.12),transparent_50%)]" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection delay={200}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <PremiumTelephonyStatCard 
                title="Total Intäkt (Est.)" 
                value={`${data.roi.totalRevenue.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK`}
                icon={TrendingUp}
                color="text-blue-600"
                subtitle="+12% från föregående period"
              />
              <PremiumTelephonyStatCard 
                title="Driftkostnader" 
                value={`${data.costs.totalOperatingCost.toLocaleString('sv-SE', { maximumFractionDigits: 2 })} SEK`}
                icon={DollarSign}
                color="text-orange-600"
                subtitle="Inkl. alla tjänster"
              />
              <PremiumTelephonyStatCard 
                title="Nettovinst" 
                value={`${data.roi.netProfit.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK`}
                icon={Award}
                color="text-green-600"
                subtitle="+18% ökning"
              />
              <PremiumTelephonyStatCard 
                title="ROI" 
                value={`${data.roi.roi.toFixed(1)}%`}
                icon={Target}
                color="text-purple-600"
                subtitle="Avkastning på investering"
              />
            </div>


            {/* Booking Overview */}
            <div className="grid gap-6 md:grid-cols-3">
              <PremiumTelephonyStatCard 
                title="Totala Bokningar" 
                value={data.bookings.length}
                icon={Calendar}
                color="text-indigo-600"
                subtitle="Under vald period"
              />
              <PremiumTelephonyStatCard 
                title="Genomsnittligt Värde" 
                value={`${data.roi.revenuePerBooking.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK`}
                icon={DollarSign}
                color="text-amber-600"
                subtitle="Per bokning"
              />
              <PremiumTelephonyStatCard 
                title="Konverteringsgrad" 
                value={`${businessMetrics?.meeting_to_payment_probability || 50}%`}
                icon={TrendingUp}
                color="text-emerald-600"
                subtitle="Möte till betalning"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Cost Breakdown & Details */}
      <section className="relative py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={250}>
            <div className="space-y-6">
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
                    <strong className="block mt-1">AI-kostnader inkluderar alla OpenRouter-anrop och andra AI-providers.</strong>
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
              
              {/* Telephony */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Telefoni</span>
                </div>
                <span className="font-semibold">
                  {data.costs.telephonyCost.toLocaleString('sv-SE', { maximumFractionDigits: 2 })} SEK
                </span>
              </div>

              {/* SMS */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">SMS</span>
                </div>
                <span className="font-semibold">
                  {data.costs.smsCost.toLocaleString('sv-SE', { maximumFractionDigits: 2 })} SEK
                </span>
              </div>

              {/* Email */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Email</span>
                </div>
                <span className="font-semibold">
                  {data.costs.emailCost.toLocaleString('sv-SE', { maximumFractionDigits: 2 })} SEK
                </span>
              </div>

              {/* AI & Models (OpenRouter) - Main row */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-muted-foreground">AI & Modeller (OpenRouter)</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-5 px-2 text-xs"
                    asChild
                  >
                    <Link to="/dashboard/openrouter">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Detaljer
                    </Link>
                  </Button>
                </div>
                <span className="font-semibold">
                  {data.costs.aiCost.toLocaleString('sv-SE', { maximumFractionDigits: 2 })} SEK
                </span>
              </div>
              
              {/* OpenRouter Model Breakdown - Sub-section under AI */}
              {aiUsage && aiUsage.costByModel && aiUsage.costByModel.length > 0 && (
                <div className="ml-6 space-y-1 pt-1">
                  {aiUsage.costByModel
                    .filter(m => m.cost > 0)
                    .slice(0, 3)
                    .map(model => (
                      <div key={model.model} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1 h-1 rounded-full bg-purple-400" />
                          <span className="text-muted-foreground">{model.model}</span>
                        </div>
                        <span className="font-medium text-muted-foreground">
                          {model.cost.toLocaleString('sv-SE', { maximumFractionDigits: 2 })} SEK
                        </span>
                      </div>
                    ))}
                  {aiUsage.costByModel.length > 3 && (
                    <p className="text-xs text-muted-foreground italic">
                      +{aiUsage.costByModel.length - 3} fler modeller
                    </p>
                  )}
                </div>
              )}
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

      {/* OpenRouter AI Usage Section */}
      {aiUsage && aiUsage.totalCalls > 0 && (
        <PremiumCard>
          <PremiumCardHeader>
            <PremiumCardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                OpenRouter AI-användning
              </div>
              <Button 
                variant="outline" 
                size="sm"
                asChild
              >
                <Link to="/dashboard/openrouter">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Fullständig Dashboard
                </Link>
              </Button>
            </PremiumCardTitle>
          </PremiumCardHeader>
          <PremiumCardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <StatCard
                title="Total AI-kostnad"
                value={`${aiUsage.totalCostSEK.toLocaleString('sv-SE', { maximumFractionDigits: 2 })} SEK`}
                icon={DollarSign}
              />
              <StatCard
                title="Totala Anrop"
                value={aiUsage.totalCalls.toLocaleString('sv-SE')}
                icon={Activity}
              />
              <StatCard
                title="Tokens Använda"
                value={aiUsage.totalTokens.toLocaleString('sv-SE')}
                icon={TrendingUp}
              />
            </div>

            {/* Top 5 Models */}
            {aiUsage.costByModel && aiUsage.costByModel.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Top 5 AI-modeller (kostnad)</h4>
                {aiUsage.costByModel
                  .sort((a, b) => b.cost - a.cost)
                  .slice(0, 5)
                  .map((model, index) => (
                    <div 
                      key={model.model} 
                      className="flex items-center justify-between p-2 rounded bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <span className="text-sm font-medium">{model.model}</span>
                        <span className="text-xs text-muted-foreground">
                          ({model.calls} anrop)
                        </span>
                      </div>
                      <span className="text-sm font-semibold">
                        {model.cost.toLocaleString('sv-SE', { maximumFractionDigits: 2 })} SEK
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </PremiumCardContent>
        </PremiumCard>
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

      {/* Section 6.5: AI & Automation */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI & Automatisering
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total AI-kostnad"
            value={`${data.costs.aiCost.toFixed(2)} SEK`}
            icon={Sparkles}
          />
          <StatCard
            title="Antal AI-anrop"
            value={aiUsage?.totalCalls || 0}
            icon={TrendingUp}
          />
          <StatCard
            title="Mest använda modellen"
            value={aiUsage?.costByModel[0]?.model.split('/')[1] || 'N/A'}
            icon={Brain}
          />
          <StatCard
            title="Snitt kostnad/anrop"
            value={aiUsage?.totalCalls ? `${(aiUsage.totalCostSEK / aiUsage.totalCalls).toFixed(2)} SEK` : '0 SEK'}
            icon={DollarSign}
          />
        </div>
        
        {aiUsage && aiUsage.dailyCosts.length > 0 && (
          <LineChartComponent
            title="AI-kostnad över tid"
            data={aiUsage.dailyCosts.map(d => ({
              name: d.date,
              cost: d.cost
            }))}
            dataKeys={[
              { key: "cost", color: "hsl(280, 90%, 50%)", name: "Kostnad (SEK)" }
            ]}
            height={300}
          />
        )}
        
        <Button variant="outline" asChild>
          <Link to="/dashboard/integrations?tab=ai">
            <ExternalLink className="h-4 w-4 mr-2" />
            Se detaljerad AI-statistik
          </Link>
        </Button>
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
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default DashboardAnalytics;
