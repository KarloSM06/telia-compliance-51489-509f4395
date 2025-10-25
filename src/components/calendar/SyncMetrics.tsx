import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, AlertTriangle, Clock } from "lucide-react";

interface Metrics {
  inbound_total: number;
  inbound_success: number;
  inbound_failed: number;
  outbound_total: number;
  outbound_success: number;
  outbound_failed: number;
  queue_pending: number;
  queue_dead_letter: number;
}

export function SyncMetrics() {
  const [metrics, setMetrics] = useState<Metrics>({
    inbound_total: 0,
    inbound_success: 0,
    inbound_failed: 0,
    outbound_total: 0,
    outbound_success: 0,
    outbound_failed: 0,
    queue_pending: 0,
    queue_dead_letter: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    // Fetch sync logs metrics
    const { data: inboundLogs } = await supabase
      .from('sync_logs')
      .select('status', { count: 'exact' })
      .eq('direction', 'inbound')
      .gte('created_at', hourAgo);

    const { data: outboundLogs } = await supabase
      .from('sync_logs')
      .select('status', { count: 'exact' })
      .eq('direction', 'outbound')
      .gte('created_at', hourAgo);

    // Fetch queue metrics
    const { count: pendingCount } = await supabase
      .from('booking_sync_queue')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: dlqCount } = await supabase
      .from('booking_sync_queue')
      .select('*', { count: 'exact', head: true })
      .eq('is_dead_letter', true);

    const inboundSuccess = inboundLogs?.filter(l => l.status === 'success').length || 0;
    const inboundFailed = inboundLogs?.filter(l => l.status === 'error').length || 0;
    const outboundSuccess = outboundLogs?.filter(l => l.status === 'success').length || 0;
    const outboundFailed = outboundLogs?.filter(l => l.status === 'error').length || 0;

    setMetrics({
      inbound_total: inboundLogs?.length || 0,
      inbound_success: inboundSuccess,
      inbound_failed: inboundFailed,
      outbound_total: outboundLogs?.length || 0,
      outbound_success: outboundSuccess,
      outbound_failed: outboundFailed,
      queue_pending: pendingCount || 0,
      queue_dead_letter: dlqCount || 0
    });

    setLoading(false);
  };

  const calculateSuccessRate = (success: number, total: number) => {
    if (total === 0) return 0;
    return ((success / total) * 100).toFixed(1);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inkommande Sync</CardTitle>
          <ArrowDownCircle className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.inbound_total}</div>
          <p className="text-xs text-muted-foreground">
            {calculateSuccessRate(metrics.inbound_success, metrics.inbound_total)}% framgång
          </p>
          {metrics.inbound_failed > 0 && (
            <p className="text-xs text-destructive mt-1">
              {metrics.inbound_failed} misslyckade
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Utgående Sync</CardTitle>
          <ArrowUpCircle className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.outbound_total}</div>
          <p className="text-xs text-muted-foreground">
            {calculateSuccessRate(metrics.outbound_success, metrics.outbound_total)}% framgång
          </p>
          {metrics.outbound_failed > 0 && (
            <p className="text-xs text-destructive mt-1">
              {metrics.outbound_failed} misslyckade
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Väntande Jobb</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.queue_pending}</div>
          <p className="text-xs text-muted-foreground">
            I synkroniseringskö
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Misslyckade Jobb</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.queue_dead_letter}</div>
          <p className="text-xs text-muted-foreground">
            Kräver manuell åtgärd
          </p>
        </CardContent>
      </Card>
    </div>
  );
}