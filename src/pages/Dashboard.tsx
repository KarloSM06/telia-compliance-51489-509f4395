import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Download, Settings, TrendingUp, DollarSign, Award, Target, Phone, MessageSquare, Mail, Brain, CheckCircle, ArrowRight, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { useAuth } from '@/hooks/useAuth';
import { useBusinessMetrics } from '@/hooks/useBusinessMetrics';
import { toast } from 'sonner';
import { PremiumTelephonyStatCard } from '@/components/telephony/PremiumTelephonyStatCard';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { RecentActivityCompact } from '@/components/dashboard/RecentActivityCompact';
import { DateRangePicker, DateRange } from "@/components/dashboard/filters/DateRangePicker";
import { BreakEvenCard } from '@/components/dashboard/BreakEvenCard';
import { ProjectionTabs } from '@/components/dashboard/ProjectionTabs';
import { RevenueVsCostsChart } from '@/components/dashboard/charts/RevenueVsCostsChart';
import { CostBreakdownChart } from '@/components/dashboard/charts/CostBreakdownChart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import hiemsLogoSnowflake from '@/assets/hiems-logo-snowflake.png';
import { format } from 'date-fns';

const COLORS = ['hsl(217, 91%, 60%)', 'hsl(271, 70%, 60%)', 'hsl(189, 94%, 43%)', 'hsl(330, 81%, 60%)', 'hsl(142, 76%, 36%)'];

const Dashboard = () => {
  const { user } = useAuth();
  const { metrics: businessMetrics } = useBusinessMetrics();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const { data, loading } = useAnalyticsData(dateRange);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleExport = () => {
    if (!data) return;

    const csvContent = [
      ['Datum', 'Bokningar', 'Intäkter (SEK)', 'Kostnader (SEK)', 'Telefoni (SEK)', 'SMS (SEK)', 'Email (SEK)', 'AI (SEK)', 'Hiems (SEK)', 'Vinst (SEK)', 'ROI (%)'].join(','),
      ...data.dailyData.map(d => {
        const dayTelephony = data.telephony.filter(t => format(new Date(t.event_timestamp), 'yyyy-MM-dd') === d.date);
        const telephonyCost = dayTelephony.reduce((sum, t) => sum + (t.aggregate_cost_amount || 0), 0);
        
        const dayMessages = data.messages.filter(m => format(new Date(m.created_at), 'yyyy-MM-dd') === d.date);
        const smsCost = dayMessages.filter(m => m.message_type === 'sms').reduce((sum, m) => sum + ((m.metadata as any)?.cost_sek || 0), 0);
        const emailCost = dayMessages.filter(m => m.message_type === 'email').reduce((sum, m) => sum + ((m.metadata as any)?.cost_sek || 0), 0);
        
        const dailyHiems = (businessMetrics?.hiems_monthly_support_cost || 0) / 30;
        const aiCost = d.costs - telephonyCost - smsCost - emailCost - dailyHiems;

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
            <div className="max-w-4xl mx-auto text-center space-y-6">
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
            {data && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <PremiumTelephonyStatCard 
                  title="Total Intäkt" 
                  value={`${data.roi.totalRevenue.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK`}
                  icon={DollarSign}
                  color="text-green-600"
                  subtitle={`Från ${data.bookings.length} bokningar`}
                />
                <PremiumTelephonyStatCard 
                  title="Total Kostnad" 
                  value={`${data.roi.totalCosts.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK`}
                  icon={TrendingDown}
                  color="text-red-600"
                  subtitle="Alla driftkostnader"
                />
                <PremiumTelephonyStatCard 
                  title="Nettovinst" 
                  value={`${data.roi.netProfit.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK`}
                  icon={Award}
                  color="text-yellow-600"
                  subtitle={`${data.roi.profitMargin.toFixed(1)}% marginal`}
                />
                <PremiumTelephonyStatCard 
                  title="ROI" 
                  value={`${data.roi.roi.toFixed(1)}%`}
                  icon={Target}
                  color="text-blue-600"
                  subtitle="Avkastning på investering"
                />
              </div>
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* Main Charts Section */}
      <section className="relative py-12 bg-gradient-to-b from-background via-primary/2 to-background">
        <div className="container mx-auto px-6 lg:px-8 space-y-8">
          {/* Revenue vs Costs - Full Width */}
          {data && (
            <AnimatedSection delay={300}>
              <RevenueVsCostsChart data={data.dailyData} isLoading={loading} />
            </AnimatedSection>
          )}

          {/* Cost Breakdown & Revenue Sources - 2 Columns */}
          {data && (
            <AnimatedSection delay={350}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CostBreakdownChart 
                  dailyData={data.dailyData}
                  telephonyData={data.telephony}
                  messagesData={data.messages}
                  aiUsageData={[]}
                  hiemsMonthlyCost={businessMetrics?.hiems_monthly_support_cost || 0}
                  isLoading={loading}
                />
                
                {/* Revenue Sources Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Intäktskällor</CardTitle>
                    <p className="text-sm text-muted-foreground">Fördelning per tjänstekategori</p>
                  </CardHeader>
                  <CardContent>
                    {data.serviceMetrics && data.serviceMetrics.length > 0 ? (
                      <>
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={data.serviceMetrics}
                              dataKey="revenue"
                              nameKey="serviceName"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label={(entry) => `${entry.serviceName}: ${entry.revenue.toFixed(0)} kr`}
                            >
                              {data.serviceMetrics.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `${value.toFixed(2)} SEK`} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-6 space-y-2">
                          {data.serviceMetrics.map((service, index) => (
                            <div key={service.serviceName} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                              <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <span className="font-medium">{service.serviceName}</span>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{service.revenue.toFixed(0)} SEK</p>
                                <p className="text-xs text-muted-foreground">{service.bookingCount} bokningar • {service.roi.toFixed(1)}% ROI</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-64">
                        <p className="text-muted-foreground">Ingen data tillgänglig</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </AnimatedSection>
          )}

          {/* Financial Breakdown Detail */}
          {data && businessMetrics && (
            <AnimatedSection delay={400}>
              <Card>
                <CardHeader>
                  <CardTitle>Detaljerad Kostnadsfördelning</CardTitle>
                  <p className="text-sm text-muted-foreground">Översikt över alla kostnader i vald period</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Variable Costs */}
                    <div>
                      <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        Rörliga Kostnader
                      </h4>
                      <div className="grid gap-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
                          <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 text-blue-600" />
                            <span>Telefoni</span>
                          </div>
                          <span className="font-semibold">{data.costs.telephonyCost.toFixed(2)} SEK</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
                          <div className="flex items-center gap-3">
                            <MessageSquare className="h-5 w-5 text-purple-600" />
                            <span>SMS</span>
                          </div>
                          <span className="font-semibold">{data.costs.smsCost.toFixed(2)} SEK</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
                          <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-cyan-600" />
                            <span>Email</span>
                          </div>
                          <span className="font-semibold">{data.costs.emailCost.toFixed(2)} SEK</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-pink-500/5 border border-pink-500/10">
                          <div className="flex items-center gap-3">
                            <Brain className="h-5 w-5 text-pink-600" />
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

                    {/* Fixed Costs */}
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
                        <span className="font-semibold">{businessMetrics.hiems_monthly_support_cost.toFixed(2)} SEK</span>
                      </div>
                    </div>

                    {/* Total */}
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
          )}

          {/* Break-Even & Projections */}
          {data && (
            <AnimatedSection delay={450}>
              <div className="space-y-6">
                <BreakEvenCard breakEven={data.breakEven} />
                <ProjectionTabs 
                  projection12={data.projection12}
                  projection24={data.projection24}
                  projection36={data.projection36}
                />
              </div>
            </AnimatedSection>
          )}


          {/* Recent Activity */}
          {data && (
            <AnimatedSection delay={550}>
              <RecentActivityCompact 
                bookings={(data.bookings || []).slice(0, 10)}
                messages={(data.messages || []).slice(0, 10)}
                telephony={(data.telephony || []).slice(0, 10)}
                reviews={(data.reviews || []).slice(0, 10)}
              />
            </AnimatedSection>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
