import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useMessageLogs, MessageLogFilters } from "@/hooks/useMessageLogs";
import { Loader2, Mail, MessageSquare, CheckCircle2, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

export default function MessageInsights() {
  const [filters, setFilters] = useState<MessageLogFilters>({});
  const { logs, stats, isLoading } = useMessageLogs(filters);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
      case 'delivered':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'failed':
      case 'bounced':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      sent: 'default',
      delivered: 'default',
      failed: 'destructive',
      bounced: 'destructive',
    };
    return (
      <Badge variant={variants[status] || 'secondary'} className="gap-1">
        {getStatusIcon(status)}
        {status === 'sent' ? 'Skickat' : status === 'delivered' ? 'Levererat' : status === 'failed' ? 'Misslyckades' : status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Meddelandeöversikt</h1>
        <p className="text-muted-foreground">
          Fullständig översikt över alla SMS och e-post som skickats
        </p>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Totalt antal</CardDescription>
            <CardTitle className="text-4xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Skickade</CardDescription>
            <CardTitle className="text-4xl text-green-600">{stats.sent}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Väntande</CardDescription>
            <CardTitle className="text-4xl text-yellow-600">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Misslyckade</CardDescription>
            <CardTitle className="text-4xl text-red-600">{stats.failed}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Kostnad */}
      <Card>
        <CardHeader>
          <CardTitle>Kostnad denna månad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-8">
            <div>
              <div className="text-sm text-muted-foreground">SMS</div>
              <div className="text-2xl font-bold">{stats.smsCost.toFixed(2)} kr</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">E-post</div>
              <div className="text-2xl font-bold">{stats.emailCost.toFixed(2)} kr</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Totalt</div>
              <div className="text-2xl font-bold">{stats.totalCost.toFixed(2)} kr</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Kanal</label>
              <Select
                value={filters.channel || 'all'}
                onValueChange={(value) => setFilters({ ...filters, channel: value === 'all' ? undefined : value as 'sms' | 'email' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alla</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">E-post</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) => setFilters({ ...filters, status: value === 'all' ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alla</SelectItem>
                  <SelectItem value="sent">Skickat</SelectItem>
                  <SelectItem value="delivered">Levererat</SelectItem>
                  <SelectItem value="failed">Misslyckades</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabell */}
      <Card>
        <CardHeader>
          <CardTitle>Meddelanden ({logs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Inga meddelanden ännu
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum & Tid</TableHead>
                  <TableHead>Mottagare</TableHead>
                  <TableHead>Kanal</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Kostnad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {format(new Date(log.sent_at), 'PPP HH:mm', { locale: sv })}
                    </TableCell>
                    <TableCell className="font-medium">{log.recipient}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1">
                        {log.channel === 'sms' ? (
                          <>
                            <MessageSquare className="h-3 w-3" />
                            SMS
                          </>
                        ) : (
                          <>
                            <Mail className="h-3 w-3" />
                            E-post
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">{log.provider}</TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell>
                      {log.cost ? `${log.cost.toFixed(2)} kr` : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
