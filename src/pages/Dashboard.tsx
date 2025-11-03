import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Download, Settings, TrendingUp, DollarSign, Award, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { PremiumTelephonyStatCard } from '@/components/telephony/PremiumTelephonyStatCard';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { RecentActivityCompact } from '@/components/dashboard/RecentActivityCompact';
import { DateRangePicker, DateRange } from "@/components/dashboard/filters/DateRangePicker";
import { BreakEvenCard } from '@/components/dashboard/BreakEvenCard';
import { CumulativeROIChart } from '@/components/dashboard/CumulativeROIChart';
import { AIUsageCard } from '@/components/dashboard/AIUsageCard';
import hiemsLogoSnowflake from '@/assets/hiems-logo-snowflake.png';

const Dashboard = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const { data, loading } = useAnalyticsData(dateRange);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleExport = () => {
    if (!data) return;

    const csvContent = [
      ['Metric', 'Value'].join(','),
      ['Total Intäkt', `${data.roi.totalRevenue} SEK`].join(','),
      ['Driftkostnader', `${data.costs.totalOperatingCost} SEK`].join(','),
      ['AI-kostnad', `${data.costs.aiCost} SEK`].join(','),
      ['Total Kostnader (inkl. startup)', `${data.roi.totalCosts} SEK`].join(','),
      ['Nettovinst', `${data.roi.netProfit} SEK`].join(','),
      ['ROI', `${data.roi.roi.toFixed(1)}%`].join(','),
      ['Vinstmarginal', `${data.roi.profitMargin.toFixed(1)}%`].join(','),
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
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-block">
                <span className="text-sm font-semibold tracking-wider text-primary uppercase">Realtidsövervakning</span>
                <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50 mt-2" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
                Dashboard
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                Din ROI-översikt och senaste affärshändelser
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
                  <Badge variant="outline">{data.bookings.length} bokningar</Badge>
                )}
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" asChild className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                  <Link to="/dashboard/analytics">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Full Analytics
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleRefresh} className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Uppdatera
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport} className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                  <Download className="h-4 w-4 mr-2" />
                  Export ROI
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

      {/* Date Range Picker */}
      <section className="relative py-8">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={150}>
            <div className="bg-card p-4 rounded-lg border border-primary/10">
              <p className="text-sm font-medium mb-3">Välj tidsperiod:</p>
              <DateRangePicker value={dateRange} onChange={setDateRange} />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ROI Stats Overview */}
      <section className="relative py-16 bg-gradient-to-b from-background via-primary/3 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,hsl(var(--primary)/0.12),transparent_50%)]" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection delay={200}>
            {data && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* Charts & Data Sections */}
      <section className="relative py-12 bg-gradient-to-b from-background via-primary/2 to-background">
        <div className="container mx-auto px-6 lg:px-8 space-y-8">
          {/* AI USAGE OVERVIEW */}
          {data && (
            <AnimatedSection delay={300}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1">
                  <AIUsageCard />
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* BREAK-EVEN & PROJEKTION */}
          {data && (
            <AnimatedSection delay={350}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <BreakEvenCard breakEven={data.breakEven} />
                <CumulativeROIChart 
                  data={data.projection12.cumulativeData} 
                  breakEvenMonth={data.breakEven.breakEvenMonth}
                />
              </div>
            </AnimatedSection>
          )}

          {/* SENASTE HÄNDELSER - Kompakt vy */}
          {data && (
            <AnimatedSection delay={400}>
              <RecentActivityCompact 
                bookings={(data.bookings || []).slice(0, 5)}
                messages={(data.messages || []).slice(0, 5)}
                telephony={(data.telephony || []).slice(0, 5)}
                reviews={(data.reviews || []).slice(0, 5)}
              />
            </AnimatedSection>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
