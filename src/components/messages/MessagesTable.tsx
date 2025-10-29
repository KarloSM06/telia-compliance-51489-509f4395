import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScheduledMessage } from "@/hooks/useScheduledMessages";
import { Mail, Phone, Eye, Clock, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface MessagesTableProps {
  messages: ScheduledMessage[];
  onViewDetails: (message: ScheduledMessage) => void;
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    pending: { label: "Väntande", variant: "secondary" as const, icon: Clock },
    sent: { label: "Skickad", variant: "default" as const, icon: CheckCircle },
    failed: { label: "Misslyckad", variant: "destructive" as const, icon: XCircle },
    cancelled: { label: "Avbruten", variant: "outline" as const, icon: XCircle },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

const getChannelIcon = (channel: string) => {
  if (channel === 'sms') return <Phone className="h-3 w-3" />;
  if (channel === 'email') return <Mail className="h-3 w-3" />;
  return (
    <div className="flex gap-1">
      <Phone className="h-3 w-3" />
      <Mail className="h-3 w-3" />
    </div>
  );
};

const getMessageTypeLabel = (type: string) => {
  const types = {
    booking_confirmation: "Bekräftelse",
    reminder: "Påminnelse",
    review_request: "Recension",
    cancellation: "Avbokning",
  };
  return types[type as keyof typeof types] || type;
};

export const MessagesTable = ({ messages, onViewDetails }: MessagesTableProps) => {
  if (messages.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Inga meddelanden att visa</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Typ</TableHead>
            <TableHead>Kanal</TableHead>
            <TableHead>Mottagare</TableHead>
            <TableHead>Meddelande</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Schemalagt för</TableHead>
            <TableHead>Skickat</TableHead>
            <TableHead className="text-right">Åtgärder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow key={message.id}>
              <TableCell className="font-medium">
                {getMessageTypeLabel(message.message_type)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {getChannelIcon(message.channel)}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{message.recipient_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {message.recipient_phone || message.recipient_email}
                  </p>
                </div>
              </TableCell>
              <TableCell className="max-w-xs">
                <p className="truncate text-sm">
                  {message.generated_message.substring(0, 50)}...
                </p>
              </TableCell>
              <TableCell>{getStatusBadge(message.status)}</TableCell>
              <TableCell>
                {format(new Date(message.scheduled_for), "PPP HH:mm", { locale: sv })}
              </TableCell>
              <TableCell>
                {message.sent_at ? (
                  format(new Date(message.sent_at), "PPP HH:mm", { locale: sv })
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(message)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
