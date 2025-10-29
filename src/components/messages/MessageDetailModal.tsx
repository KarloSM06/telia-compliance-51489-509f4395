import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScheduledMessage } from "@/hooks/useScheduledMessages";
import { Mail, Phone, Clock, CheckCircle, XCircle, Calendar } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface MessageDetailModalProps {
  message: ScheduledMessage | null;
  open: boolean;
  onClose: () => void;
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
  if (channel === 'sms') return <Phone className="h-4 w-4" />;
  if (channel === 'email') return <Mail className="h-4 w-4" />;
  return (
    <>
      <Phone className="h-4 w-4" />
      <Mail className="h-4 w-4" />
    </>
  );
};

const getMessageTypeLabel = (type: string) => {
  const types = {
    booking_confirmation: "Bokningsbekräftelse",
    reminder: "Påminnelse",
    review_request: "Recensionsförfrågan",
    cancellation: "Avbokning",
  };
  return types[type as keyof typeof types] || type;
};

export const MessageDetailModal = ({ message, open, onClose }: MessageDetailModalProps) => {
  if (!message) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Meddelandedetaljer
            {getStatusBadge(message.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Recipient Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Mottagare</h3>
            <div className="space-y-1">
              <p className="font-medium">{message.recipient_name}</p>
              {message.recipient_phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {message.recipient_phone}
                </div>
              )}
              {message.recipient_email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {message.recipient_email}
                </div>
              )}
            </div>
          </div>

          {/* Message Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Meddelandeinformation</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Typ</p>
                <p className="font-medium">{getMessageTypeLabel(message.message_type)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kanal</p>
                <div className="flex items-center gap-1 font-medium">
                  {getChannelIcon(message.channel)}
                  <span className="capitalize">{message.channel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Message Content */}
          {message.generated_subject && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Ämne</h3>
              <p className="text-sm">{message.generated_subject}</p>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Meddelande</h3>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{message.generated_message}</p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Tidsstämplar</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Schemalagt för</p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(message.scheduled_for), "PPP 'kl.' HH:mm", { locale: sv })}</span>
                </div>
              </div>
              {message.sent_at && (
                <div>
                  <p className="text-muted-foreground">Skickat</p>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>{format(new Date(message.sent_at), "PPP 'kl.' HH:mm", { locale: sv })}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Retry Info */}
          {message.retry_count > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Återförsök</h3>
              <p className="text-sm">
                {message.retry_count} av {message.max_retries} försök
              </p>
            </div>
          )}

          {/* Delivery Status */}
          {message.delivery_status && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Leveransstatus</h3>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                {JSON.stringify(message.delivery_status, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
