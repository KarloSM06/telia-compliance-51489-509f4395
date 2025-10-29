import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, Key, RefreshCw, Eye, EyeOff, Info, Webhook } from 'lucide-react';
import { toast } from 'sonner';
import { useApiKeys } from '@/hooks/useApiKeys';
import { useIntegrations } from '@/hooks/useIntegrations';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const WebhookSettings = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const { apiKeys, isLoading, generateKey, isGenerating, deleteKey } = useApiKeys();
  const { integrations, getByCapability } = useIntegrations();
  const telephonyIntegrations = getByCapability('voice').concat(getByCapability('sms'));

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Webhook URL kopierad!');
  };

  const getIntegrationWebhookUrl = (integration: any) => {
    // Provider-specific webhook URLs
    const baseUrl = 'https://shskknkivuewuqonjdjc.supabase.co/functions/v1';
    
    switch (integration.provider) {
      case 'vapi':
        return `${baseUrl}/vapi-webhook?token=${integration.webhook_token}`;
      case 'retell':
        return `${baseUrl}/retell-webhook?token=${integration.webhook_token}`;
      case 'twilio':
        return `${baseUrl}/twilio-webhook?token=${integration.webhook_token}`;
      case 'telnyx':
        return `${baseUrl}/telnyx-webhook?token=${integration.webhook_token}`;
      default:
        return `${baseUrl}/user-webhook?token=${integration.webhook_token}`;
    }
  };

  const primaryApiKey = apiKeys?.[0];

  return (
    <div className="space-y-6">
      {/* API Key Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API-nyckel (valfritt)
          </CardTitle>
          <CardDescription>
            Skapa en API-nyckel endast om du behöver autentisera API-anrop till Hiems
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

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => generateKey('Telephony Integration')}
                  disabled={isGenerating}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generera ny nyckel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (confirm('Är du säker på att du vill ta bort denna API-nyckel?')) {
                      deleteKey(primaryApiKey.id);
                    }
                  }}
                >
                  Ta bort nyckel
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-4">
                Du har ingen API-nyckel. Webhook-integrationer fungerar utan API-nyckel.
              </p>
              <Button
                variant="outline"
                onClick={() => generateKey('Telephony Integration')}
                disabled={isGenerating}
              >
                <Key className="h-4 w-4 mr-2" />
                Skapa API-nyckel (valfritt)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Integration Webhook URLs Section */}
      {telephonyIntegrations && telephonyIntegrations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              Integration Webhook URLs
            </CardTitle>
            <CardDescription>
              Webhook URLs för varje integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {telephonyIntegrations.map((integration) => {
                const webhookUrl = integration.webhook_token 
                  ? getIntegrationWebhookUrl(integration)
                  : 'Webhook token saknas';
                
                return (
                  <div key={integration.id} className="space-y-2">
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border">
                      <div className="flex-shrink-0">
                        <img 
                          src={`/images/logos/${integration.provider}.png`} 
                          alt={integration.provider}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="font-semibold text-sm">{integration.provider_display_name}</div>
                          <Badge variant={integration.is_active ? "default" : "secondary"} className="text-xs">
                            {integration.is_active ? "Aktiv" : "Inaktiv"}
                          </Badge>
                        </div>
                        <code className="text-xs text-muted-foreground break-all block bg-background/50 p-2 rounded">
                          {webhookUrl}
                        </code>
                      </div>
                      {integration.webhook_token && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(webhookUrl)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <Alert>
              <Webhook className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Konfigurera webhook URL i varje provider:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong>Vapi:</strong> Dashboard → Settings → Webhooks</li>
                  <li><strong>Retell:</strong> Dashboard → Settings → Webhooks</li>
                  <li><strong>Twilio:</strong> Console → Phone Numbers → Configure</li>
                  <li><strong>Telnyx:</strong> Portal → Messaging → Settings</li>
                </ul>
                <p className="mt-2 text-xs">Varje integration har sin egen webhook URL för säkerhet.</p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
