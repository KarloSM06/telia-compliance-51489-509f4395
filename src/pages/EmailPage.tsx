import { useState } from "react";
import { useMessageLogs } from "@/hooks/useMessageLogs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageFilters } from "@/components/messages/MessageFilters";
import { EmailStatsCards } from "@/components/messages/EmailStatsCards";
import { EmailTable } from "@/components/messages/EmailTable";
import { MessageDetailModal } from "@/components/messages/MessageDetailModal";
import { Mail } from "lucide-react";

export default function EmailPage() {
  const [filters, setFilters] = useState({
    channel: 'email' as const,
    status: undefined as string | undefined,
    dateFrom: undefined as string | undefined,
    dateTo: undefined as string | undefined,
  });
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { logs, stats, isLoading } = useMessageLogs(filters);

  const emailStats = {
    total: stats.total,
    sent: stats.sent,
    opened: logs.filter(l => l.opened_at).length,
    clicked: logs.filter(l => l.clicked_at).length,
    failed: stats.failed,
    cost: stats.emailCost,
  };

  const handleFilterChange = (newFilters: { status: string; dateFrom?: string; dateTo?: string }) => {
    setFilters({
      channel: 'email',
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
        <Mail className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Email-meddelanden</h1>
          <p className="text-muted-foreground">Översikt över skickade email</p>
        </div>
      </div>

      <EmailStatsCards
        total={emailStats.total}
        sent={emailStats.sent}
        opened={emailStats.opened}
        clicked={emailStats.clicked}
        failed={emailStats.failed}
        cost={emailStats.cost}
      />

      <Card>
        <CardHeader>
          <CardTitle>Filteralternativ</CardTitle>
          <CardDescription>Filtrera email efter status och datum</CardDescription>
        </CardHeader>
        <CardContent>
          <MessageFilters type="email" onFilterChange={handleFilterChange} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email-meddelanden</CardTitle>
          <CardDescription>
            Visar {logs.length} meddelanden
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Laddar email-meddelanden...</p>
            </div>
          ) : (
            <EmailTable messages={logs} onViewDetails={handleViewDetails} />
          )}
        </CardContent>
      </Card>

      <MessageDetailModal
        type="email"
        message={selectedMessage}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
