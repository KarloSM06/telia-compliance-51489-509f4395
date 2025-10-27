import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useMessageLogs, MessageLogFilters } from "@/hooks/useMessageLogs";
import { Loader2, Mail, MessageSquare, CheckCircle2, XCircle, Clock, TrendingUp, DollarSign, Send } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { StatCard } from "@/components/communications/StatCard";
import { Button } from "@/components/ui/button";

export default function MessageInsights() {
  const [filters, setFilters] = useState<MessageLogFilters>({});
  const { logs, stats, isLoading } = useMessageLogs(filters);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
      case 'delivered':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'failed':
      case 'bounced':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      sent: { variant: 'default' as const, label: 'Skickat' },
      delivered: { variant: 'default' as const, label: 'Levererat' },
      failed: { variant: 'destructive' as const, label: 'Misslyckades' },
      bounced: { variant: 'destructive' as const, label: 'Studsade' },
      pending: { variant: 'secondary' as const, label: 'Väntande' },
    };
    const { variant, label } = config[status as keyof typeof config] || { variant: 'secondary' as const, label: status };
    
    return (
      <Badge variant={variant} className="gap-1">
        {getStatusIcon(status)}
        {label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate success rate
  const successRate = stats.total > 0 
    ? Math.round((stats.sent / stats.total) * 100) 
    : 0;

  return (
    <div className="space-y-6 w-full px-6 pb-12">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Totalt antal" 
          value={stats.total} 
          icon={Send}
        />
        <StatCard 
          title="Skickade" 
          value={stats.sent} 
          icon={CheckCircle2}
        />
        <StatCard 
          title="Leveransgrad" 
          value={`${successRate}%`} 
          icon={TrendingUp}
        />
        <StatCard 
          title="Total kostnad" 
          value={`${stats.totalCost.toFixed(2)} kr`} 
          icon={DollarSign}
        />
      </div>

      {/* Cost Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-card transition-all">
          <CardHeader className="pb-3">
            <CardDescription>SMS kostnad</CardDescription>
            <CardTitle className="text-3xl flex items-baseline gap-2">
              {stats.smsCost.toFixed(2)} 
              <span className="text-sm font-normal text-muted-foreground">kr</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              Denna månad
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-card transition-all">
          <CardHeader className="pb-3">
            <CardDescription>E-post kostnad</CardDescription>
            <CardTitle className="text-3xl flex items-baseline gap-2">
              {stats.emailCost.toFixed(2)} 
              <span className="text-sm font-normal text-muted-foreground">kr</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              Denna månad
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20 hover:shadow-card transition-all">
          <CardHeader className="pb-3">
            <CardDescription>Misslyckade</CardDescription>
            <CardTitle className="text-3xl flex items-baseline gap-2 text-destructive">
              {stats.failed} 
              <span className="text-sm font-normal text-muted-foreground">st</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <XCircle className="h-4 w-4" />
              Denna månad
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
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
                  <SelectItem value="all">Alla kanaler</SelectItem>
                  <SelectItem value="sms">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      SMS
                    </div>
                  </SelectItem>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      E-post
                    </div>
                  </SelectItem>
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
                  <SelectItem value="all">Alla statusar</SelectItem>
                  <SelectItem value="sent">Skickat</SelectItem>
                  <SelectItem value="delivered">Levererat</SelectItem>
                  <SelectItem value="failed">Misslyckades</SelectItem>
                  <SelectItem value="pending">Väntande</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => setFilters({})}
                className="w-full"
              >
                Rensa filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Meddelanden</CardTitle>
              <CardDescription className="mt-1">
                {logs.length} {logs.length === 1 ? 'meddelande' : 'meddelanden'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-12">
              <Send className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Inga meddelanden ännu</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Datum & Tid</TableHead>
                    <TableHead>Mottagare</TableHead>
                    <TableHead>Kanal</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Kostnad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">
                        {format(new Date(log.sent_at), 'PPP HH:mm', { locale: sv })}
                      </TableCell>
                      <TableCell>{log.recipient}</TableCell>
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
                      <TableCell className="text-right font-mono">
                        {log.cost ? `${log.cost.toFixed(2)} kr` : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
