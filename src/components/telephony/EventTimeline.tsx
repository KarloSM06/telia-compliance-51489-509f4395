import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, Clock, DollarSign, Eye } from 'lucide-react';
import { 
  formatDuration, 
  formatRelativeTime, 
  formatCost, 
  getEventTypeLabel,
  getProviderLogo,
  getDirectionLabel,
  getDirectionBadgeVariant,
  getStatusVariant,
  getStatusLabel,
  formatPhoneNumber,
} from '@/lib/telephonyFormatters';
import { EventDetailModal } from './EventDetailModal';

export const EventTimeline = ({ events }: { events: any[] }) => {
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const toggleExpand = (eventId: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  if (events.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">Inga händelser ännu</p>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {events.map(event => {
          const isExpanded = expandedEvents.has(event.id);
          
          return (
            <Card 
              key={event.id} 
              className="hover:shadow-lg transition-all cursor-pointer"
              onClick={() => toggleExpand(event.id)}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <img 
                    src={getProviderLogo(event.provider)} 
                    className="h-8 w-8 object-contain" 
                    alt={event.provider}
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant={getDirectionBadgeVariant(event.direction)}>
                        {getDirectionLabel(event.direction)}
                      </Badge>
                      <Badge variant="outline">
                        {getEventTypeLabel(event.event_type)}
                      </Badge>
                      <Badge variant={getStatusVariant(event.status)}>
                        {getStatusLabel(event.status)}
                      </Badge>
                    </div>
                    <p className="text-sm">
                      {formatPhoneNumber(event.from_number)} → {formatPhoneNumber(event.to_number)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm">
                  {event.duration_seconds > 0 && (
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(event.duration_seconds)}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{formatCost(event.cost_amount, event.cost_currency)}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {formatRelativeTime(event.event_timestamp)}
                  </span>
                  <ChevronDown 
                    className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                  />
                </div>
              </div>

              {isExpanded && (
                <div className="border-t p-4 space-y-4 bg-muted/20">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Provider ID</p>
                      <code className="text-xs">{event.provider_event_id}</code>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tidsstämpel</p>
                      <p className="text-sm">{new Date(event.event_timestamp).toLocaleString('sv-SE')}</p>
                    </div>
                  </div>

                  {event.normalized?.transcript && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Transkription (förhandsvisning)</p>
                      <div className="bg-background p-3 rounded border text-sm max-h-40 overflow-y-auto">
                        {event.normalized.transcript.substring(0, 200)}...
                      </div>
                    </div>
                  )}

                  {event.normalized?.recording_url && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Inspelning</p>
                      <audio controls className="w-full">
                        <source src={event.normalized.recording_url} type="audio/mpeg" />
                      </audio>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(event);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Visa detaljer
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          open={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
};
