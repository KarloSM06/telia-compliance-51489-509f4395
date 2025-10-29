import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { MessageLog } from "@/hooks/useMessageLogs";

interface SMSTableProps {
  messages: MessageLog[];
  onViewDetails: (message: MessageLog) => void;
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    delivered: { label: "Levererad", variant: "default" as const, icon: CheckCircle },
    sent: { label: "Skickad", variant: "secondary" as const, icon: Clock },
    failed: { label: "Misslyckad", variant: "destructive" as const, icon: XCircle },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || { 
    label: status, 
    variant: "secondary" as const, 
    icon: Clock 
  };
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

export const SMSTable = ({ messages, onViewDetails }: SMSTableProps) => {
  if (messages.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Inga SMS-meddelanden att visa</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mottagare</TableHead>
            <TableHead>Meddelande</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Skickat</TableHead>
            <TableHead>Levererat</TableHead>
            <TableHead>Kostnad</TableHead>
            <TableHead className="text-right">Åtgärder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow key={message.id}>
              <TableCell>
                <p className="text-sm font-medium">{message.recipient}</p>
              </TableCell>
              <TableCell className="max-w-xs">
                <p className="truncate text-sm">
                  {message.message_body.substring(0, 50)}
                  {message.message_body.length > 50 ? '...' : ''}
                </p>
              </TableCell>
              <TableCell>{getStatusBadge(message.status)}</TableCell>
              <TableCell>
                <p className="text-sm">
                  {format(new Date(message.sent_at), "PPP HH:mm", { locale: sv })}
                </p>
              </TableCell>
              <TableCell>
                <p className="text-sm">
                  {message.delivered_at 
                    ? format(new Date(message.delivered_at), "PPP HH:mm", { locale: sv })
                    : '-'
                  }
                </p>
              </TableCell>
              <TableCell>
                <p className="text-sm">
                  {message.cost ? `${message.cost} SEK` : '-'}
                </p>
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
