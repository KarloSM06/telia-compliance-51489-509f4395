import { useState, useMemo } from "react";
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Download, Settings, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMessageLogs } from "@/hooks/useMessageLogs";
import { usePhoneNumbers } from "@/hooks/usePhoneNumbers";
import { SMSStatsCards } from "@/components/messages/SMSStatsCards";
import { SMSTable } from "@/components/messages/SMSTable";
import { SMSFilters, SMSFilterValues } from "@/components/messages/SMSFilters";
import { SMSDetailDrawer } from "@/components/messages/SMSDetailDrawer";
import { MessageProvidersDialog } from "@/components/messages/MessageProvidersDialog";

export default function SMSPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { phoneNumbers, isLoading: isLoadingNumbers } = usePhoneNumbers();
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showProvidersDialog, setShowProvidersDialog] = useState(false);
  const [filters, setFilters] = useState<SMSFilterValues>({
    search: '',
    status: 'all',
    direction: 'all',
  });

  const { logs, stats, isLoading } = useMessageLogs({
    channel: 'sms',
    status: filters.status === 'all' ? undefined : filters.status,
    dateFrom: filters.dateFrom?.toISOString().split('T')[0],
    dateTo: filters.dateTo?.toISOString().split('T')[0],
  });

  // Calculate provider statistics
  const providerStats = useMemo(() => {
    const stats = new Map<string, { count: number; cost: number }>();
    
    logs.forEach((log) => {
      const provider = log.provider || 'unknown';
      const current = stats.get(provider) || { count: 0, cost: 0 };
      stats.set(provider, {
        count: current.count + 1,
        cost: current.cost + (log.cost || 0),
      });
    });

    return Array.from(stats.entries()).map(([provider, data]) => ({
      provider,
      ...data,
    }));
  }, [logs]);

  // Filter messages based on search
  const filteredMessages = useMemo(() => {
    return logs.filter((message) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          message.recipient?.includes(searchLower) ||
          message.message_body?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      return true;
    });
  }, [logs, filters.search]);

  const handleRefresh = async () => {
    toast.loading('Uppdaterar data...');
    await queryClient.invalidateQueries({ queryKey: ['message-logs', user?.id] });
    toast.dismiss();
    toast.success('Data uppdaterad');
  };

  const handleExport = () => {
    const csvContent = [
      ['Telefonnummer', 'Status', 'Meddelande', 'Skickat', 'Levererat', 'Kostnad'].join(','),
      ...filteredMessages.map((msg) =>
        [
          msg.recipient || '-',
          msg.status || '-',
          `"${msg.message_body?.replace(/"/g, '""') || '-'}"`,
          msg.sent_at || '-',
          msg.delivered_at || '-',
          msg.cost || 0,
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SMS</h1>
          <p className="text-muted-foreground">
            Realtidsövervakning av alla dina SMS-meddelanden
          </p>
        </div>
        <div className="flex gap-2">
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
      </div>

      {/* Warning if no phone numbers synced */}
      {!isLoadingNumbers && (!phoneNumbers || phoneNumbers.length === 0) && (
        <Alert className="border-amber-500/50 bg-amber-500/10">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-900">Inga telefonnummer synkade</AlertTitle>
          <AlertDescription className="text-amber-800">
            För att korrekt klassificera inkommande/utgående SMS måste du synka dina telefonnummer.{' '}
            <Button variant="link" className="px-0 h-auto text-amber-900 underline font-semibold" asChild>
              <Link to="/dashboard/telephony">
                Gå till Telefoni → Synka nummer
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
        <SMSStatsCards
          total={stats.total}
          sent={stats.sent}
          pending={stats.pending}
          failed={stats.failed}
          cost={stats.smsCost} // USD-värde (samma som telephony)
          inbound={stats.inbound}
          outbound={stats.outbound}
          reviews={stats.reviews}
        />

      {/* Filters */}
      <SMSFilters onFilterChange={setFilters} />

      {/* Messages Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Meddelanden</h2>
          <p className="text-sm text-muted-foreground">
            Visar {filteredMessages.length} av {logs.length} meddelanden
          </p>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <SMSTable messages={filteredMessages} onViewDetails={setSelectedMessage} />
        )}
      </div>

      {/* Message Detail Drawer */}
      <SMSDetailDrawer
        message={selectedMessage}
        open={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
      />

      {/* Providers Dialog */}
      <MessageProvidersDialog
        open={showProvidersDialog}
        onClose={() => setShowProvidersDialog(false)}
        providers={providerStats}
        type="sms"
      />
    </div>
  );
}
