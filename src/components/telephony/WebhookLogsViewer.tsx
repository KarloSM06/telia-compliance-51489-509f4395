import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, CheckCircle, XCircle, Clock } from "lucide-react";
import { useWebhookLogs } from "@/hooks/useWebhookLogs";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

export function WebhookLogsViewer() {
  const { logs, isLoading } = useWebhookLogs(20);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Webhook Aktivitet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Laddar...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Webhook Aktivitet
        </CardTitle>
        <CardDescription>
          Senaste 20 webhook-händelserna
        </CardDescription>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">Inga webhook-händelser ännu</p>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  {log.response_status >= 200 && log.response_status < 300 ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : log.error_message ? (
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  ) : (
                    <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                  )}
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {log.provider}
                        </Badge>
                        <Badge variant="secondary">
                          {log.request_method}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(log.created_at), 'HH:mm:ss', { locale: sv })}
                      </span>
                    </div>
                    
                    {log.error_message && (
                      <p className="text-xs text-red-600">{log.error_message}</p>
                    )}
                    
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Status: {log.response_status}</span>
                      {log.processing_time_ms && (
                        <span>{log.processing_time_ms}ms</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
