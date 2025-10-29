import { useState } from "react";

import { AreaChartComponent } from "@/components/dashboard/charts/AreaChartComponent";
import { RadarChartComponent } from "@/components/dashboard/charts/RadarChartComponent";
import { BarChartComponent } from "@/components/dashboard/charts/BarChartComponent";
import { PieChartComponent } from "@/components/dashboard/charts/PieChartComponent";
import { LineChartComponent } from "@/components/dashboard/charts/LineChartComponent";
import { StatCard } from "@/components/dashboard/charts/StatCard";
import { ObjectiveCard } from "@/components/dashboard/charts/ObjectiveCard";
import { DateRangePicker, DateRange } from "@/components/dashboard/filters/DateRangePicker";
import { ProductSelector, ProductType } from "@/components/dashboard/filters/ProductSelector";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/button";
import { Download, Phone, Calendar, MessageSquare, TrendingUp, Target, Award, Users, Clock, DollarSign, Smartphone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TelephonyDebugPanel } from "@/components/telephony/TelephonyDebugPanel";

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
    );
  }

  return (
    
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

        {/* Objective Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ObjectiveCard
            title="Månatlig svarsgrad"
            current={data?.calls.total || 0}
            target={1500}
            unit=" svar"
            icon={Phone}
            color="hsl(142, 76%, 36%)"
          />
          <ObjectiveCard
            title="Bokningskonvertering"
            current={data?.bookings.total || 0}
            target={5000}
            unit=" bokningar"
            icon={Target}
            color="hsl(43, 96%, 56%)"
          />
          <ObjectiveCard
            title="AI Kvalitetsbetyg"
            current={Math.round(data?.callAnalysis.averageScore || 0)}
            target={90}
            unit="/100"
            icon={Award}
            color="hsl(38, 92%, 50%)"
          />
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

        {/* Telephony Stats */}
        {data?.telephony && data.telephony.totalCalls > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Telefonisamtal (Twilio/Telnyx/VAPI/Retell)"
              value={data.telephony.totalCalls}
              change={15}
              changeLabel="vs förra perioden"
              trend="up"
              icon={<Phone className="h-5 w-5" />}
              sparklineData={data.telephony.byDay.slice(-7).map(d => ({ value: d.calls })) || []}
            />
            <StatCard
              title="SMS/MMS Skickade"
              value={data.telephony.totalSMS}
              change={8}
              changeLabel="vs förra perioden"
              trend="up"
              icon={<Smartphone className="h-5 w-5" />}
              sparklineData={data.telephony.byDay.slice(-7).map(d => ({ value: d.sms })) || []}
            />
            <StatCard
              title="Telefonikostnad"
              value={`${data.telephony.totalCost.toFixed(2)} SEK`}
              change={-5}
              changeLabel="vs förra perioden"
              trend="down"
              icon={<DollarSign className="h-5 w-5" />}
            />
            <StatCard
              title="Total samtalstid"
              value={`${Math.round(data.telephony.totalDuration / 60)} min`}
              change={12}
              changeLabel="vs förra perioden"
              trend="up"
              icon={<Clock className="h-5 w-5" />}
            />
          </div>
        )}

        {/* Large Trend Analysis Charts - 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Multi-metric Area Chart */}
          <AreaChartComponent
            title="Aktivitet över tid - Översikt"
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
            title="Performance Metrics - 360° Översikt"
            data={getPerformanceData()}
            color="hsl(43, 96%, 56%)"
            height={400}
          />
        </div>

        {/* Detailed Distribution & Comparison - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Activity Line Chart */}
          <LineChartComponent
            title="14-dagars Samtalstrend"
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

          {/* Weekly Distribution Bar Chart */}
          <BarChartComponent
            title="Veckofördelning - Bokningar"
            data={data?.bookings.byWeekday.map(d => ({
              name: d.day,
              count: d.count,
            })) || []}
            dataKeys={[
              { key: "count", color: "hsl(142, 76%, 36%)", name: "Bokningar" },
            ]}
            xAxisKey="name"
          />

          {/* Score Distribution Pie Chart */}
          <PieChartComponent
            title="Betygsfördelning"
            data={data?.callAnalysis.scoreDistribution.filter(s => s.count > 0).map(s => ({
              name: s.range,
              value: s.count,
            })) || []}
            innerRadius={50}
          />
        </div>

        {/* Telephony Provider Breakdown */}
        {data?.telephony && data.telephony.byProvider.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Telefonileverantörer - Översikt</h2>
            </div>
            <BarChartComponent
              title="Samtal & SMS per Leverantör"
              data={data.telephony.byProvider.map(p => ({
                name: p.provider.toUpperCase(),
                Samtal: p.calls,
                SMS: p.sms,
                Kostnad: p.cost,
              })) || []}
              dataKeys={[
                { key: "Samtal", color: "hsl(43, 96%, 56%)", name: "Samtal" },
                { key: "SMS", color: "hsl(142, 76%, 36%)", name: "SMS" },
              ]}
              xAxisKey="name"
              height={350}
            />
          </div>
        )}

        {/* Telephony Debug Panel */}
        {data?.telephony && data.telephony.totalEvents > 0 && (
          <TelephonyDebugPanel />
        )}

        {/* Product Deep Dive - Thor/Krono/Gastro Specific - 2 columns */}
        {selectedProduct === "all" || selectedProduct === "thor" ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Thor - AI Samtalsanalys</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BarChartComponent
                title="Score Distribution - Detaljerad Översikt"
                data={data?.callAnalysis.scoreDistribution.map(s => ({
                  name: s.range,
                  count: s.count,
                })) || []}
                dataKeys={[
                  { key: "count", color: "hsl(38, 92%, 50%)", name: "Antal samtal" },
                ]}
                xAxisKey="name"
                height={350}
              />
              
              <div className="bg-gradient-to-br from-card to-muted/20 p-8 rounded-xl border shadow-lg space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Kvalitetsöversikt</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-card rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Totalt analyserade samtal</span>
                    </div>
                    <span className="text-3xl font-bold text-primary">{data?.callAnalysis.totalAnalyzed || 0}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-card rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Genomsnittligt betyg</span>
                    </div>
                    <span className="text-3xl font-bold text-success">
                      {data?.callAnalysis.averageScore?.toFixed(1) || "N/A"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-card rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Compliance Rate</span>
                    </div>
                    <span className="text-3xl font-bold text-warning">
                      {data?.callAnalysis.totalAnalyzed > 0
                        ? Math.round((data.callAnalysis.averageScore / 100) * 100) + "%"
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    
  );
};

export default DashboardAnalytics;
