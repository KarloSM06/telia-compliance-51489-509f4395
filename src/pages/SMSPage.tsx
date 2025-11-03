import { MessageSquare, Send, Download, TrendingUp, ArrowUpRight, ArrowDownRight, Settings, RefreshCw } from "lucide-react";
import { PremiumHero } from "@/components/communications/premium/PremiumHero";
import { PremiumStatCard } from "@/components/communications/premium/PremiumStatCard";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useMessageLogs } from "@/hooks/useMessageLogs";
import { formatDollar } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { useState } from "react";
import { AdvancedFilters } from "@/components/communications/premium/AdvancedFilters";
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { MessageProvidersDialog } from "@/components/messages/MessageProvidersDialog";

export default function SMSPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<any>({});
  const [showProvidersDialog, setShowProvidersDialog] = useState(false);

  const { logs, stats, isLoading } = useMessageLogs({ 
    channel: 'sms',
    status: filters.status === 'all' ? undefined : filters.status,
    dateFrom: filters.dateRange?.from?.toISOString().split('T')[0],
    dateTo: filters.dateRange?.to?.toISOString().split('T')[0],
  });

  const smsLogs = logs.filter(l => l.channel === 'sms');
  const providers = [...new Set(smsLogs.map(l => l.provider))];

  const providerStats = providers.map(provider => {
    const providerLogs = smsLogs.filter(l => l.provider === provider);
    return {
      provider,
      count: providerLogs.length,
      cost: providerLogs.reduce((sum, l) => sum + (l.cost || 0), 0),
    };
  });

  const handleRefresh = async () => {
    toast.loading('Uppdaterar data...');
    await queryClient.invalidateQueries({ queryKey: ['message-logs', user?.id] });
    toast.dismiss();
    toast.success('Data uppdaterad');
  };

  const handleExport = () => {
    const csvContent = [
      ['Riktning', 'Från/Till', 'Meddelande', 'Provider', 'Status', 'Typ', 'Kostnad', 'Datum'].join(','),
      ...smsLogs.map((msg) =>
        [
          msg.direction || '-',
          msg.recipient || '-',
          `"${msg.message_body?.replace(/"/g, '""') || '-'}"`,
          msg.provider || '-',
          msg.status || '-',
          msg.message_type || '-',
          msg.cost || 0,
          msg.sent_at || '-',
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sms-messages-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Export klar');
  };

  return (
    <div className="min-h-screen bg-background">
      <PremiumHero
        title="SMS Kommunikation"
        subtitle="Hantera och analysera all din SMS-kommunikation på ett ställe"
        icon={<MessageSquare className="h-8 w-8 text-primary" />}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 space-y-8">
        {/* Header Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowProvidersDialog(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Leverantörer
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Uppdatera
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Stats Grid */}
        <AnimatedSection delay={0}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatedSection delay={0}>
              <PremiumStatCard
                title="Totalt antal SMS"
                value={stats.total}
                subtitle="Alla meddelanden"
                icon={MessageSquare}
                color="primary"
                isLoading={isLoading}
              />
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <PremiumStatCard
                title="Skickade"
                value={stats.sent}
                subtitle={`${((stats.sent / stats.total) * 100 || 0).toFixed(1)}% success rate`}
                icon={Send}
                color="success"
                isLoading={isLoading}
              />
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <PremiumStatCard
                title="Inkommande"
                value={stats.inbound}
                subtitle={`${stats.reviews} recensionsförfrågningar`}
                icon={Download}
                color="violet"
                isLoading={isLoading}
              />
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <PremiumStatCard
                title="Total kostnad"
                value={formatDollar(stats.smsCost)}
                subtitle="USD"
                icon={TrendingUp}
                color="warning"
                isLoading={isLoading}
              />
            </AnimatedSection>
          </div>
        </AnimatedSection>

        {/* Filters */}
        <AnimatedSection delay={400}>
          <AdvancedFilters
            onFilterChange={setFilters}
            providers={providers}
            showProviderFilter={true}
            showStatusFilter={true}
            showDirectionFilter={true}
          />
        </AnimatedSection>

        {/* Messages Table */}
        <AnimatedSection delay={500}>
          <div className="bg-card rounded-lg border shadow-card overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">SMS-meddelanden</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Alla dina SMS-meddelanden i en vy
              </p>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Riktning</TableHead>
                    <TableHead>Från/Till</TableHead>
                    <TableHead>Meddelande</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Typ</TableHead>
                    <TableHead>Kostnad</TableHead>
                    <TableHead>Datum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 8 }).map((_, j) => (
                          <TableCell key={j}>
                            <div className="h-4 bg-muted rounded animate-pulse" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : smsLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                        Inga SMS-meddelanden hittades
                      </TableCell>
                    </TableRow>
                  ) : (
                    smsLogs.slice(0, 50).map((log) => (
                      <TableRow key={log.id} className="hover:bg-muted/30">
                        <TableCell>
                          {log.direction === 'inbound' ? (
                            <ArrowDownRight className="h-4 w-4 text-violet-500" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4 text-primary" />
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {log.recipient}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {log.message_body}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.provider}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              log.status === 'delivered' ? 'default' : 
                              log.status === 'failed' ? 'destructive' : 
                              'secondary'
                            }
                          >
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {log.message_type && (
                            <Badge variant="outline" className="capitalize">
                              {log.message_type}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {formatDollar(log.cost)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(log.sent_at), "d MMM HH:mm", { locale: sv })}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </AnimatedSection>

        {/* Providers Dialog */}
        <MessageProvidersDialog
          open={showProvidersDialog}
          onClose={() => setShowProvidersDialog(false)}
          providers={providerStats}
          type="sms"
        />
      </div>
    </div>
  );
}
