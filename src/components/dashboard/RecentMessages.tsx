import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMessageLogs } from "@/hooks/useMessageLogs";
import { Mail, MessageSquare, CheckCircle, XCircle, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { sv } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const RecentMessages = () => {
  const { logs, isLoading: loading } = useMessageLogs();

  // Get last 5 messages
  const recentLogs = logs.slice(0, 5);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Senaste meddelanden</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="default" className="bg-green-500">Levererad</Badge>;
      case 'failed':
        return <Badge variant="destructive">Misslyckades</Badge>;
      default:
        return <Badge variant="secondary">Väntar</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Senaste meddelanden
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentLogs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Inga meddelanden ännu
          </p>
        ) : (
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  {log.channel === 'email' ? (
                    <Mail className="h-5 w-5 text-blue-500" />
                  ) : (
                    <MessageSquare className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-sm truncate">{log.recipient}</p>
                    {getStatusIcon(log.status)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {log.subject || log.message_body}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusBadge(log.status)}
                    <span className="text-xs text-muted-foreground">
                      {format(parseISO(log.sent_at), "d MMM HH:mm", { locale: sv })}
                    </span>
                    {log.cost && (
                      <span className="text-xs text-muted-foreground">
                        {log.cost.toFixed(2)} kr
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
