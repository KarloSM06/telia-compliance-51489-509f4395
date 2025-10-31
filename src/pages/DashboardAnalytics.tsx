import { useState } from "react";
import { AnalyticsLayout } from "@/components/analytics/AnalyticsLayout";
import { AnalyticsTabs } from "@/components/analytics/AnalyticsTabs";
import { OverviewAnalytics } from "@/pages/analytics/OverviewAnalytics";
import { DateRange } from "@/components/dashboard/filters/DateRangePicker";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";

const DashboardAnalytics = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [activeTab, setActiveTab] = useState("overview");
  const { data } = useAnalyticsData(dateRange);

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

  return (
    <AnalyticsLayout onExport={handleExport} onRefresh={handleRefresh}>
      <AnalyticsTabs value={activeTab} onValueChange={setActiveTab} />
      
      {activeTab === "overview" && (
        <OverviewAnalytics 
          dateRange={dateRange} 
          onDateRangeChange={setDateRange}
        />
      )}
      
      {activeTab === "revenue" && (
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Intäktsanalys</h2>
          <p className="text-muted-foreground">Kommer snart - fördjupad intäktsanalys och prognoser</p>
        </div>
      )}
      
      {activeTab === "customers" && (
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Kundanalys</h2>
          <p className="text-muted-foreground">Kommer snart - kundsegmentering och retention-analys</p>
        </div>
      )}
      
      {activeTab === "channels" && (
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Kanalanalys</h2>
          <p className="text-muted-foreground">Kommer snart - kanal-performance och optimering</p>
        </div>
      )}
      
      {activeTab === "telephony" && (
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Telefonianalys</h2>
          <p className="text-muted-foreground">Kommer snart - djupdykning i samtalsdata och conversation intelligence</p>
        </div>
      )}
      
      {activeTab === "predictive" && (
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Prediktiv AI</h2>
          <p className="text-muted-foreground">Kommer snart - AI-drivna insikter och rekommendationer</p>
        </div>
      )}
    </AnalyticsLayout>
  );
};

export default DashboardAnalytics;
