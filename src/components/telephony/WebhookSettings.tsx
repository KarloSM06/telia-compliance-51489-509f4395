import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Key, RefreshCw, Eye, EyeOff, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useApiKeys } from '@/hooks/useApiKeys';
import { useTelephonyAccounts } from '@/hooks/useTelephonyAccounts';

export const WebhookSettings = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const { apiKeys, isLoading, generateKey, isGenerating } = useApiKeys();
  const { accounts } = useTelephonyAccounts();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} kopierad!`);
  };

  const getWebhookUrl = (provider: string, webhookToken: string) => {
    const baseUrl = 'https://shskknkivuewuqonjdjc.supabase.co/functions/v1';
    return `${baseUrl}/${provider}-webhook?token=${webhookToken}`;
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
                    onClick={() => copyToClipboard(primaryApiKey.api_key, 'API-nyckel')}
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

      {/* Webhook URLs Section */}
      {accounts && accounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Webhook-URLs</CardTitle>
            <CardDescription>
              Konfigurera dessa URLs i dina telefonileverantörers webhook-inställningar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {accounts.map(account => (
              <div key={account.id} className="space-y-3">
                <Label className="flex items-center gap-2">
                  <img 
                    src={`/images/logos/${account.provider}.png`}
                    alt={account.provider}
                    className="h-5 w-5 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {account.provider_display_name}
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={getWebhookUrl(account.provider, account.webhook_token)}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(
                      getWebhookUrl(account.provider, account.webhook_token),
                      `${account.provider} webhook-URL`
                    )}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-start gap-2 text-xs">
                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                    <div className="space-y-1 text-muted-foreground">
                      <p><strong>För {account.provider_display_name}:</strong></p>
                      {account.provider === 'vapi' && <p>Settings → Webhooks → Add URL</p>}
                      {account.provider === 'retell' && <p>Dashboard → Webhooks → Configure</p>}
                      {account.provider === 'twilio' && <p>Phone Numbers → Configure → Webhook URL</p>}
                      {account.provider === 'telnyx' && <p>Messaging → Webhooks → Add Webhook</p>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
