import { useState, useMemo } from "react";
import { useScheduledMessages, ScheduledMessage } from "@/hooks/useScheduledMessages";
import { MessageStatsCards } from "@/components/messages/MessageStatsCards";
import { MessageFilters } from "@/components/messages/MessageFilters";
import { MessagesTable } from "@/components/messages/MessagesTable";
import { MessageDetailModal } from "@/components/messages/MessageDetailModal";

export default function MessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState<ScheduledMessage | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    channel: 'all',
    messageType: 'all',
  });

  const { messages, pendingMessages, sentMessages, failedMessages, isLoading } = useScheduledMessages();

  const filteredMessages = useMemo(() => {
    return messages.filter(msg => {
      if (filters.status !== 'all' && msg.status !== filters.status) return false;
      if (filters.channel !== 'all' && msg.channel !== filters.channel) return false;
      if (filters.messageType !== 'all' && msg.message_type !== filters.messageType) return false;
      return true;
    });
  }, [messages, filters]);

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
            total={messages.length}
            pending={pendingMessages.length}
            sent={sentMessages.length}
            failed={failedMessages.length}
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
