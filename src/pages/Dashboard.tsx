import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAllActivities } from '@/hooks/useAllActivities';
import { useAnalyticsData } from '@/hooks/useAnalyticsData';
import { ROIHeroSection } from '@/components/dashboard/ROIHeroSection';
import { DashboardStatsCards } from '@/components/dashboard/DashboardStatsCards';
import { ActivityFilters, ActivityFilterValues } from '@/components/dashboard/ActivityFilters';
import { ActivityTable } from '@/components/dashboard/ActivityTable';
import type { Activity } from '@/hooks/useAllActivities';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState<ActivityFilterValues>({
    search: '',
    type: 'all',
    status: 'all',
  });

  // Hämta ROI data (senaste 7 dagarna)
  const dateFrom = useMemo(() => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), []);
  const dateTo = useMemo(() => new Date(), []);
  
  const { data: analyticsData, loading: analyticsLoading } = useAnalyticsData({
    from: dateFrom,
    to: dateTo
  });

  // Hämta all aktivitet
  const { data: activities, isLoading, refetch } = useAllActivities();

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities?.filter((activity: Activity) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          activity.title?.toLowerCase().includes(searchLower) ||
          activity.description?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      if (filters.type !== 'all' && activity.type !== filters.type) {
        return false;
      }

      if (filters.status !== 'all' && activity.status !== filters.status) {
        return false;
      }

      if (filters.dateFrom) {
        const activityDate = new Date(activity.timestamp);
        if (activityDate < filters.dateFrom) return false;
      }
      
      if (filters.dateTo) {
        const activityDate = new Date(activity.timestamp);
        const endOfDay = new Date(filters.dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        if (activityDate > endOfDay) return false;
      }

      return true;
    }) || [];
  }, [activities, filters]);

  const handleRefresh = async () => {
    toast.loading('Uppdaterar data...');
    await refetch();
    toast.dismiss();
    toast.success('Data uppdaterad');
  };

  const handleExport = () => {
    const csvContent = [
      ['Type', 'Titel', 'Beskrivning', 'Status', 'Timestamp'].join(','),
      ...filteredActivities.map((activity: Activity) =>
        [
          activity.typeLabel,
          `"${activity.title}"`,
          `"${activity.description}"`,
          activity.status,
          activity.timestamp,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-activities-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Export klar');
  };

  const handleActivityClick = (activity: Activity) => {
    // Navigera till specifik sida med state
    navigate(activity.targetPath, { 
      state: { 
        openItemId: activity.id,
        scrollToItem: true 
      } 
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Din centrala hub för all affärsaktivitet och ROI-övervakning
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/analytics')}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Full Analytics
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Uppdatera
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* ===== ROI HERO SECTION (HÖGST UPP!) ===== */}
      {analyticsLoading ? (
        <div className="flex items-center justify-center h-64 rounded-2xl border bg-muted/50">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ROIHeroSection data={analyticsData} />
      )}

      {/* ===== STATS CARDS ===== */}
      <DashboardStatsCards 
        bookings={analyticsData?.bookings || []}
        messages={analyticsData?.messages || []}
        telephony={analyticsData?.telephony || []}
        reviews={analyticsData?.reviews || []}
      />

      {/* ===== FILTERS ===== */}
      <ActivityFilters onFilterChange={setFilters} />

      {/* ===== ACTIVITY TABLE ===== */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Senaste Händelser</h2>
          <p className="text-sm text-muted-foreground">
            Visar {filteredActivities.length} av {activities?.length || 0} händelser
          </p>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12 rounded-lg border bg-card">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ActivityTable 
            activities={filteredActivities} 
            onViewDetails={handleActivityClick} 
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
