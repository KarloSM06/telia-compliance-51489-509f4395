import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code, Copy, Eye, EyeOff, Key, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useApiKeys } from "@/hooks/useApiKeys";
import { useUserWebhook } from "@/hooks/useUserWebhook";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function APISettings() {
  const { apiKeys, isLoading, generateKey, isGenerating } = useApiKeys();
  const { webhookUrl, isLoading: webhookLoading } = useUserWebhook();
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

        {/* Single Universal Webhook URL */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">Universal Webhook URL</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            En webhook som fungerar för ALLA dina telephony providers (Vapi, Retell, Twilio, Telnyx)
          </p>
          
          {webhookLoading ? (
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Laddar webhook URL...</p>
            </div>
          ) : webhookUrl ? (
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Din Webhook är redo</span>
              </div>
              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <div className="flex gap-2">
                  <Input
                    value={webhookUrl}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(webhookUrl, "Webhook URL")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Alert>
                <AlertDescription className="text-xs">
                  Använd denna URL i alla dina telephony providers. Systemet detekterar automatiskt vilken provider som skickar data.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Lägg till din första provider</span>
              </div>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Din webhook URL genereras automatiskt när du lägger till din första telephony provider på <strong>Telefoni-sidan</strong>.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
