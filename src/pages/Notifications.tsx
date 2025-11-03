import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Bell, BellRing, MessageSquare, BarChart3, RefreshCw, Download } from "lucide-react";
import { toast } from "sonner";
import MessageTemplates from "@/pages/MessageTemplates";
import ReminderSettings from "@/pages/ReminderSettings";
import NotificationSettings from "@/pages/NotificationSettings";
import SMSProviderSettings from "@/pages/SMSProviderSettings";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PremiumTelephonyStatCard } from "@/components/telephony/PremiumTelephonyStatCard";
import { NotificationsActivityChart } from "@/components/notifications/charts/NotificationsActivityChart";
import { NotificationTypeDistributionChart } from "@/components/notifications/charts/NotificationTypeDistributionChart";
import { PriorityDistributionChart } from "@/components/notifications/charts/PriorityDistributionChart";
import { ChannelDistributionChart } from "@/components/notifications/charts/ChannelDistributionChart";
import { NotificationResponseTimeTrendChart } from "@/components/notifications/charts/NotificationResponseTimeTrendChart";
import { NotificationFilters } from "@/components/notifications/NotificationFilters";
import { NotificationsTable } from "@/components/notifications/NotificationsTable";
import { useNotificationChartData } from "@/hooks/useNotificationChartData";

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("analytics");
  const [dateRangeDays, setDateRangeDays] = useState(30);
  const [filters, setFilters] = useState({ search: '', type: 'all', priority: 'all', status: 'all', channel: 'all' });
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  
  // Mock data - replace with real data from your backend
  const notifications: any[] = [];
  const chartData = useNotificationChartData(notifications);
  const stats = {
    total: notifications.length,
    sent: notifications.filter((n: any) => n.status === 'sent').length,
    pending: notifications.filter((n: any) => n.status === 'pending').length,
    read: notifications.filter((n: any) => n.read_at).length,
  };

  const handleExport = () => {
    toast.success('Export klar');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        {/* Premium Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white mb-8">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">Notifikationer</h1>
            <p className="text-lg opacity-90 mb-6">
              Hantera notifikationer, påminnelser och ägaraviseringar
            </p>
          </div>
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]" />
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Badge className="bg-green-500/20 text-green-700">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
              Live
            </Badge>
            <Badge variant="outline">{stats.total} notifikationer</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Uppdatera
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Desktop Navigation - Minimalist Pill Design */}
        <div className="hidden lg:block mb-8">
          <TabsList className="flex flex-wrap justify-center gap-3 bg-transparent border-0 p-0">
            <TabsTrigger 
              value="analytics" 
              className="group relative gap-2 px-6 py-3 bg-card text-foreground border border-border rounded-full shadow-sm hover:shadow-md hover:bg-accent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-md transition-all duration-200"
            >
              <BarChart3 className="h-5 w-5" />
              <span className="font-medium">Analys</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="templates" 
              className="group relative gap-2 px-6 py-3 bg-card text-foreground border border-border rounded-full shadow-sm hover:shadow-md hover:bg-accent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-md transition-all duration-200"
            >
              <FileText className="h-5 w-5" />
              <span className="font-medium">Mallar</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="reminders" 
              className="group relative gap-2 px-6 py-3 bg-card text-foreground border border-border rounded-full shadow-sm hover:shadow-md hover:bg-accent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-md transition-all duration-200"
            >
              <Bell className="h-5 w-5" />
              <span className="font-medium">Påminnelser</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="notifications" 
              className="group relative gap-2 px-6 py-3 bg-card text-foreground border border-border rounded-full shadow-sm hover:shadow-md hover:bg-accent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-md transition-all duration-200"
            >
              <BellRing className="h-5 w-5" />
              <span className="font-medium">Ägarnotiser</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="sms-provider" 
              className="group relative gap-2 px-6 py-3 bg-card text-foreground border border-border rounded-full shadow-sm hover:shadow-md hover:bg-accent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary data-[state=active]:shadow-md transition-all duration-200"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">SMS-leverantör</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex justify-center mb-8 animate-scale-in">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full max-w-md bg-card border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="analytics">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analys
                </div>
              </SelectItem>
              <SelectItem value="templates">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Mallar
                </div>
              </SelectItem>
              <SelectItem value="reminders">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Påminnelser
                </div>
              </SelectItem>
              <SelectItem value="notifications">
                <div className="flex items-center gap-2">
                  <BellRing className="h-4 w-4" />
                  Ägarnotiser
                </div>
              </SelectItem>
              <SelectItem value="sms-provider">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  SMS-leverantör
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full px-1">
          <TabsContent value="analytics" className="animate-fade-in mt-0 space-y-6">
            {/* AI Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <PremiumTelephonyStatCard title="Totalt" value={stats.total} icon={Bell} color="text-blue-600" subtitle="Alla notifikationer" />
              <PremiumTelephonyStatCard title="Skickade" value={stats.sent} icon={BellRing} color="text-green-600" subtitle="Levererade" />
              <PremiumTelephonyStatCard title="Väntande" value={stats.pending} icon={Bell} color="text-orange-600" subtitle="Kö" />
              <PremiumTelephonyStatCard title="Lästa" value={stats.read} icon={BellRing} color="text-purple-600" subtitle="Öppnade" />
            </div>

            {/* Charts */}
            <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <h2 className="text-xl font-bold">Statistik & Analys</h2>
                <div className="flex gap-2">
                  <Button variant={dateRangeDays === 7 ? "default" : "outline"} size="sm" onClick={() => setDateRangeDays(7)}>7 dagar</Button>
                  <Button variant={dateRangeDays === 30 ? "default" : "outline"} size="sm" onClick={() => setDateRangeDays(30)}>30 dagar</Button>
                  <Button variant={dateRangeDays === 90 ? "default" : "outline"} size="sm" onClick={() => setDateRangeDays(90)}>90 dagar</Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <NotificationsActivityChart data={chartData.dailyActivity} isLoading={false} />
                <NotificationTypeDistributionChart data={chartData.typeDistribution} isLoading={false} />
                <PriorityDistributionChart data={chartData.priorityDistribution} isLoading={false} />
                <ChannelDistributionChart data={chartData.channelDistribution} isLoading={false} />
                <NotificationResponseTimeTrendChart data={chartData.responseTimeTrend} isLoading={false} />
              </div>
            </Card>

            {/* Notifications Table */}
            <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 to-card/50 backdrop-blur">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Alla notifikationer</h2>
                <NotificationFilters onFilterChange={setFilters} />
              </div>
              <NotificationsTable notifications={notifications} onViewDetails={setSelectedNotification} />
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="animate-fade-in mt-0">
            <MessageTemplates />
          </TabsContent>

          <TabsContent value="reminders" className="animate-fade-in mt-0">
            <ReminderSettings />
          </TabsContent>

          <TabsContent value="notifications" className="animate-fade-in mt-0">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="sms-provider" className="animate-fade-in mt-0">
            <SMSProviderSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
