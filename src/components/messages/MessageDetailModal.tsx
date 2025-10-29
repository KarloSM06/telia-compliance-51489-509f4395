import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, Clock, CheckCircle, XCircle, Calendar } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { formatPhoneNumber } from "@/lib/telephonyFormatters";

interface MessageDetailModalProps {
  message: any | null;
  open: boolean;
  onClose: () => void;
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
        <ArrowDown className="h-4 w-4" />
        Inkommande
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="gap-1">
      <ArrowUp className="h-4 w-4" />
      Utgående
    </Badge>
  );
};

export const MessageDetailModal = ({ message, open, onClose }: MessageDetailModalProps) => {
  if (!message) return null;

  const normalized = message.normalized as any;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            SMS-detaljer
            {getDirectionBadge(normalized?.direction || 'unknown')}
            {getStatusBadge(normalized?.status || 'unknown')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Phone Numbers */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Telefonnummer</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Från</p>
                <p className="font-medium">{formatPhoneNumber(normalized?.from)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Till</p>
                <p className="font-medium">{formatPhoneNumber(normalized?.to)}</p>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Meddelande</h3>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{normalized?.body || '-'}</p>
            </div>
          </div>

          {/* Message Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Segment</p>
                <p className="font-medium">{normalized?.numSegments || 1}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Leverantör</p>
                <p className="font-medium capitalize">{message.provider}</p>
              </div>
              {message.cost_amount && (
                <div>
                  <p className="text-sm text-muted-foreground">Kostnad</p>
                  <p className="font-medium">{parseFloat(message.cost_amount).toFixed(2)} {message.cost_currency}</p>
                </div>
              )}
              {normalized?.messagingServiceSid && (
                <div>
                  <p className="text-sm text-muted-foreground">Service SID</p>
                  <p className="font-mono text-xs">{normalized.messagingServiceSid}</p>
                </div>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Tidsstämpel</h3>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(message.event_timestamp), "PPP 'kl.' HH:mm:ss", { locale: sv })}</span>
            </div>
          </div>

          {/* Error Message */}
          {normalized?.errorMessage && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-destructive">Felmeddelande</h3>
              <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                <p className="text-sm text-destructive">{normalized.errorMessage}</p>
                {normalized.errorCode && (
                  <p className="text-xs text-muted-foreground mt-1">Felkod: {normalized.errorCode}</p>
                )}
              </div>
            </div>
          )}

          {/* Raw Metadata */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground">Metadata</h3>
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
              {JSON.stringify(normalized, null, 2)}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
