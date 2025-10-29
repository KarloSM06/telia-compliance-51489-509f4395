import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Phone, Clock, DollarSign, User, MessageSquare, FileJson } from 'lucide-react';
import { toast } from 'sonner';
import { formatDuration, formatCost, formatFullTimestamp, getProviderDisplayName, getDirectionLabel } from '@/lib/telephonyFormatters';
import { useState } from 'react';

interface EventDetailDrawerProps {
  event: any;
  open: boolean;
  onClose: () => void;
}

export const EventDetailDrawer = ({ event, open, onClose }: EventDetailDrawerProps) => {
  const [showMetadata, setShowMetadata] = useState(false);

  if (!event) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} kopierad!`);
  };

  const conversation = event.normalized?.conversation || [];
  const messages = event.normalized?.messages || [];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Event #{event.id.slice(0, 8)}...
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-full pb-6">
          <div className="space-y-6 mt-6">
            {/* Header Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="text-sm">
                  {getProviderDisplayName(event.provider)}
                </Badge>
                <Badge variant="outline">{event.event_type}</Badge>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">{getDirectionLabel(event.direction)}</span>
              </div>
            </div>

            {/* Phone Numbers */}
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Från:</span>
                    <span className="font-mono text-sm">{event.from_number || '-'}</span>
                  </div>
                  {event.from_number && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(event.from_number, 'Telefonnummer')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Till:</span>
                    <span className="font-mono text-sm">{event.to_number || '-'}</span>
                  </div>
                  {event.to_number && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(event.to_number, 'Telefonnummer')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Längd</p>
                      <p className="text-lg font-semibold">
                        {formatDuration(event.duration_seconds)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Kostnad</p>
                      <p className="text-lg font-semibold">
                        {formatCost(event.cost_amount, event.cost_currency)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status & Timestamp */}
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge>{event.status || 'Okänd'}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tidstämpel:</span>
                  <span className="text-sm font-mono">
                    {formatFullTimestamp(event.event_timestamp)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Agent Info */}
            {event.agent_id && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Agent:</span>
                    </div>
                    <span className="text-sm font-mono">{event.agent_id.slice(0, 16)}...</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Conversation */}
            {conversation.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="h-4 w-4" />
                    <h3 className="font-semibold">Konversation</h3>
                  </div>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {conversation.map((msg: any, i: number) => (
                        <div
                          key={i}
                          className={`flex gap-2 ${
                            msg.role === 'assistant' ? 'justify-start' : 'justify-end'
                          }`}
                        >
                          <div
                            className={`flex-1 max-w-[85%] rounded-lg p-3 ${
                              msg.role === 'assistant'
                                ? 'bg-primary/10 text-primary-foreground'
                                : msg.role === 'user'
                                ? 'bg-secondary text-secondary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={msg.role === 'assistant' ? 'default' : 'secondary'} className="text-xs">
                                {msg.role === 'assistant' ? '🤖 Bot' : '👤 User'}
                              </Badge>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Recording URL */}
            {event.recording_url && (
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-2">Inspelning:</p>
                  <audio controls className="w-full">
                    <source src={event.recording_url} type="audio/mpeg" />
                    Din webbläsare stöder inte audio element.
                  </audio>
                </CardContent>
              </Card>
            )}

            {/* Metadata */}
            <Card>
              <CardContent className="p-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setShowMetadata(!showMetadata)}
                >
                  <FileJson className="h-4 w-4 mr-2" />
                  {showMetadata ? 'Dölj' : 'Visa'} Metadata
                </Button>
                {showMetadata && (
                  <pre className="mt-3 text-xs bg-muted p-3 rounded overflow-x-auto max-h-[300px]">
                    {JSON.stringify(event.normalized || event, null, 2)}
                  </pre>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
