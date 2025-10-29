import { useState, useMemo } from "react";
import { useTelephonyMessages } from "@/hooks/useTelephonyMessages";
import { MessageStatsCards } from "@/components/messages/MessageStatsCards";
import { MessageFilters } from "@/components/messages/MessageFilters";
import { MessagesTable } from "@/components/messages/MessagesTable";
import { MessageDetailModal } from "@/components/messages/MessageDetailModal";

export default function MessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [filters, setFilters] = useState({
    direction: 'all',
    status: 'all',
  });

  const { metrics, isLoading } = useTelephonyMessages();

  const filteredMessages = useMemo(() => {
    return metrics.messages.filter((msg: any) => {
      const normalized = msg.normalized as any;
      if (filters.direction !== 'all' && normalized?.direction !== filters.direction) return false;
      if (filters.status !== 'all' && normalized?.status !== filters.status) return false;
      return true;
    });
  }, [metrics.messages, filters]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meddelanden</h1>
          <p className="text-muted-foreground">
            Hantera schemalagda meddelanden och meddelandeloggar
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>Laddar meddelanden...</p>
        </div>
      ) : (
        <>
          <MessageStatsCards 
            total={metrics.totalMessages}
            inbound={metrics.inboundCount}
            outbound={metrics.outboundCount}
            failed={metrics.failedCount}
            cost={metrics.totalCost}
          />

          <MessageFilters onFilterChange={setFilters} />

          <MessagesTable 
            messages={filteredMessages}
            onViewDetails={setSelectedMessage}
          />

          <MessageDetailModal 
            message={selectedMessage}
            open={!!selectedMessage}
            onClose={() => setSelectedMessage(null)}
          />
        </>
      )}
    </div>
  );
}
