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
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Bot, MessageSquare, User } from 'lucide-react';

interface EventDetailModalProps {
  event: any;
  open: boolean;
  onClose: () => void;
}

export const EventDetailModal = ({ event, open, onClose }: EventDetailModalProps) => {
  // Fetch agent info if available
  const { data: agent } = useQuery({
    queryKey: ['agent', event?.agent_id],
    queryFn: async () => {
      if (!event?.agent_id) return null;
      const { data } = await supabase
        .from('agents')
        .select('*')
        .eq('id', event.agent_id)
        .single();
      return data;
    },
    enabled: !!event?.agent_id && open,
  });

  // Fetch call events for granular conversation flow
  const { data: callEvents } = useQuery({
    queryKey: ['call-events', event?.id],
    queryFn: async () => {
      if (!event?.id || !event.event_type.includes('call')) return [];
      const { data } = await supabase
        .from('call_events')
        .select('*')
        .eq('call_id', event.id)
        .order('timestamp', { ascending: true });
      return data || [];
    },
    enabled: !!event?.id && open,
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
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

          {/* Agent info */}
          {agent && (
            <>
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="h-4 w-4" />
                  <p className="text-sm font-medium">Voice Agent</p>
                </div>
                <p className="font-medium">{agent.name}</p>
                <p className="text-xs text-muted-foreground">
                  {agent.provider_agent_id}
                </p>
                {(agent.config as any)?.voice_id && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Voice: {(agent.config as any).voice_id}
                  </p>
                )}
              </div>
              <Separator />
            </>
          )}

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

          {/* Conversation Flow */}
          {callEvents && callEvents.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-3">Konversationsflöde</p>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {callEvents.map((evt: any) => (
                    <div 
                      key={evt.id}
                      className={`flex gap-3 p-3 rounded-lg ${
                        evt.event_type === 'user_speech' ? 'bg-blue-500/10' : 'bg-green-500/10'
                      }`}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {evt.event_type === 'user_speech' ? (
                          <User className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Bot className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium">
                            {evt.event_type === 'user_speech' ? 'Kund' : 'Agent'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(evt.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        {evt.text && (
                          <p className="text-sm">{evt.text}</p>
                        )}
                        {evt.audio_url && (
                          <audio controls className="w-full h-8 mt-2">
                            <source src={evt.audio_url} type="audio/mpeg" />
                          </audio>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Full Transcript */}
          {event.normalized?.transcript && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2">Full Transkription</p>
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
