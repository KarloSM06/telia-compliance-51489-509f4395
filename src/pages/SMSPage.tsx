import { useState } from "react";
import { useMessageLogs } from "@/hooks/useMessageLogs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageFilters } from "@/components/messages/MessageFilters";
import { SMSStatsCards } from "@/components/messages/SMSStatsCards";
import { SMSTable } from "@/components/messages/SMSTable";
import { MessageDetailModal } from "@/components/messages/MessageDetailModal";
import { MessageSquare } from "lucide-react";

export default function SMSPage() {
  const [filters, setFilters] = useState({
    channel: 'sms' as const,
    status: undefined as string | undefined,
    dateFrom: undefined as string | undefined,
    dateTo: undefined as string | undefined,
  });
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { logs, stats, isLoading } = useMessageLogs(filters);

  const handleFilterChange = (newFilters: { status: string; dateFrom?: string; dateTo?: string }) => {
    setFilters({
      channel: 'sms',
      status: newFilters.status === 'all' ? undefined : newFilters.status,
      dateFrom: newFilters.dateFrom,
      dateTo: newFilters.dateTo,
    });
  };

  const handleViewDetails = (message: any) => {
    setSelectedMessage(message);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">SMS-meddelanden</h1>
          <p className="text-muted-foreground">Översikt över skickade och mottagna SMS</p>
        </div>
      </div>

      <SMSStatsCards
        total={stats.total}
        sent={stats.sent}
        pending={stats.pending}
        failed={stats.failed}
        cost={stats.smsCost}
      />

      <Card>
        <CardHeader>
          <CardTitle>Filteralternativ</CardTitle>
          <CardDescription>Filtrera SMS-meddelanden efter status och datum</CardDescription>
        </CardHeader>
        <CardContent>
          <MessageFilters type="sms" onFilterChange={handleFilterChange} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SMS-meddelanden</CardTitle>
          <CardDescription>
            Visar {logs.length} meddelanden
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Laddar SMS-meddelanden...</p>
            </div>
          ) : (
            <SMSTable messages={logs} onViewDetails={handleViewDetails} />
          )}
        </CardContent>
      </Card>

      <MessageDetailModal
        type="sms"
        message={selectedMessage}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
