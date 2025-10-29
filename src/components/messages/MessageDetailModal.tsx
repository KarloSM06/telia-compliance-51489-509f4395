import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, Calendar, Mail as MailIcon, Eye, MousePointer } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { MessageLog } from "@/hooks/useMessageLogs";

interface MessageDetailModalProps {
  type: 'sms' | 'email';
  message: MessageLog | null;
  open: boolean;
  onClose: () => void;
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    delivered: { label: "Levererad", variant: "default" as const, icon: CheckCircle },
    sent: { label: "Skickad", variant: "secondary" as const, icon: Clock },
    failed: { label: "Misslyckad", variant: "destructive" as const, icon: XCircle },
    bounced: { label: "Studsad", variant: "destructive" as const, icon: MailIcon },
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

export const MessageDetailModal = ({ type, message, open, onClose }: MessageDetailModalProps) => {
  if (!message) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === 'sms' ? 'SMS-detaljer' : 'Email-detaljer'}
            {getStatusBadge(message.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Recipient */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">
              {type === 'sms' ? 'Telefonnummer' : 'Email-adress'}
            </h3>
            <div>
              <p className="text-sm text-muted-foreground">Mottagare</p>
              <p className="font-medium">{message.recipient}</p>
            </div>
          </div>

          {/* Subject (Email only) */}
          {type === 'email' && message.subject && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Ämne</h3>
              <p className="font-medium">{message.subject}</p>
            </div>
          )}

          {/* Message Content */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Meddelande</h3>
            <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
              <p className="text-sm whitespace-pre-wrap">{message.message_body}</p>
            </div>
          </div>

          {/* Message Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Kanal</p>
                <p className="font-medium capitalize">{message.channel}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Leverantör</p>
                <p className="font-medium capitalize">{message.provider}</p>
              </div>
              {message.cost && (
                <div>
                  <p className="text-sm text-muted-foreground">Kostnad</p>
                  <p className="font-medium">{message.cost} SEK</p>
                </div>
              )}
              {message.provider_message_id && (
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Provider Message ID</p>
                  <p className="font-mono text-xs">{message.provider_message_id}</p>
                </div>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Tidsstämplar</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <div>
                  <p className="text-xs text-muted-foreground">Skickat</p>
                  <span className="text-sm">{format(new Date(message.sent_at), "PPP 'kl.' HH:mm:ss", { locale: sv })}</span>
                </div>
              </div>
              {message.delivered_at && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <div>
                    <p className="text-xs text-muted-foreground">Levererat</p>
                    <span className="text-sm">{format(new Date(message.delivered_at), "PPP 'kl.' HH:mm:ss", { locale: sv })}</span>
                  </div>
                </div>
              )}
              {type === 'email' && message.opened_at && (
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Öppnat</p>
                    <span className="text-sm">{format(new Date(message.opened_at), "PPP 'kl.' HH:mm:ss", { locale: sv })}</span>
                  </div>
                </div>
              )}
              {type === 'email' && message.clicked_at && (
                <div className="flex items-center gap-2">
                  <MousePointer className="h-4 w-4 text-purple-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Klickat</p>
                    <span className="text-sm">{format(new Date(message.clicked_at), "PPP 'kl.' HH:mm:ss", { locale: sv })}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {message.error_message && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-destructive">Felmeddelande</h3>
              <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                <p className="text-sm text-destructive">{message.error_message}</p>
              </div>
            </div>
          )}

          {/* Raw Metadata */}
          {message.metadata && Object.keys(message.metadata).length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground">Metadata</h3>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                {JSON.stringify(message.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
