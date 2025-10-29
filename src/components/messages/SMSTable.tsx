import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, XCircle, Clock, ArrowDown, ArrowUp, Star, Calendar, HelpCircle, MessageSquare, Bot, User, Zap } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { MessageLog } from "@/hooks/useMessageLogs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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

const getDirectionBadge = (direction?: string) => {
  if (!direction) return null;
  return direction === 'inbound' ? (
    <Badge variant="outline" className="gap-1.5 bg-primary/10 text-primary border-primary/20 font-medium">
      <ArrowDown className="h-3.5 w-3.5" />
      Inkommande
    </Badge>
  ) : (
    <Badge variant="outline" className="gap-1.5 bg-accent/50 text-accent-foreground border-accent/50 font-medium">
      <ArrowUp className="h-3.5 w-3.5" />
      Utgående
    </Badge>
  );
};

const getProviderLogo = (provider: string) => {
  const logos: Record<string, string> = {
    twilio: '/images/logos/twilio.png',
    telnyx: '/images/logos/telnyx.png',
  };
  return logos[provider.toLowerCase()] || null;
};

const getMessageTypeBadge = (type?: string) => {
  if (!type) return null;
  const config = {
    review: { label: "Omdöme", icon: Star, className: "bg-amber-500/10 text-amber-700 border-amber-200" },
    booking_request: { label: "Bokning", icon: Calendar, className: "bg-blue-500/10 text-blue-700 border-blue-200" },
    question: { label: "Fråga", icon: HelpCircle, className: "bg-purple-500/10 text-purple-700 border-purple-200" },
    general: { label: "Meddelande", icon: MessageSquare, className: "bg-gray-500/10 text-gray-700 border-gray-200" },
  };
  const item = config[type as keyof typeof config] || config.general;
  const Icon = item.icon;
  
  return (
    <Badge variant="outline" className={`gap-1 ${item.className}`}>
      <Icon className="h-3 w-3" />
      {item.label}
    </Badge>
  );
};

const getMessageSourceBadge = (source?: string) => {
  if (!source) return null;
  const config = {
    calendar_notification: { label: "Kalender", icon: Calendar, className: "bg-green-500/10 text-green-700 border-green-200" },
    ai_agent: { label: "AI-Agent", icon: Bot, className: "bg-indigo-500/10 text-indigo-700 border-indigo-200" },
    manual: { label: "Manuell", icon: User, className: "bg-gray-500/10 text-gray-700 border-gray-200" },
    webhook: { label: "Webhook", icon: Zap, className: "bg-orange-500/10 text-orange-700 border-orange-200" },
  };
  const item = config[source as keyof typeof config];
  if (!item) return null;
  const Icon = item.icon;
  
  return (
    <Badge variant="outline" className={`gap-1 ${item.className}`}>
      <Icon className="h-3 w-3" />
      {item.label}
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
    <div className="border rounded-lg overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Provider</TableHead>
            <TableHead className="font-semibold">Riktning</TableHead>
            <TableHead className="font-semibold">Från</TableHead>
            <TableHead className="font-semibold">Till</TableHead>
            <TableHead className="font-semibold min-w-[250px]">Meddelande</TableHead>
            <TableHead className="font-semibold">Typ/Källa</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Skickat</TableHead>
            <TableHead className="font-semibold">Levererat</TableHead>
            <TableHead className="font-semibold text-right">Kostnad</TableHead>
            <TableHead className="text-right font-semibold">Åtgärder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => {
            const providerLogo = getProviderLogo(message.provider);
            return (
              <TableRow key={message.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  {providerLogo ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={providerLogo} alt={message.provider} />
                      <AvatarFallback className="text-xs font-semibold">
                        {message.provider.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="text-xs font-medium text-muted-foreground uppercase">
                      {message.provider}
                    </div>
                  )}
                </TableCell>
                <TableCell>{getDirectionBadge(message.direction)}</TableCell>
                <TableCell>
                  <p className="text-sm font-medium font-mono text-foreground">
                    {message.metadata?.from || message.recipient}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-medium font-mono text-foreground">
                    {message.metadata?.to || '-'}
                  </p>
                </TableCell>
                <TableCell className="max-w-[300px]">
                  <p className="truncate text-sm text-foreground leading-relaxed">
                    {message.message_body.substring(0, 80)}
                    {message.message_body.length > 80 ? '...' : ''}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1.5">
                    {message.direction === 'inbound' && getMessageTypeBadge(message.message_type)}
                    {message.direction === 'outbound' && getMessageSourceBadge(message.message_source)}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(message.status)}</TableCell>
                <TableCell>
                  <p className="text-sm text-muted-foreground whitespace-nowrap">
                    {format(new Date(message.sent_at), "d MMM HH:mm", { locale: sv })}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-muted-foreground whitespace-nowrap">
                    {message.delivered_at 
                      ? format(new Date(message.delivered_at), "d MMM HH:mm", { locale: sv })
                      : '-'
                    }
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {message.cost ? `${message.cost.toFixed(2)} kr` : '-'}
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(message)}
                    className="hover:bg-primary/10"
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
