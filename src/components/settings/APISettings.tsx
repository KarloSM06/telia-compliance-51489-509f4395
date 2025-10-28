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
  
  // Single MCP webhook URL for all providers
  const mcpWebhookUrl = `https://${projectId}.supabase.co/functions/v1/user-webhook`;

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

        {/* Single MCP Webhook URL */}
        {accounts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Server Webhook URL</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              En universell webhook som fungerar för alla dina telephony providers (Vapi, Retell, Twilio, Telnyx)
            </p>
            
            <div className="space-y-3">
              {accounts.map((account) => {
                const fullUrl = `${mcpWebhookUrl}?token=${account.webhook_token}`;
                
                return (
                  <div key={account.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={`/images/logos/${account.provider}.png`} 
                          alt={account.provider_display_name}
                          className="w-6 h-6 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <span className="font-medium">{account.provider_display_name}</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(fullUrl, `${account.provider_display_name} webhook URL`)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Kopiera
                      </Button>
                    </div>
                    <code className="text-xs bg-muted px-2 py-1 rounded block overflow-x-auto">
                      {fullUrl}
                    </code>
                    <p className="text-xs text-muted-foreground">
                      Lägg till denna URL i <strong>{account.provider_display_name}</strong>-inställningarna för att ta emot händelser
                    </p>
                  </div>
                );
              })}
            </div>

            <Alert>
              <AlertDescription className="text-xs">
                <strong>Tips:</strong> Samma webhook URL fungerar för alla providers - systemet detekterar automatiskt vilken provider som skickar data.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
