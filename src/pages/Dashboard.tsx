import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Download, Settings, TrendingUp, DollarSign, Award, Target, Phone, MessageSquare, Mail, Brain, CheckCircle, ArrowRight, TrendingDown, Activity, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { useAuth } from '@/hooks/useAuth';
import { useBusinessMetrics } from '@/hooks/useBusinessMetrics';
import { useOpenRouterActivitySEK } from '@/hooks/useOpenRouterActivitySEK';
import { useSyncOpenRouterActivity } from '@/hooks/useSyncOpenRouterActivity';
import { useSyncOpenRouterAccount } from '@/hooks/useSyncOpenRouterAccount';
import { useOpenRouterKeys } from '@/hooks/useOpenRouterKeys';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { PremiumTelephonyStatCard } from '@/components/telephony/PremiumTelephonyStatCard';
import { EnhancedStatCard } from '@/components/dashboard/EnhancedStatCard';
import { AreaChartStatCard } from '@/components/dashboard/AreaChartStatCard';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { RecentActivityCompact } from '@/components/dashboard/RecentActivityCompact';
import { DateRangePicker } from "@/components/dashboard/filters/DateRangePicker";
import { BreakEvenCard } from '@/components/dashboard/BreakEvenCard';
import { RevenueVsCostsChart } from '@/components/dashboard/charts/RevenueVsCostsChart';
import { CostBreakdownChart } from '@/components/dashboard/charts/CostBreakdownChart';
import { ROITrendChart } from '@/components/dashboard/charts/ROITrendChart';
import { BookingTrendChart } from '@/components/dashboard/charts/BookingTrendChart';
import { ProfitMarginChart } from '@/components/dashboard/charts/ProfitMarginChart';
import { ServiceRevenueChart } from '@/components/dashboard/charts/ServiceRevenueChart';
import { CumulativeRevenueChart } from '@/components/dashboard/charts/CumulativeRevenueChart';
import { DailyROIChart } from '@/components/dashboard/charts/DailyROIChart';
import { CompactProjectionChart } from '@/components/dashboard/charts/CompactProjectionChart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import hiemsLogoSnowflake from '@/assets/hiems-logo-snowflake.png';
import { format } from 'date-fns';
import { USD_TO_SEK } from '@/lib/constants';
import { useDateRangeStore } from '@/stores/useDateRangeStore';
import { calculateAICost } from '@/lib/aiCostCalculator';

const COLORS = ['hsl(217, 91%, 60%)', 'hsl(271, 70%, 60%)', 'hsl(189, 94%, 43%)', 'hsl(330, 81%, 60%)', 'hsl(142, 76%, 36%)'];

const Dashboard = () => {
  const { user } = useAuth();
  const { metrics: businessMetrics } = useBusinessMetrics();
  const { dateRange, setDateRange } = useDateRangeStore();
  const { data: openrouterData } = useOpenRouterActivitySEK(dateRange, true);
  const { data: keysStatus } = useOpenRouterKeys();
  const syncActivity = useSyncOpenRouterActivity();
  const syncAccount = useSyncOpenRouterAccount();

  const { data, loading } = useAnalyticsData(dateRange);

  // Auto-sync OpenRouter data when Dashboard mounts
  useEffect(() => {
    const provisioningKeyExists = keysStatus?.provisioning_key_exists;
    
    if (!provisioningKeyExists) return;

    // Silent background sync - calculate date range for last 30 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    // Sync activity data (for costs)
    syncActivity.mutate(
      { 
        start_date: formatDate(startDate), 
        end_date: formatDate(endDate) 
      },
      {
        onSuccess: () => {
          console.log('OpenRouter activity synced successfully in background');
        },
        onError: (error) => {
          console.error('Background sync failed:', error);
        }
      }
    );

    // Sync account data (for balance)
    syncAccount.mutate(undefined, {
      onSuccess: () => {
        console.log('OpenRouter account synced successfully in background');
      },
      onError: (error) => {
        console.error('Background account sync failed:', error);
      }
    });
  }, [keysStatus?.provisioning_key_exists]); // Only re-run if key status changes

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleExport = () => {
    if (!data) return;
    
    // Map OpenRouter costs per day from actual API data
    const openrouterDailyMap = new Map<string, number>();
    openrouterData?.activity?.forEach(item => {
      const day = item.date;
      if (!openrouterDailyMap.has(day)) {
        openrouterDailyMap.set(day, 0);
      }
      openrouterDailyMap.set(day, openrouterDailyMap.get(day)! + item.usage);
    });

    const csvContent = [
      ['Datum', 'Bokningar', 'Intäkter (SEK)', 'Kostnader (SEK)', 'Telefoni (SEK)', 'SMS (SEK)', 'Email (SEK)', 'AI (SEK)', 'Hiems (SEK)', 'Vinst (SEK)', 'ROI (%)'].join(','),
      ...data.dailyData.map(d => {
        const dayTelephony = data.telephony
          .filter(t => t.provider === 'vapi')
          .filter(t => format(new Date(t.event_timestamp), 'yyyy-MM-dd') === d.date);
        const telephonyCost = dayTelephony.reduce((sum, t) => sum + ((parseFloat(t.aggregate_cost_amount) || 0) * USD_TO_SEK), 0);
        
        const dayMessages = data.messages.filter(m => format(new Date(m.created_at), 'yyyy-MM-dd') === d.date);
        const smsCost = dayMessages.filter(m => m.message_type === 'sms').reduce((sum, m) => sum + ((m.metadata as any)?.cost_sek || 0), 0);
        const emailCost = dayMessages.filter(m => m.message_type === 'email').reduce((sum, m) => sum + ((m.metadata as any)?.cost_sek || 0), 0);
        
        // Use actual OpenRouter cost from API (already in SEK)
        const openrouterDailyCost = openrouterDailyMap.get(d.date) || 0;
        const aiCost = openrouterDailyCost;
        
        const dailyHiems = (businessMetrics?.hiems_monthly_support_cost || 0) / 30;

        return [
          d.date,
          d.bookings,
          d.revenue.toFixed(2),
          d.costs.toFixed(2),
          telephonyCost.toFixed(2),
          smsCost.toFixed(2),
          emailCost.toFixed(2),
          aiCost.toFixed(2),
          dailyHiems.toFixed(2),
          d.profit.toFixed(2),
          d.roi.toFixed(2)
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roi-rapport-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('ROI-rapport exporterad');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Laddar dashboard...</p>
        </div>
      </div>
    );
  }


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
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <div className="inline-block">
                <span className="text-sm font-semibold tracking-wider text-primary uppercase">Realtidsövervakning</span>
                <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50 mt-2" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
                Din AI-Assistent: ROI-översikt
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                Fullständig överblick över intäkter, kostnader och lönsamhet med AI-driven analys
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
                {data && (
                  <>
                    <Badge variant="outline">{data.bookings.length} bokningar</Badge>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                      {data.roi.netProfit.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK vinst
                    </Badge>
                  </>
                )}
              </div>
              
              <div className="flex gap-2 flex-wrap items-center">
                <DateRangePicker value={dateRange} onChange={setDateRange} />
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
                    Inställningar
                  </Link>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* KPI Stats Overview */}
      <section className="relative py-16 bg-gradient-to-b from-background via-primary/3 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,hsl(var(--primary)/0.12),transparent_50%)]" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection delay={200}>
            {data && (() => {
              // Prepare sparkline data for all cards
              const revenueChartData = data.dailyData.slice(-15).map(d => ({ value: d.revenue }));
              const costChartData = data.dailyData.slice(-15).map(d => ({ value: d.costs }));
              const profitChartData = data.dailyData.slice(-15).map(d => ({ value: d.profit }));
              const roiChartData = data.dailyData.slice(-15).map(d => ({ 
                value: d.costs > 0 ? ((d.revenue - d.costs) / d.costs) * 100 : 0 
              }));
              
              // Average order value - rolling average
              const avgOrderValueData = data.dailyData.slice(-15).map((d, idx) => {
                const relevantDays = data.dailyData.slice(Math.max(0, idx - 7), idx + 1);
                const totalRev = relevantDays.reduce((sum, day) => sum + day.revenue, 0);
                const totalBookings = relevantDays.reduce((sum, day) => sum + day.bookings, 0);
                return { value: totalBookings > 0 ? totalRev / totalBookings : 0 };
              });
              
              // Cost per booking trend
              const costPerBookingData = data.dailyData.slice(-15).map(d => ({
                value: d.bookings > 0 ? d.costs / d.bookings : 0
              }));
              
              // Break-even - cumulative profit
              const breakEvenData = (() => {
                let cumulative = 0;
                return data.dailyData.slice(-15).map(d => {
                  cumulative += d.profit;
                  return { value: cumulative };
                });
              })();
              
              // Active bookings - daily bookings
              const activeBookingsData = data.dailyData.slice(-15).map(d => ({ value: d.bookings }));

              return (
                <div className="space-y-8">
                  {/* Primary KPIs */}
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                      Primära Finansiella KPIs
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      <AreaChartStatCard
                        title="Total Intäkt"
                        value={`${data.roi.totalRevenue.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK`}
                        period="Senaste 15 dagarna"
                        icon={DollarSign}
                        chartData={revenueChartData}
                        color="hsl(142, 76%, 36%)"
                        gradientId="revenueGradient"
                        formatValue={(val) => `${(val / 1000).toFixed(1)}k SEK`}
                        trend={{ value: 12.5, isPositive: true }}
                      />
                      
                      <AreaChartStatCard
                        title="Total Kostnad"
                        value={`${data.roi.totalCosts.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK`}
                        period="Senaste 15 dagarna"
                        icon={TrendingDown}
                        chartData={costChartData}
                        color="hsl(0, 70%, 50%)"
                        gradientId="costGradient"
                        formatValue={(val) => `${(val / 1000).toFixed(1)}k SEK`}
                        trend={{ value: 5.2, isPositive: false }}
                      />
                      
                      <AreaChartStatCard
                        title="Nettovinst"
                        value={`${data.roi.netProfit.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK`}
                        period="Senaste 15 dagarna"
                        icon={Award}
                        chartData={profitChartData}
                        color="hsl(158, 64%, 52%)"
                        gradientId="profitGradient"
                        formatValue={(val) => `${(val / 1000).toFixed(1)}k SEK`}
                        trend={{ value: 18.7, isPositive: data.roi.netProfit > 0 }}
                      />
                      
                      <AreaChartStatCard
                        title="ROI"
                        value={`${data.roi.roi.toFixed(1)}%`}
                        period="Senaste 15 dagarna"
                        icon={Target}
                        chartData={roiChartData}
                        color="hsl(134, 61%, 41%)"
                        gradientId="roiGradient"
                        formatValue={(val) => `${val.toFixed(1)}%`}
                        trend={{ value: 8.3, isPositive: data.roi.roi > 0 }}
                      />
                    </div>
                  </div>

                  {/* Secondary Metrics */}
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                      Prestanda & Effektivitet
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      <AreaChartStatCard
                        title="Genomsnittligt Ordervärde"
                        value={`${(data.bookings.length > 0 ? data.roi.totalRevenue / data.bookings.length : 0).toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK`}
                        period="Senaste 15 dagarna"
                        icon={TrendingUp}
                        chartData={avgOrderValueData}
                        color="hsl(145, 63%, 42%)"
                        gradientId="avgOrderGradient"
                        formatValue={(val) => `${(val / 1000).toFixed(1)}k SEK`}
                        trend={{ value: 6.4, isPositive: true }}
                      />
                      
                      <AreaChartStatCard
                        title="Kostnad per Bokning"
                        value={`${(data.bookings.length > 0 ? data.roi.totalCosts / data.bookings.length : 0).toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK`}
                        period="Senaste 15 dagarna"
                        icon={Activity}
                        chartData={costPerBookingData}
                        color="hsl(168, 76%, 42%)"
                        gradientId="costPerBookingGradient"
                        formatValue={(val) => `${val.toFixed(0)} SEK`}
                        trend={{ value: 3.2, isPositive: false }}
                      />
                      
                      <AreaChartStatCard
                        title="Break-even Status"
                        value={data.breakEven.isBreakEvenReached ? "Uppnått" : `Månad ${data.breakEven.breakEvenMonth || '∞'}`}
                        period="Kumulativ vinst"
                        icon={CheckCircle}
                        chartData={breakEvenData}
                        color={data.breakEven.isBreakEvenReached ? "hsl(142, 71%, 45%)" : "hsl(152, 69%, 31%)"}
                        gradientId="breakEvenGradient"
                        formatValue={(val) => `${(val / 1000).toFixed(1)}k SEK`}
                      />
                      
                      <AreaChartStatCard
                        title="Aktiva Bokningar"
                        value={data.bookings.length}
                        period="Senaste 15 dagarna"
                        icon={Users}
                        chartData={activeBookingsData}
                        color="hsl(140, 60%, 45%)"
                        gradientId="bookingsGradient"
                        formatValue={(val) => `${val} bokningar`}
                        trend={{ value: 15.8, isPositive: true }}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}
          </AnimatedSection>
        </div>
      </section>

      {/* Main Charts Section */}
      <section className="relative py-12 bg-gradient-to-b from-background via-primary/2 to-background">
        <div className="container mx-auto px-6 lg:px-8 space-y-6">
          {data && (
            <>
              <AnimatedSection delay={300}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <RevenueVsCostsChart data={data.dailyData} isLoading={loading} />
                  <ROITrendChart data={data.dailyData} isLoading={loading} />
                  <BookingTrendChart data={data.dailyData} isLoading={loading} />
                  <ProfitMarginChart data={data.dailyData} isLoading={loading} />
                  <CostBreakdownChart 
                    dailyData={data.dailyData}
                    telephonyData={data.telephony}
                    messagesData={data.messages}
                    aiUsageData={[]}
                    hiemsMonthlyCost={businessMetrics?.hiems_monthly_support_cost || 0}
                    isLoading={loading}
                  />
                  <ServiceRevenueChart data={data.serviceMetrics} isLoading={loading} />
                  <CumulativeRevenueChart data={data.dailyData} isLoading={loading} />
                  <DailyROIChart data={data.dailyData} isLoading={loading} />
                  <CompactProjectionChart 
                    projection12={data.projection12}
                    projection24={data.projection24}
                    projection36={data.projection36}
                    isLoading={loading}
                  />
                </div>
              </AnimatedSection>

              {/* Financial Breakdown Detail */}
              <AnimatedSection delay={400}>
                <Card>
                  <CardHeader>
                    <CardTitle>Detaljerad Kostnadsfördelning</CardTitle>
                    <p className="text-sm text-muted-foreground">Översikt över alla kostnader i vald period</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          Rörliga Kostnader
                        </h4>
                        <div className="grid gap-3">
                          <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                            <div className="flex items-center gap-3">
                              <Phone className="h-5 w-5 text-green-600" />
                              <span>Telefoni</span>
                            </div>
                            <span className="font-semibold">{data.costs.telephonyCost.toFixed(2)} SEK</span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                            <div className="flex items-center gap-3">
                              <MessageSquare className="h-5 w-5 text-green-600" />
                              <span>SMS</span>
                            </div>
                            <span className="font-semibold">{data.costs.smsCost.toFixed(2)} SEK</span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                            <div className="flex items-center gap-3">
                              <Mail className="h-5 w-5 text-green-600" />
                              <span>Email</span>
                            </div>
                            <span className="font-semibold">{data.costs.emailCost.toFixed(2)} SEK</span>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                            <div className="flex items-center gap-3">
                              <Brain className="h-5 w-5 text-green-600" />
                              <span>AI & Modeller (OpenRouter)</span>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{data.costs.aiCost.toFixed(2)} SEK</p>
                              <Link to="/dashboard/openrouter" className="text-xs text-primary hover:underline flex items-center gap-1">
                                Se alla modeller <ArrowRight className="h-3 w-3" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          Driftkostnad
                        </h4>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span>Hiems Plattform</span>
                          </div>
                          <span className="font-semibold">{businessMetrics?.hiems_monthly_support_cost.toFixed(2)} SEK</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
                          <span className="font-bold text-lg">Total Kostnad</span>
                          <span className="font-bold text-2xl text-primary">{data.roi.totalCosts.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Break-Even */}
              <AnimatedSection delay={450}>
                <BreakEvenCard breakEven={data.breakEven} />
              </AnimatedSection>

              {/* Recent Activity */}
              <AnimatedSection delay={550}>
                <RecentActivityCompact 
                  bookings={(data.bookings || []).slice(0, 10)}
                  messages={(data.messages || []).slice(0, 10)}
                  telephony={(data.telephony || []).slice(0, 10)}
                  reviews={(data.reviews || []).slice(0, 10)}
                />
              </AnimatedSection>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
