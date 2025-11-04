import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHiemsAdmin } from '@/hooks/useHiemsAdmin';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, RefreshCw, Loader2 } from 'lucide-react';
import { AggregatedStatsCards } from '@/components/admin/AggregatedStatsCards';
import { CallActivityByUserChart } from '@/components/admin/aggregated-charts/CallActivityByUserChart';
import { MeetingConversionChart } from '@/components/admin/aggregated-charts/MeetingConversionChart';
import { LeadSourceAnalysisChart } from '@/components/admin/aggregated-charts/LeadSourceAnalysisChart';
import { RevenueByUserChart } from '@/components/admin/aggregated-charts/RevenueByUserChart';
import { UsageHeatmapChart } from '@/components/admin/aggregated-charts/UsageHeatmapChart';
import { CallSuccessRateChart } from '@/components/admin/aggregated-charts/CallSuccessRateChart';
import { RecentCallsTable } from '@/components/admin/aggregated-data/RecentCallsTable';
import { TranscriptViewer } from '@/components/admin/aggregated-data/TranscriptViewer';
import { TopPerformersTable } from '@/components/admin/aggregated-data/TopPerformersTable';
import { ActiveMeetingsTable } from '@/components/admin/aggregated-data/ActiveMeetingsTable';
import { useAdminAggregatedData } from '@/hooks/useAdminAggregatedData';
import { useAdminCallTranscripts } from '@/hooks/useAdminCallTranscripts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function AdminPanel() {
  const { isHiemsAdmin, loading: adminLoading } = useHiemsAdmin();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);

  const { data: aggregatedData, isLoading: dataLoading, refetch } = useAdminAggregatedData();
  const { data: recentCalls = [] } = useAdminCallTranscripts(undefined, 50);
  const { data: upcomingMeetings = [] } = useQuery({
    queryKey: ['admin', 'upcoming-meetings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('id, title, start_time, contact_person, expected_revenue, status')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(20);
      if (error) throw error;
      return data;
    },
    enabled: isHiemsAdmin,
  });

  useEffect(() => {
    if (!adminLoading && !isHiemsAdmin) {
      toast({ title: 'Access Denied', description: 'You do not have admin privileges', variant: 'destructive' });
      navigate('/dashboard');
    }
  }, [adminLoading, isHiemsAdmin, navigate, toast]);

  if (adminLoading || dataLoading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!isHiemsAdmin || !aggregatedData) return null;

  const handleRefresh = () => { refetch(); toast({ title: 'Data uppdaterad' }); };
  const handleExport = () => {
    if (!aggregatedData) return;
    const exportData = { generated_at: new Date().toISOString(), summary: { total_calls: aggregatedData.telephony.total_calls, total_sms: aggregatedData.telephony.total_sms, total_meetings: aggregatedData.meetings.total_meetings, total_leads: aggregatedData.leads.total_leads, active_users: aggregatedData.users.active_users, total_revenue: aggregatedData.meetings.total_revenue }, calls: recentCalls.slice(0, 100) };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Export klar' });
  };

  const meetingConversionData = [
    { name: 'Schemalagda', value: aggregatedData.meetings.scheduled, color: 'hsl(var(--chart-1))' },
    { name: 'Genomförda', value: aggregatedData.meetings.completed, color: 'hsl(var(--chart-2))' },
    { name: 'Avbokade', value: aggregatedData.meetings.cancelled, color: 'hsl(var(--chart-3))' }
  ];

  const leadSourceData = Object.entries(aggregatedData.leads.by_status || {}).map(([name, value]) => ({ name, value: value as number }));

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Super Dashboard</h1>
          <p className="text-xl text-muted-foreground">Aggregerad vy över alla kunders data</p>
        </div>
      </section>

      <div className="container mx-auto px-6 lg:px-8 -mt-8 mb-8">
        <Card className="p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2 text-sm">
            <span className="px-3 py-1 rounded-full bg-primary/10"><span className="font-semibold">{aggregatedData.users.total_users}</span> Användare</span>
            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600"><span className="font-semibold">{aggregatedData.users.active_users}</span> Aktiva</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}><RefreshCw className="h-4 w-4 mr-2" />Uppdatera</Button>
            <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4 mr-2" />Exportera</Button>
          </div>
        </Card>
      </div>

      <AggregatedStatsCards totalCalls={aggregatedData.telephony.total_calls} totalSms={aggregatedData.telephony.total_sms} totalMeetings={aggregatedData.meetings.total_meetings} totalLeads={aggregatedData.leads.total_leads} activeUsers={aggregatedData.users.active_users} totalRevenue={aggregatedData.meetings.total_revenue} />

      <section className="container mx-auto px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-6">Statistik & Analys</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <MeetingConversionChart data={meetingConversionData} />
          <LeadSourceAnalysisChart data={leadSourceData} />
        </div>
      </section>

      <section className="container mx-auto px-6 lg:px-8 py-12 space-y-8">
        <RecentCallsTable calls={recentCalls} onViewTranscript={(callId) => setSelectedCallId(callId)} />
        <ActiveMeetingsTable meetings={upcomingMeetings} />
      </section>

      <TranscriptViewer callId={selectedCallId} open={!!selectedCallId} onOpenChange={(open) => !open && setSelectedCallId(null)} />
    </div>
  );
}
