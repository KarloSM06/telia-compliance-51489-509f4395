import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, Key, RefreshCw, Eye, EyeOff, Info, Webhook } from 'lucide-react';
import { toast } from 'sonner';
import { useApiKeys } from '@/hooks/useApiKeys';
import { useTelephonyAccounts } from '@/hooks/useTelephonyAccounts';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const WebhookSettings = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const { apiKeys, isLoading, generateKey, isGenerating } = useApiKeys();
  const { accounts } = useTelephonyAccounts();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Webhook URL kopierad!');
  };

  const getMcpWebhookUrl = (token: string) => {
    return `https://shskknkivuewuqonjdjc.supabase.co/functions/v1/user-webhook?token=${token}`;
  };

  const primaryApiKey = apiKeys?.[0];

  return (
    <div className="space-y-6">
      {/* API Key Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API-nyckel
          </CardTitle>
          <CardDescription>
            Använd denna nyckel för att autentisera API-anrop till Hiems
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Laddar...</p>
          ) : primaryApiKey ? (
            <div className="space-y-4">
              <div>
                <Label>Din API-nyckel</Label>
                <div className="flex gap-2 mt-2">
                  <div className="relative flex-1">
                    <Input
                      value={primaryApiKey.api_key}
                      type={showApiKey ? 'text' : 'password'}
                      readOnly
                      className="font-mono pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(primaryApiKey.api_key);
                      toast.success('API-nyckel kopierad!');
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Kopiera
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Skapad: {new Date(primaryApiKey.created_at).toLocaleString('sv-SE')}
                </p>
              </div>

              <Button
                variant="outline"
                onClick={() => generateKey('Telephony Integration')}
                disabled={isGenerating}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Generera ny nyckel
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-4">
                Du har ingen API-nyckel ännu
              </p>
              <Button
                onClick={() => generateKey('Telephony Integration')}
                disabled={isGenerating}
              >
                <Key className="h-4 w-4 mr-2" />
                Skapa API-nyckel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Server Webhook URL Section */}
      {accounts && accounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              Server Webhook URL
            </CardTitle>
            <CardDescription>
              En universell webhook för alla dina telephony providers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {accounts.map((account) => {
                const webhookUrl = getMcpWebhookUrl(account.webhook_token);
                
                return (
                  <div key={account.id} className="space-y-2">
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border">
                      <div className="flex-shrink-0">
                        <img 
                          src={`/images/logos/${account.provider}.png`} 
                          alt={account.provider}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="font-semibold text-sm">{account.provider_display_name}</div>
                          <Badge variant={account.is_active ? "default" : "secondary"} className="text-xs">
                            {account.is_active ? "Aktiv" : "Inaktiv"}
                          </Badge>
                        </div>
                        <code className="text-xs text-muted-foreground break-all block bg-background/50 p-2 rounded">
                          {webhookUrl}
                        </code>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(webhookUrl)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <Alert>
              <Webhook className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Konfigurera samma webhook URL i alla providers:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong>Vapi:</strong> Dashboard → Settings → Webhooks</li>
                  <li><strong>Retell:</strong> Dashboard → Settings → Webhooks</li>
                  <li><strong>Twilio:</strong> Console → Phone Numbers → Configure</li>
                  <li><strong>Telnyx:</strong> Portal → Messaging → Settings</li>
                </ul>
                <p className="mt-2 text-xs">Systemet detekterar automatiskt vilken provider som skickar data.</p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
