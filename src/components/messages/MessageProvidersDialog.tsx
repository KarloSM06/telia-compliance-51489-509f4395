import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Mail, TrendingUp } from 'lucide-react';

interface MessageProvidersDialogProps {
  open: boolean;
  onClose: () => void;
  providers: Array<{
    provider: string;
    count: number;
    cost: number;
  }>;
  type: 'sms' | 'email';
}

export const MessageProvidersDialog = ({
  open,
  onClose,
  providers,
  type,
}: MessageProvidersDialogProps) => {
  const Icon = type === 'sms' ? MessageSquare : Mail;
  const title = type === 'sms' ? 'SMS Leverantörer' : 'Email Leverantörer';
  const description = type === 'sms' 
    ? 'Översikt över dina SMS-leverantörer och användning'
    : 'Översikt över dina email-leverantörer och användning';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {providers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Inga leverantörer hittades</p>
            </div>
          ) : (
            providers.map((provider) => (
              <Card key={provider.provider}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold capitalize">{provider.provider}</h3>
                        <Badge variant="secondary">{provider.count} meddelanden</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Total kostnad: {provider.cost.toFixed(2)} SEK
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm">
                        ⌀ {(provider.cost / provider.count).toFixed(2)} SEK
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
