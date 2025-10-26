import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSMSProviderSettings, SMSProvider, ProviderCredentials } from "@/hooks/useSMSProviderSettings";
import { CheckCircle2, AlertCircle, Loader2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

export default function SMSProviderSettings() {
  const { settings, isLoading, testProvider, isTestingProvider, saveSettings, isSavingSettings, deleteSettings } = useSMSProviderSettings();
  
  const [provider, setProvider] = useState<SMSProvider>(settings?.provider || 'twilio');
  const [credentials, setCredentials] = useState<ProviderCredentials>({});
  const [fromPhoneNumber, setFromPhoneNumber] = useState(settings?.from_phone_number || '');
  const [testPhoneNumber, setTestPhoneNumber] = useState('');

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
      <div className="p-8 max-w-4xl mx-auto flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">SMS-leverantör inställningar</h1>
        <p className="text-muted-foreground">
          Konfigurera ditt eget Twilio eller Telnyx-konto för att skicka SMS-påminnelser
        </p>
      </div>

      {settings && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            <div className="font-medium mb-1">
              {settings.provider === 'twilio' ? 'Twilio' : 'Telnyx'} konfigurerad
            </div>
            <div className="text-sm space-y-1">
              <div>Från-nummer: {settings.from_phone_number}</div>
              <div>Status: {settings.is_verified ? 'Verifierad' : 'Ej verifierad'}</div>
              {settings.test_message_sent_at && (
                <div>
                  Test skickat: {format(new Date(settings.test_message_sent_at), 'PPP HH:mm', { locale: sv })}
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Provider-konfiguration</CardTitle>
          <CardDescription>
            Välj SMS-leverantör och ange dina autentiseringsuppgifter
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Välj SMS-leverantör</Label>
            <RadioGroup value={provider} onValueChange={(value) => setProvider(value as SMSProvider)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="twilio" id="twilio" />
                <Label htmlFor="twilio" className="cursor-pointer">Twilio</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="telnyx" id="telnyx" />
                <Label htmlFor="telnyx" className="cursor-pointer">Telnyx</Label>
              </div>
            </RadioGroup>
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="fromPhone">Från-nummer</Label>
            <Input
              id="fromPhone"
              type="tel"
              placeholder="+46XXXXXXXXX"
              value={fromPhoneNumber}
              onChange={(e) => setFromPhoneNumber(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Telefonnumret som SMS kommer skickas från (internationellt format)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="testPhone">Test-nummer (för att verifiera konfigurationen)</Label>
            <Input
              id="testPhone"
              type="tel"
              placeholder="+46XXXXXXXXX"
              value={testPhoneNumber}
              onChange={(e) => setTestPhoneNumber(e.target.value)}
            />
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Dina autentiseringsuppgifter krypteras säkert innan de sparas i databasen.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button onClick={handleTest} disabled={isTestingProvider} variant="outline">
              {isTestingProvider && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Testa konfiguration
            </Button>
            <Button onClick={handleSave} disabled={isSavingSettings}>
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
