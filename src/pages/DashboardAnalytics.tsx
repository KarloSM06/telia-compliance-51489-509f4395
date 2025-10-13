import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AreaChartComponent } from "@/components/dashboard/charts/AreaChartComponent";
import { RadarChartComponent } from "@/components/dashboard/charts/RadarChartComponent";
import { BarChartComponent } from "@/components/dashboard/charts/BarChartComponent";
import { PieChartComponent } from "@/components/dashboard/charts/PieChartComponent";
import { LineChartComponent } from "@/components/dashboard/charts/LineChartComponent";
import { StatCard } from "@/components/dashboard/charts/StatCard";
import { DateRangePicker, DateRange } from "@/components/dashboard/filters/DateRangePicker";
import { ProductSelector, ProductType } from "@/components/dashboard/filters/ProductSelector";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/button";
import { Download, Phone, Calendar, MessageSquare, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardAnalytics = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedProduct, setSelectedProduct] = useState<ProductType>("all");
  const { data, loading, exportToCSV } = useAnalytics(dateRange);

  const handleExport = () => {
    exportToCSV(`hiems-analytics-${new Date().toISOString().split('T')[0]}`);
  };

  // Generate performance radar data based on product
  const getPerformanceData = () => {
    if (!data) return [];

    const baseMetrics = [
      { metric: "Response Time", value: 85, fullMark: 100 },
      { metric: "Conversion Rate", value: data.bookings.total > 0 ? 75 : 60, fullMark: 100 },
      { metric: "Customer Sat.", value: data.callAnalysis.averageScore || 70, fullMark: 100 },
      { metric: "Availability", value: 90, fullMark: 100 },
      { metric: "Quality Score", value: data.callAnalysis.averageScore || 80, fullMark: 100 },
      { metric: "Efficiency", value: 78, fullMark: 100 },
    ];

    return baseMetrics;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header with filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-card p-6 rounded-lg border">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Översikt av alla dina AI-produkter och statistik
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ProductSelector value={selectedProduct} onChange={setSelectedProduct} />
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportera CSV
            </Button>
          </div>
        </div>

        {/* Date range picker */}
        <div className="bg-card p-4 rounded-lg border">
          <p className="text-sm font-medium mb-3">Välj tidsperiod:</p>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Totala samtal"
            value={data?.calls.total || 0}
            change={12}
            changeLabel="vs förra perioden"
            trend="up"
            icon={<Phone className="h-5 w-5" />}
            sparklineData={data?.calls.byDay.slice(-7).map(d => ({ value: d.count })) || []}
          />
          <StatCard
            title="Bokningar"
            value={data?.bookings.total || 0}
            change={8}
            changeLabel="vs förra perioden"
            trend="up"
            icon={<Calendar className="h-5 w-5" />}
            sparklineData={data?.bookings.byDay.slice(-7).map(d => ({ value: d.count })) || []}
          />
          <StatCard
            title="Meddelanden"
            value={data?.messages.total || 0}
            change={5}
            changeLabel="vs förra perioden"
            trend="up"
            icon={<MessageSquare className="h-5 w-5" />}
            sparklineData={data?.messages.byDay.slice(-7).map(d => ({ value: d.count })) || []}
          />
          <StatCard
            title="Genomsnittligt betyg"
            value={data?.callAnalysis.averageScore?.toFixed(1) || "N/A"}
            change={3}
            changeLabel="vs förra perioden"
            trend="up"
            icon={<TrendingUp className="h-5 w-5" />}
          />
        </div>

        {/* Main Charts - 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Statistics Area Chart */}
          <AreaChartComponent
            title="Aktivitet över tid"
            data={data?.calls.byDay.map((day, index) => ({
              name: day.date,
              samtal: day.count,
              bokningar: data.bookings.byDay[index]?.count || 0,
              meddelanden: data.messages.byDay[index]?.count || 0,
            })) || []}
            dataKeys={[
              { key: "samtal", color: "hsl(43, 96%, 56%)", name: "Samtal" },
              { key: "bokningar", color: "hsl(142, 76%, 36%)", name: "Bokningar" },
              { key: "meddelanden", color: "hsl(217, 32%, 17%)", name: "Meddelanden" },
            ]}
            height={400}
          />

          {/* Right: Performance Radar Chart */}
          <RadarChartComponent
            title="Performance Metrics"
            data={getPerformanceData()}
            color="hsl(43, 96%, 56%)"
            height={400}
          />
        </div>

        {/* Secondary Charts - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Activity Line Chart */}
          <LineChartComponent
            title="Samtalstrend"
            data={data?.calls.byDay.slice(-14).map(d => ({
              name: d.date,
              count: d.count,
              duration: d.duration,
            })) || []}
            dataKeys={[
              { key: "count", color: "hsl(43, 96%, 56%)", name: "Antal samtal" },
              { key: "duration", color: "hsl(222, 47%, 18%)", name: "Total tid (min)" },
            ]}
          />

          {/* Expense/Revenue Bar Chart */}
          <BarChartComponent
            title="Veckovis fördelning"
            data={data?.bookings.byWeekday.map(d => ({
              name: d.day,
              count: d.count,
            })) || []}
            dataKeys={[
              { key: "count", color: "hsl(142, 76%, 36%)", name: "Bokningar" },
            ]}
            xAxisKey="day"
          />

          {/* Distribution Pie Chart */}
          <PieChartComponent
            title="Score-fördelning"
            data={data?.callAnalysis.scoreDistribution.filter(s => s.count > 0).map(s => ({
              name: s.range,
              value: s.count,
            })) || []}
            innerRadius={60}
          />
        </div>

        {/* Call Analysis Section - Thor specific */}
        {selectedProduct === "all" || selectedProduct === "thor" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChartComponent
              title="Samtalsanalys - Score Distribution"
              data={data?.callAnalysis.scoreDistribution.map(s => ({
                name: s.range,
                count: s.count,
              })) || []}
              dataKeys={[
                { key: "count", color: "hsl(38, 92%, 50%)", name: "Antal samtal" },
              ]}
              xAxisKey="name"
            />
            
            <div className="bg-card p-6 rounded-lg border space-y-4">
              <h3 className="text-lg font-semibold">Analysöversikt</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                  <span className="text-sm font-medium">Totalt analyserade samtal</span>
                  <span className="text-2xl font-bold">{data?.callAnalysis.totalAnalyzed || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                  <span className="text-sm font-medium">Genomsnittligt betyg</span>
                  <span className="text-2xl font-bold text-success">
                    {data?.callAnalysis.averageScore?.toFixed(1) || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                  <span className="text-sm font-medium">Compliance Rate</span>
                  <span className="text-2xl font-bold text-warning">
                    {data?.callAnalysis.totalAnalyzed > 0
                      ? Math.round((data.callAnalysis.averageScore / 100) * 100) + "%"
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
};

export default DashboardAnalytics;
