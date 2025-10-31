import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, Settings, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { ROIHeroSection } from '@/components/dashboard/ROIHeroSection';
import { RecentActivityCompact } from '@/components/dashboard/RecentActivityCompact';

const Dashboard = () => {
  const { user } = useAuth();
  const [dateRange] = useState({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date()
  });

  const { data, loading } = useAnalyticsData(dateRange);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleExport = () => {
    if (!data) return;

    const csvContent = [
      ['Metric', 'Value'].join(','),
      ['Total Intäkt', `${data.roi.totalRevenue} SEK`].join(','),
      ['Operationella Kostnader', `${data.roi.totalCosts} SEK`].join(','),
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

      {/* ROI HERO SECTION - MAIN FOKUS */}
      {data && <ROIHeroSection data={data} />}

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
