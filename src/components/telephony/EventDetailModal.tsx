import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  formatDuration, 
  formatCost, 
  formatPhoneNumber, 
  formatFullTimestamp,
  getEventTypeLabel,
  getProviderLogo,
  getProviderDisplayName,
  getDirectionLabel,
  getStatusLabel,
  getStatusVariant,
} from '@/lib/telephonyFormatters';
import { Separator } from '@/components/ui/separator';

interface EventDetailModalProps {
  event: any;
  open: boolean;
  onClose: () => void;
}

export const EventDetailModal = ({ event, open, onClose }: EventDetailModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <img 
              src={getProviderLogo(event.provider)} 
              className="h-10 w-10 object-contain" 
              alt={event.provider}
            />
            <div>
              <DialogTitle>{getEventTypeLabel(event.event_type)}</DialogTitle>
              <p className="text-sm text-muted-foreground">
                {getProviderDisplayName(event.provider)}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status badges */}
          <div className="flex gap-2">
            <Badge>{getDirectionLabel(event.direction)}</Badge>
            <Badge variant={getStatusVariant(event.status)}>
              {getStatusLabel(event.status)}
            </Badge>
          </div>

          <Separator />

          {/* Call details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Från</p>
              <p className="font-medium">{formatPhoneNumber(event.from_number)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Till</p>
              <p className="font-medium">{formatPhoneNumber(event.to_number)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Längd</p>
              <p className="font-medium">{formatDuration(event.duration_seconds)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Kostnad</p>
              <p className="font-medium">{formatCost(event.cost_amount, event.cost_currency)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Tidpunkt</p>
              <p className="font-medium">{formatFullTimestamp(event.event_timestamp)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Provider Event ID</p>
              <code className="text-xs bg-muted px-2 py-1 rounded">{event.provider_event_id}</code>
            </div>
          </div>

          {/* Transcript */}
          {event.normalized?.transcript && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2">Transkription</p>
                <div className="bg-muted p-3 rounded text-sm max-h-60 overflow-y-auto whitespace-pre-wrap">
                  {event.normalized.transcript}
                </div>
              </div>
            </>
          )}

          {/* Recording */}
          {event.normalized?.recording_url && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2">Inspelning</p>
                <audio controls className="w-full">
                  <source src={event.normalized.recording_url} type="audio/mpeg" />
                  Din webbläsare stöder inte audio-uppspelning.
                </audio>
              </div>
            </>
          )}

          {/* Metadata */}
          {event.normalized?.metadata && Object.keys(event.normalized.metadata).length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2">Metadata</p>
                <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                  {JSON.stringify(event.normalized.metadata, null, 2)}
                </pre>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
