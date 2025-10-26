import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, RefreshCw, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface DLQJob {
  id: string;
  entity_type: string;
  entity_id: string;
  external_id: string;
  integration_id: string;
  error_message: string;
  attempts: number;
  created_at: string;
  last_error: string;
  status: string;
}

export const DLQManager = () => {
  const [jobs, setJobs] = useState<DLQJob[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDLQJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('booking_sync_queue')
        .select('*')
        .eq('status', 'dead_letter')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching DLQ jobs:', error);
      toast.error('Kunde inte hämta felaktiga jobb');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDLQJobs();

    // Subscribe to changes
    const channel = supabase
      .channel('dlq_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'booking_sync_queue',
          filter: 'status=eq.dead_letter',
        },
        () => fetchDLQJobs()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleRetry = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('booking_sync_queue')
        .update({
          status: 'pending',
          retry_count: 0,
          error_message: null,
        })
        .eq('id', jobId);

      if (error) throw error;
      toast.success('Jobb återställt för nytt försök');
      fetchDLQJobs();
    } catch (error) {
      console.error('Error retrying job:', error);
      toast.error('Kunde inte återställa jobb');
    }
  };

  const handleDelete = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('booking_sync_queue')
        .delete()
        .eq('id', jobId);

      if (error) throw error;
      toast.success('Jobb borttaget');
      fetchDLQJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Kunde inte ta bort jobb');
    }
  };

  const handleRetryAll = async () => {
    try {
      const { error } = await supabase
        .from('booking_sync_queue')
        .update({
          status: 'pending',
          retry_count: 0,
          error_message: null,
        })
        .eq('status', 'dead_letter');

      if (error) throw error;
      toast.success(`${jobs.length} jobb återställda`);
      fetchDLQJobs();
    } catch (error) {
      console.error('Error retrying all jobs:', error);
      toast.error('Kunde inte återställa jobb');
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm('Är du säker på att du vill ta bort alla felaktiga jobb?')) return;

    try {
      const { error } = await supabase
        .from('booking_sync_queue')
        .delete()
        .eq('status', 'dead_letter');

      if (error) throw error;
      toast.success('Alla jobb borttagna');
      fetchDLQJobs();
    } catch (error) {
      console.error('Error deleting all jobs:', error);
      toast.error('Kunde inte ta bort jobb');
    }
  };

  if (loading) {
    return <Card><CardContent className="p-6">Laddar...</CardContent></Card>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Dead Letter Queue
            </CardTitle>
            <CardDescription>
              Jobb som misslyckats efter flera försök ({jobs.length} st)
            </CardDescription>
          </div>
          {jobs.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRetryAll}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Försök alla igen
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDeleteAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                Ta bort alla
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {jobs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>Inga felaktiga jobb</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {jobs.map((job) => (
                <Card key={job.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="default">
                          {job.entity_type}
                        </Badge>
                        <Badge variant="outline">
                          {job.attempts} försök
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(job.created_at), 'PPp', { locale: sv })}
                        </span>
                      </div>

                      <div className="text-sm">
                        <span className="font-medium">Fel:</span>{' '}
                        <span className="text-destructive">{job.last_error || job.error_message}</span>
                      </div>

                      <details className="text-xs">
                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                          Visa detaljer
                        </summary>
                        <div className="mt-2 p-2 bg-muted rounded space-y-1">
                          <div><span className="font-medium">Entity ID:</span> {job.entity_id}</div>
                          <div><span className="font-medium">External ID:</span> {job.external_id}</div>
                          <div><span className="font-medium">Integration:</span> {job.integration_id}</div>
                        </div>
                      </details>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRetry(job.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(job.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
