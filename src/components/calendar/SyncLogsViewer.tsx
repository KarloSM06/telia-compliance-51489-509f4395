import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownCircle, ArrowUpCircle, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface SyncLog {
  id: string;
  direction: 'inbound' | 'outbound';
  source: string;
  external_id: string;
  action: string;
  status: string;
  error_message?: string;
  attempt: number;
  max_attempts: number;
  created_at: string;
  completed_at?: string;
}

export function SyncLogsViewer() {
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'inbound' | 'outbound'>('all');

  useEffect(() => {
    fetchLogs();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('sync-logs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sync_logs'
        },
        () => {
          fetchLogs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter]);

  const fetchLogs = async () => {
    let query = supabase
      .from('sync_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (filter !== 'all') {
      query = query.eq('direction', filter);
    }

    const { data, error } = await query;

    if (!error && data) {
      setLogs(data as SyncLog[]);
    }
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'retrying':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      success: 'default',
      error: 'destructive',
      retrying: 'secondary',
      pending: 'outline'
    };

    return (
      <Badge variant={variants[status] || 'outline'}>
        {status}
      </Badge>
    );
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'text-green-600';
      case 'update':
        return 'text-blue-600';
      case 'delete':
        return 'text-red-600';
      case 'noop':
        return 'text-gray-600';
      default:
        return '';
    }
  };

  const filteredLogs = logs;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Synkroniseringsloggar</CardTitle>
        <CardDescription>
          Senaste 100 synkroniseringshändelser mellan externa system och kalender
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Alla</TabsTrigger>
            <TabsTrigger value="inbound">
              <ArrowDownCircle className="h-4 w-4 mr-2" />
              Inkommande
            </TabsTrigger>
            <TabsTrigger value="outbound">
              <ArrowUpCircle className="h-4 w-4 mr-2" />
              Utgående
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="mt-4">
            <ScrollArea className="h-[600px] pr-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Inga synkroniseringsloggar hittades
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      className="border rounded-lg p-4 hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">
                            {log.direction === 'inbound' ? (
                              <ArrowDownCircle className="h-5 w-5 text-blue-500" />
                            ) : (
                              <ArrowUpCircle className="h-5 w-5 text-purple-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`font-medium ${getActionColor(log.action)}`}>
                                {log.action.toUpperCase()}
                              </span>
                              <span className="text-muted-foreground text-sm">från</span>
                              <Badge variant="outline">{log.source}</Badge>
                              {log.external_id && (
                                <>
                                  <span className="text-muted-foreground text-sm">•</span>
                                  <span className="text-xs font-mono text-muted-foreground truncate max-w-[200px]">
                                    {log.external_id}
                                  </span>
                                </>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {format(new Date(log.created_at), 'PPp', { locale: sv })}
                              {log.completed_at && (
                                <>
                                  <span>→</span>
                                  {format(new Date(log.completed_at), 'PPp', { locale: sv })}
                                </>
                              )}
                            </div>

                            {log.error_message && (
                              <div className="mt-2 text-sm text-destructive bg-destructive/10 rounded p-2">
                                <span className="font-medium">Fel:</span> {log.error_message}
                              </div>
                            )}

                            {log.attempt > 1 && (
                              <div className="mt-1 text-xs text-muted-foreground">
                                Försök {log.attempt} av {log.max_attempts}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          {getStatusIcon(log.status)}
                          {getStatusBadge(log.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}