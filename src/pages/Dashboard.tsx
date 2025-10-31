import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, Settings, TrendingUp, DollarSign, Award, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { StatCard } from '@/components/communications/StatCard';
import { RecentActivityCompact } from '@/components/dashboard/RecentActivityCompact';
import { DateRangePicker, DateRange } from "@/components/dashboard/filters/DateRangePicker";

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
    <div className="p-6 space-y-6">
      {/* HEADER - Samma stil som andra sidor */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Din ROI-översikt och senaste affärshändelser
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
            Export ROI
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard/settings?tab=roi">
              <Settings className="h-4 w-4 mr-2" />
              ROI-inställningar
            </Link>
          </Button>
        </div>
      </div>

      {/* Date Range Picker - Samma som /analytics */}
      <div className="bg-card p-4 rounded-lg border">
        <p className="text-sm font-medium mb-3">Välj tidsperiod:</p>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* ROI ÖVERSIKT - Samma som /analytics */}
      {data && (
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
      )}

      {/* SENASTE HÄNDELSER - Kompakt vy */}
      {data && (
        <RecentActivityCompact 
          bookings={(data.bookings || []).slice(0, 5)}
          messages={(data.messages || []).slice(0, 5)}
          telephony={(data.telephony || []).slice(0, 5)}
          reviews={(data.reviews || []).slice(0, 5)}
        />
      )}
    </div>
  );
};

export default Dashboard;
