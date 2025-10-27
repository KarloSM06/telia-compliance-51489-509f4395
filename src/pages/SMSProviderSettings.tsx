import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSMSProviderSettings, SMSProvider, ProviderCredentials } from "@/hooks/useSMSProviderSettings";
import { CheckCircle2, AlertCircle, Loader2, Trash2, Info, MessageSquare, Shield, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { StatCard } from "@/components/communications/StatCard";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function SMSProviderSettings() {
  const { settings, isLoading, testProvider, isTestingProvider, saveSettings, isSavingSettings, deleteSettings } = useSMSProviderSettings();
  
  const [provider, setProvider] = useState<SMSProvider>(settings?.provider || 'twilio');
  const [credentials, setCredentials] = useState<ProviderCredentials>({});
  const [fromPhoneNumber, setFromPhoneNumber] = useState(settings?.from_phone_number || '');
  const [testPhoneNumber, setTestPhoneNumber] = useState('');
  const [webhookOpen, setWebhookOpen] = useState(false);

  const handleTest = () => {
    if (!testPhoneNumber) {
      alert('Ange ett telefonnummer att skicka test-SMS till');
      return;
    }
    testProvider({ provider, credentials, fromPhoneNumber, testPhoneNumber });
  };

  const handleSave = () => {
    if (!fromPhoneNumber) {
      alert('Ange från-nummer');
      return;
    }
    if (provider === 'twilio' && (!credentials.accountSid || !credentials.authToken)) {
      alert('Ange Twilio Account SID och Auth Token');
      return;
    }
    if (provider === 'telnyx' && !credentials.apiKey) {
      alert('Ange Telnyx API Key');
      return;
    }
    saveSettings({ provider, credentials, fromPhoneNumber });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Status Overview */}
      {settings && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            title="Provider" 
            value={settings.provider === 'twilio' ? 'Twilio' : 'Telnyx'} 
            icon={MessageSquare}
          />
          <StatCard 
            title="Status" 
            value={settings.is_verified ? 'Verifierad' : 'Ej verifierad'} 
            icon={settings.is_verified ? CheckCircle2 : AlertCircle}
          />
          <StatCard 
            title="Från-nummer" 
            value={settings.from_phone_number || 'N/A'} 
            icon={MessageSquare}
          />
        </div>
      )}

      {/* Success Alert */}
      {settings && (
        <Alert className="border-success/50 bg-success/5">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <AlertTitle>Konfiguration aktiv</AlertTitle>
          <AlertDescription>
            <div className="space-y-1 mt-2 text-sm">
              {settings.test_message_sent_at && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    Test skickat: {format(new Date(settings.test_message_sent_at), 'PPP HH:mm', { locale: sv })}
                  </Badge>
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Webhook Info - Collapsible */}
      {settings && (
        <Collapsible open={webhookOpen} onOpenChange={setWebhookOpen}>
          <Card>
            <CollapsibleTrigger className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    <CardTitle>Webhook-konfiguration</CardTitle>
                  </div>
                  <ExternalLink className="h-4 w-4" />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Konfigurera följande webhook URL i din {settings.provider === 'twilio' ? 'Twilio' : 'Telnyx'} dashboard
                  för att få realtidsuppdateringar om meddelandestatus:
                </p>
                <div className="p-3 bg-muted rounded-lg">
                  <code className="text-xs break-all">
                    https://shskknkivuewuqonjdjc.supabase.co/functions/v1/{settings.provider}-webhook
                  </code>
                </div>
                {settings.provider === 'twilio' && (
                  <p className="text-xs text-muted-foreground">
                    I Twilio Console: Phone Numbers → Din nummer → Messaging Configuration → 
                    "A MESSAGE COMES IN" webhook
                  </p>
                )}
                {settings.provider === 'telnyx' && (
                  <p className="text-xs text-muted-foreground">
                    I Telnyx Portal: Messaging → Messaging Profiles → Din profil → 
                    Webhooks → Add webhook URL
                  </p>
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Provider-konfiguration
          </CardTitle>
          <CardDescription>
            {settings ? 'Uppdatera' : 'Konfigurera'} ditt SMS-providerkonto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Provider Selection */}
          <div className="space-y-3">
            <Label>Välj SMS-leverantör</Label>
            <RadioGroup value={provider} onValueChange={(value) => setProvider(value as SMSProvider)}>
              <div className="grid grid-cols-2 gap-4">
                <Label htmlFor="twilio" className="cursor-pointer">
                  <Card className={provider === 'twilio' ? 'ring-2 ring-primary' : ''}>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="twilio" id="twilio" />
                        <div>
                          <div className="font-semibold">Twilio</div>
                          <div className="text-xs text-muted-foreground">Globalt, pålitligt</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Label>
                <Label htmlFor="telnyx" className="cursor-pointer">
                  <Card className={provider === 'telnyx' ? 'ring-2 ring-primary' : ''}>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="telnyx" id="telnyx" />
                        <div>
                          <div className="font-semibold">Telnyx</div>
                          <div className="text-xs text-muted-foreground">Flexibelt, kostnadseffektivt</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Provider-specific Credentials */}
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            {provider === 'twilio' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="accountSid">Account SID</Label>
                  <Input
                    id="accountSid"
                    type="text"
                    placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    value={credentials.accountSid || ''}
                    onChange={(e) => setCredentials({ ...credentials, accountSid: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="authToken">Auth Token</Label>
                  <Input
                    id="authToken"
                    type="password"
                    placeholder="••••••••••••••••••••••••••••••••"
                    value={credentials.authToken || ''}
                    onChange={(e) => setCredentials({ ...credentials, authToken: e.target.value })}
                  />
                </div>
              </>
            )}

            {provider === 'telnyx' && (
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="KEY••••••••••••••••••••••••••••••••"
                  value={credentials.apiKey || ''}
                  onChange={(e) => setCredentials({ ...credentials, apiKey: e.target.value })}
                />
              </div>
            )}
          </div>

          {/* Phone Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromPhone">Från-nummer</Label>
              <Input
                id="fromPhone"
                type="tel"
                placeholder="+46XXXXXXXXX"
                value={fromPhoneNumber}
                onChange={(e) => setFromPhoneNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Telefonnumret som SMS kommer skickas från
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="testPhone">Test-nummer</Label>
              <Input
                id="testPhone"
                type="tel"
                placeholder="+46XXXXXXXXX"
                value={testPhoneNumber}
                onChange={(e) => setTestPhoneNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                För att verifiera konfigurationen
              </p>
            </div>
          </div>

          {/* Security Note */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Dina autentiseringsuppgifter krypteras säkert innan de sparas i databasen.
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <Button onClick={handleTest} disabled={isTestingProvider} variant="outline">
              {isTestingProvider && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Testa konfiguration
            </Button>
            <Button onClick={handleSave} disabled={isSavingSettings} size="lg">
              {isSavingSettings && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Spara inställningar
            </Button>
            {settings && (
              <Button onClick={() => deleteSettings()} variant="destructive" className="ml-auto">
                <Trash2 className="mr-2 h-4 w-4" />
                Ta bort
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
