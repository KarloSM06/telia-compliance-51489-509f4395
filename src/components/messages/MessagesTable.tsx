import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { formatPhoneNumber } from "@/lib/telephonyFormatters";

interface MessagesTableProps {
  messages: any[];
  onViewDetails: (message: any) => void;
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    delivered: { label: "Levererad", variant: "default" as const, icon: CheckCircle },
    sent: { label: "Skickad", variant: "secondary" as const, icon: Clock },
    failed: { label: "Misslyckad", variant: "destructive" as const, icon: XCircle },
    undelivered: { label: "Ej levererad", variant: "destructive" as const, icon: XCircle },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: "secondary" as const, icon: Clock };
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

const getDirectionBadge = (direction: string) => {
  if (direction === 'inbound') {
    return (
      <Badge variant="default" className="gap-1">
        <ArrowDown className="h-3 w-3" />
        Inkommande
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="gap-1">
      <ArrowUp className="h-3 w-3" />
      Utgående
    </Badge>
  );
};

export const MessagesTable = ({ messages, onViewDetails }: MessagesTableProps) => {
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
            <TableHead>Riktning</TableHead>
            <TableHead>Från</TableHead>
            <TableHead>Till</TableHead>
            <TableHead>Meddelande</TableHead>
            <TableHead>Segment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Kostnad</TableHead>
            <TableHead>Tidpunkt</TableHead>
            <TableHead className="text-right">Åtgärder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => {
            const normalized = message.normalized as any;
            return (
              <TableRow key={message.id}>
                <TableCell>
                  {getDirectionBadge(normalized?.direction || 'unknown')}
                </TableCell>
                <TableCell>
                  <p className="text-sm">{formatPhoneNumber(normalized?.from)}</p>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{formatPhoneNumber(normalized?.to)}</p>
                </TableCell>
                <TableCell className="max-w-xs">
                  <p className="truncate text-sm">
                    {normalized?.body ? normalized.body.substring(0, 50) + (normalized.body.length > 50 ? '...' : '') : '-'}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{normalized?.numSegments || 1}</Badge>
                </TableCell>
                <TableCell>{getStatusBadge(normalized?.status || 'unknown')}</TableCell>
                <TableCell>
                  <p className="text-sm">{message.cost_amount ? `${parseFloat(message.cost_amount).toFixed(2)} ${message.cost_currency}` : '-'}</p>
                </TableCell>
                <TableCell>
                  {format(new Date(message.event_timestamp), "PPP HH:mm", { locale: sv })}
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
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
