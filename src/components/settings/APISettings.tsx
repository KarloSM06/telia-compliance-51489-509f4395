import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Code, Copy, Eye, EyeOff, Key, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useApiKeys } from "@/hooks/useApiKeys";
import { useTelephonyAccounts } from "@/hooks/useTelephonyAccounts";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function APISettings() {
  const { apiKeys, isLoading, generateKey, isGenerating } = useApiKeys();
  const { accounts } = useTelephonyAccounts();
  const [showKey, setShowKey] = useState(false);
  const [keyName, setKeyName] = useState("");

  const activeKey = apiKeys?.[0];
  const projectId = "shskknkivuewuqonjdjc";
  
  const webhookUrls = [
    { name: "Vapi", url: `https://${projectId}.supabase.co/functions/v1/vapi-webhook`, provider: "vapi" },
    { name: "Retell", url: `https://${projectId}.supabase.co/functions/v1/retell-webhook`, provider: "retell" },
    { name: "Twilio", url: `https://${projectId}.supabase.co/functions/v1/twilio-webhook`, provider: "twilio" },
    { name: "Telnyx", url: `https://${projectId}.supabase.co/functions/v1/telnyx-webhook`, provider: "telnyx" },
  ];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} kopierad!`);
  };

  const handleGenerateKey = () => {
    if (!keyName.trim()) {
      toast.error("Ange ett namn för API-nyckeln");
      return;
    }
    generateKey(keyName);
    setKeyName("");
  };

  const getAccountToken = (provider: string) => {
    const account = accounts.find(acc => acc.provider === provider && acc.is_active);
    return account?.webhook_token;
  };

  return (
    <Card className="hover-scale transition-all" style={{ animationDelay: '300ms' }}>
      <CardHeader className="animate-scale-in">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Code className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>API-nycklar & Webhooks</CardTitle>
            <CardDescription>
              Hantera dina API-nycklar och webhook-endpoints
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Security Warning */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Säkerhetsvarning:</strong> Dela aldrig dina API-nycklar eller webhook-tokens med andra. De ger full tillgång till ditt konto.
          </AlertDescription>
        </Alert>

        {/* API Key Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">Din API-nyckel</h3>
            {apiKeys && apiKeys.length > 0 && (
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                {apiKeys.length} aktiv{apiKeys.length !== 1 ? 'a' : ''}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="text-sm text-muted-foreground">Laddar...</div>
          ) : activeKey ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  type={showKey ? "text" : "password"}
                  value={activeKey.api_key}
                  readOnly
                  className="font-mono text-sm"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowKey(!showKey)}
                      >
                        {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {showKey ? "Dölj nyckel" : "Visa nyckel"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(activeKey.api_key, "API-nyckel")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Kopiera API-nyckel
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-xs text-muted-foreground">
                Nyckelnamn: <strong>{activeKey.key_name}</strong> · Skapad: {new Date(activeKey.created_at).toLocaleDateString('sv-SE')}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Du har ingen API-nyckel ännu. Skapa en för att komma igång.
                </AlertDescription>
              </Alert>
              <div className="flex gap-2">
                <Input
                  placeholder="Nyckelnamn (t.ex. 'Produktions-API')"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateKey()}
                />
                <Button
                  onClick={handleGenerateKey}
                  disabled={isGenerating || !keyName.trim()}
                >
                  {isGenerating ? "Genererar..." : "Generera"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Webhook URLs Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">Webhook-URLs</h3>
          </div>
          
          <div className="space-y-3">
            {webhookUrls.map((webhook) => {
              const token = getAccountToken(webhook.provider);
              const fullUrl = token ? `${webhook.url}?webhookToken=${token}` : webhook.url;
              const hasAccount = !!token;
              
              return (
                <div key={webhook.provider} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{webhook.name}</span>
                      {hasAccount ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(fullUrl, `${webhook.name} webhook`)}
                      disabled={!hasAccount}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Kopiera
                    </Button>
                  </div>
                  <code className="text-xs bg-muted px-2 py-1 rounded block overflow-x-auto">
                    {hasAccount ? fullUrl : `${webhook.url}?webhookToken=<DIN_TOKEN>`}
                  </code>
                  {!hasAccount && (
                    <p className="text-xs text-muted-foreground">
                      Konfigurera ett {webhook.name}-konto i Telefoni-sektionen först
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <Alert>
          <AlertDescription className="text-xs">
            <strong>Tips:</strong> Använd dessa webhook-URLs när du konfigurerar externa tjänster som Vapi, Retell, Twilio eller Telnyx. 
            Webhook-token inkluderas automatiskt som en URL-parameter för säker autentisering.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
