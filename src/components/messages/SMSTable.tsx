import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Eye, CheckCircle, XCircle, Clock, ArrowDown, ArrowUp, Star, Calendar, HelpCircle, MessageSquare, Bot, User, Zap, Bell } from "lucide-react";
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

const getDirectionBadge = (direction?: string) => {
  if (!direction) return null;
  return direction === 'inbound' ? (
    <Badge variant="outline" className="gap-1 bg-blue-500/10 text-blue-700 border-blue-200">
      <ArrowDown className="h-3 w-3" />
      Inkommande
    </Badge>
  ) : (
    <Badge variant="outline" className="gap-1 bg-green-500/10 text-green-700 border-green-200">
      <ArrowUp className="h-3 w-3" />
      Utgående
    </Badge>
  );
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

const getMessageSourceBadge = (message: any) => {
  // Identifiera påminnelser från scheduled_messages
  const isReminder = message.scheduled_message_id && 
                     (message.message_body?.includes('Påminnelse:') || 
                      message.message_body?.includes('påminnelse'));
  
  if (isReminder) {
    return (
      <Badge variant="outline" className="gap-1 bg-blue-500/10 text-blue-700 border-blue-200">
        <Bell className="h-3 w-3" />
        Påminnelse
      </Badge>
    );
  }
  
  const source = message.message_source;
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
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Provider</TableHead>
            <TableHead>Riktning</TableHead>
            <TableHead>Från</TableHead>
            <TableHead>Till</TableHead>
            <TableHead>Meddelande</TableHead>
            <TableHead>Typ/Källa</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Skickat</TableHead>
            <TableHead>Levererat</TableHead>
            <TableHead>Kostnad</TableHead>
            <TableHead className="text-right">Åtgärder</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => {
            const providerLogo = message.provider === 'twilio' 
              ? '/images/logos/twilio.png' 
              : message.provider === 'telnyx'
              ? '/images/logos/telnyx.png'
              : null;
            
            const providerName = message.provider === 'twilio' 
              ? 'Twilio' 
              : message.provider === 'telnyx'
              ? 'Telnyx'
              : message.provider?.toUpperCase() || 'N/A';

            return (
              <TableRow key={message.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      {providerLogo && <AvatarImage src={providerLogo} alt={providerName} />}
                      <AvatarFallback className="text-xs">
                        {providerName.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{providerName}</span>
                  </div>
                </TableCell>
                <TableCell>{getDirectionBadge(message.direction)}</TableCell>
            <TableCell>
              <p className="text-sm font-medium font-mono">
                {message.scheduled_message_id 
                  ? 'System (Påminnelse)' 
                  : message.metadata?.from || message.recipient}
              </p>
            </TableCell>
                <TableCell>
                  <p className="text-sm font-medium font-mono">
                    {message.recipient || message.metadata?.to || '-'}
                  </p>
                </TableCell>
                <TableCell className="max-w-xs">
                  <p className="truncate text-sm">
                    {message.message_body.substring(0, 50)}
                    {message.message_body.length > 50 ? '...' : ''}
                  </p>
                </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                {message.direction === 'inbound' && getMessageTypeBadge(message.message_type)}
                {/* Visa badge även om direction är NULL men scheduled_message_id finns */}
                {(message.direction === 'outbound' || message.scheduled_message_id) && getMessageSourceBadge(message)}
              </div>
            </TableCell>
                <TableCell>{getStatusBadge(message.status)}</TableCell>
                <TableCell>
                  <p className="text-sm">
                    {format(new Date(message.sent_at), "d MMM HH:mm", { locale: sv })}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm">
                    {message.delivered_at 
                      ? format(new Date(message.delivered_at), "d MMM HH:mm", { locale: sv })
                      : '-'
                    }
                  </p>
                </TableCell>
                <TableCell>
                  {typeof message.cost === 'number' ? (
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-medium">
                        {(message.cost * 10.5).toFixed(2)} SEK
                      </p>
                      <span className="text-xs text-muted-foreground">
                        (${message.cost.toFixed(4)} USD)
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm">-</p>
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
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
