import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy, Mail, Clock, User, FileJson } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { useState } from 'react';

interface EmailDetailDrawerProps {
  message: any;
  open: boolean;
  onClose: () => void;
}

export const EmailDetailDrawer = ({ message, open, onClose }: EmailDetailDrawerProps) => {
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
      case 'failed':
        return <Badge variant="destructive">Misslyckad</Badge>;
      case 'bounced':
        return <Badge variant="outline">Studsad</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email #{message.id.slice(0, 8)}...
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-full pb-6">
          <div className="space-y-6 mt-6">
            {/* Header Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {getStatusBadge(message.status)}
                <Badge variant="outline">{message.channel}</Badge>
              </div>
            </div>

            {/* Recipient */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Till:</span>
                    <span className="text-sm">{message.recipient}</span>
                  </div>
                  {message.recipient && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(message.recipient, 'Mottagare')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Subject */}
            {message.subject && (
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-2">Ämne:</p>
                  <p className="text-sm font-medium">{message.subject}</p>
                </CardContent>
              </Card>
            )}

            {/* Message Body */}
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-2">Meddelande:</p>
                <div className="text-sm whitespace-pre-wrap">{message.message_body}</div>
              </CardContent>
            </Card>

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
                {message.opened_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Öppnat:</span>
                    <span className="text-sm font-mono">
                      {format(new Date(message.opened_at), 'PPP HH:mm', { locale: sv })}
                    </span>
                  </div>
                )}
                {message.clicked_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Klickat:</span>
                    <span className="text-sm font-mono">
                      {format(new Date(message.clicked_at), 'PPP HH:mm', { locale: sv })}
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
