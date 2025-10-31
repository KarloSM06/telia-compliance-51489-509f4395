import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  RefreshCw, 
  Download, 
  Settings, 
  TrendingUp,
  DollarSign,
  Award,
  Target,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { useBusinessMetrics } from '@/hooks/useBusinessMetrics';
import { DateRangePicker, DateRange } from '@/components/dashboard/filters/DateRangePicker';
import { StatCard } from '@/components/communications/StatCard';
import { AreaChartComponent } from '@/components/dashboard/charts/AreaChartComponent';
import { LineChartComponent } from '@/components/dashboard/charts/LineChartComponent';
import { IntegrationROICard } from '@/components/dashboard/IntegrationROICard';
import { CumulativeProfitTimeline } from '@/components/dashboard/CumulativeProfitTimeline';
import { RecentActivityCompact } from '@/components/dashboard/RecentActivityCompact';
import { PremiumCard, PremiumCardContent, PremiumCardHeader, PremiumCardTitle } from '@/components/ui/premium-card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Phone, Smartphone, Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { data, loading } = useAnalyticsData(dateRange);
  const { metrics: businessMetrics } = useBusinessMetrics();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleExport = () => {
    if (!data) return;
    
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
    a.download = `dashboard-rapport-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Dashboard-rapport exporterad');
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

  const hasROISettings = businessMetrics && (
    (businessMetrics.service_pricing && businessMetrics.service_pricing.length > 0) ||
    businessMetrics.avg_project_cost
  );

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

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Din affärsöversikt och ROI-utveckling
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard/analytics">
              <TrendingUp className="h-4 w-4 mr-2" />
              Full Analytics
            </Link>
          </Button>
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
              Inställningar
            </Link>
          </Button>
        </div>
      </div>

      {/* DATE RANGE PICKER */}
      <div className="bg-card p-4 rounded-lg border">
        <p className="text-sm font-medium mb-3">Välj tidsperiod:</p>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* ROI SETTINGS ALERT */}
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

      {/* INTEGRATION ROI HERO CARD */}
      {data.cumulativeROI && (
        <IntegrationROICard data={data.cumulativeROI} />
      )}

      {/* ROI HERO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Intäkt (Est.)"
          value={`${data.roi.totalRevenue.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK`}
          icon={TrendingUp}
          trend={data.trends ? { 
            value: data.trends.revenueChange, 
            isPositive: data.trends.revenueChangeIsPositive 
          } : undefined}
        />
        <StatCard
          title="Driftkostnader"
          value={`${data.costs.totalOperatingCost.toLocaleString('sv-SE', { maximumFractionDigits: 2 })} SEK`}
          icon={DollarSign}
          trend={data.trends ? { 
            value: data.trends.costChange, 
            isPositive: data.trends.costChangeIsPositive 
          } : undefined}
        />
        <StatCard
          title="Nettovinst"
          value={`${data.roi.netProfit.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK`}
          icon={Award}
          trend={data.trends ? { 
            value: data.trends.profitChange, 
            isPositive: data.trends.profitChangeIsPositive 
          } : undefined}
        />
        <StatCard
          title="ROI"
          value={`${data.roi.roi.toFixed(1)}%`}
          icon={Target}
          trend={data.trends ? { 
            value: data.trends.roiChange, 
            isPositive: data.trends.roiChangeIsPositive 
          } : undefined}
        />
      </div>

      {/* CUMULATIVE PROFIT TIMELINE */}
      {data.cumulativeROI && (
        <CumulativeProfitTimeline data={data.cumulativeROI} />
      )}

      {/* KEY PERFORMANCE METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Totala Bokningar"
          value={data.bookings.length}
          icon={Calendar}
          trend={data.trends ? { 
            value: data.trends.bookingsChange, 
            isPositive: data.trends.bookingsChangeIsPositive 
          } : undefined}
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

      {/* TOP 2 CHARTS */}
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

      {/* COST BREAKDOWN CARD */}
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
                    Variabla kostnader baseras på faktisk användning. 
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

      {/* RECENT ACTIVITY */}
      <RecentActivityCompact 
        bookings={(data.bookings || []).slice(0, 5)}
        messages={(data.messages || []).slice(0, 5)}
        telephony={(data.telephony || []).slice(0, 5)}
        reviews={(data.reviews || []).slice(0, 5)}
      />
    </div>
  );
};

export default Dashboard;
