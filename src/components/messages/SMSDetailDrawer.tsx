import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, MessageSquare, Phone, DollarSign, FileJson, Sparkles, ArrowDown, ArrowUp, Star, Calendar as CalendarIcon, HelpCircle, Bot, User, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { useState } from 'react';

interface SMSDetailDrawerProps {
  message: any;
  open: boolean;
  onClose: () => void;
}

export const SMSDetailDrawer = ({ message, open, onClose }: SMSDetailDrawerProps) => {
  const [showMetadata, setShowMetadata] = useState(false);

  if (!message) return null;

  const currency = (message.metadata?.cost_currency || 'SEK').toUpperCase();
  const displaySek = typeof message.cost === 'number' ? (currency === 'USD' ? message.cost * 10.5 : message.cost) : null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} kopierad`);
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <Badge variant="default">Levererad</Badge>;
      case 'sent':
        return <Badge variant="secondary">Skickad</Badge>;
      case 'pending':
        return <Badge variant="outline">Väntande</Badge>;
      case 'failed':
        return <Badge variant="destructive">Misslyckad</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
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
      booking_request: { label: "Bokning", icon: CalendarIcon, className: "bg-blue-500/10 text-blue-700 border-blue-200" },
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
      calendar_notification: { label: "Kalender", icon: CalendarIcon, className: "bg-green-500/10 text-green-700 border-green-200" },
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

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            SMS #{message.id.slice(0, 8)}...
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-full pb-6">
          <div className="space-y-6 mt-6">
            {/* Header Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                {getDirectionBadge(message.direction)}
                {getStatusBadge(message.status)}
                {message.provider && <Badge variant="outline">{message.provider}</Badge>}
                <Badge variant="outline">{message.channel}</Badge>
              </div>
            </div>

            {/* Phone Numbers - FROM and TO */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Från:</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {message.metadata?.from || message.recipient || '-'}
                      </code>
                      {(message.metadata?.from || message.recipient) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(message.metadata?.from || message.recipient, 'Från-nummer')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Till:</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {message.metadata?.to || '-'}
                      </code>
                      {message.metadata?.to && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(message.metadata?.to, 'Till-nummer')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {message.direction === 'inbound' && message.metadata?.to && (
                    <p className="text-xs text-muted-foreground pt-2 border-t">
                      ℹ️ Detta är ett inkommande SMS till ditt nummer ({message.metadata.to})
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Message Body */}
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-2">Meddelande:</p>
                <div className="text-sm whitespace-pre-wrap">{message.message_body}</div>
              </CardContent>
            </Card>

            {/* AI Classification (för inkommande) */}
            {message.direction === 'inbound' && message.ai_classification && (
              <Card className="border-purple-200 bg-purple-50/50">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">AI-Klassificering</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Typ:</span>
                        {getMessageTypeBadge(message.message_type)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Säkerhet:</span>
                        <Badge variant="outline">
                          {(message.ai_classification.confidence * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Sentiment:</span>
                        <Badge variant={
                          message.ai_classification.sentiment === 'positive' ? 'default' :
                          message.ai_classification.sentiment === 'negative' ? 'destructive' :
                          'secondary'
                        }>
                          {message.ai_classification.sentiment === 'positive' ? '😊 Positiv' :
                           message.ai_classification.sentiment === 'negative' ? '😞 Negativ' :
                           '😐 Neutral'}
                        </Badge>
                      </div>
                      {message.ai_classification.reasoning && (
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground italic">
                            {message.ai_classification.reasoning}
                          </p>
                        </div>
                      )}
                      {message.ai_classification.keywords && message.ai_classification.keywords.length > 0 && (
                        <div className="pt-2 border-t">
                          <span className="text-xs text-muted-foreground">Nyckelord:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {message.ai_classification.keywords.map((keyword: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Message Source (för utgående) */}
            {message.direction === 'outbound' && message.message_source && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Källa:</span>
                    {getMessageSourceBadge(message.message_source)}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cost */}
            {typeof message.cost === 'number' && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Kostnad</p>
                      <p className="text-lg font-semibold">{displaySek?.toFixed(3)} SEK</p>
                      {currency === 'USD' && (
                        <p className="text-xs text-muted-foreground">({message.cost.toFixed(4)} USD)</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timestamps */}
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Skickat:</span>
                  <span className="text-sm font-mono">
                    {message.sent_at ? format(new Date(message.sent_at), 'PPP HH:mm', { locale: sv }) : '-'}
                  </span>
                </div>
                {message.delivered_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Levererat:</span>
                    <span className="text-sm font-mono">
                      {format(new Date(message.delivered_at), 'PPP HH:mm', { locale: sv })}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Error Message */}
            {message.error_message && (
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-2">Felmeddelande:</p>
                  <p className="text-sm text-destructive">{message.error_message}</p>
                </CardContent>
              </Card>
            )}

            {/* Provider Info */}
            {message.provider && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Leverantör:</span>
                    <Badge variant="outline">{message.provider}</Badge>
                  </div>
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
                    {JSON.stringify(message, null, 2)}
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
