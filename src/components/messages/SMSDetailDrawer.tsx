import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, MessageSquare, Phone, DollarSign, FileJson } from 'lucide-react';
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

  const getDirectionBadge = (direction: string) => {
    return direction === 'inbound' ? (
      <Badge variant="outline">Inkommande</Badge>
    ) : (
      <Badge variant="secondary">Utgående</Badge>
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
              <div className="flex items-center gap-2">
                {getStatusBadge(message.status)}
                {message.direction && getDirectionBadge(message.direction)}
                <Badge variant="outline">{message.channel}</Badge>
              </div>
            </div>

            {/* Phone Number */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Till:</span>
                    <span className="font-mono text-sm">{message.recipient_phone}</span>
                  </div>
                  {message.recipient_phone && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(message.recipient_phone, 'Telefonnummer')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Message Body */}
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-2">Meddelande:</p>
                <div className="text-sm whitespace-pre-wrap">{message.body}</div>
              </CardContent>
            </Card>

            {/* Cost */}
            {message.cost && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Kostnad</p>
                      <p className="text-lg font-semibold">{message.cost.toFixed(2)} SEK</p>
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
