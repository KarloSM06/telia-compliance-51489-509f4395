import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAISettings } from "@/hooks/useAISettings";
import { useOpenRouterKeys } from "@/hooks/useOpenRouterKeys";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Check, Loader2, AlertCircle, Zap, BarChart3 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface OpenRouterSetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AVAILABLE_MODELS = [
  { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash (Rekommenderad)" },
  { id: "google/gemini-2.5-pro", name: "Gemini 2.5 Pro" },
  { id: "google/gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite" },
  { id: "openai/gpt-5", name: "GPT-5" },
  { id: "openai/gpt-5-mini", name: "GPT-5 Mini" },
  { id: "openai/gpt-5-nano", name: "GPT-5 Nano" },
];

export function OpenRouterSetupModal({ open, onOpenChange }: OpenRouterSetupModalProps) {
  const { settings, saveSettings, isSaving } = useAISettings();
  const { data: keyStatus, isLoading: keysLoading } = useOpenRouterKeys();
  const [apiKey, setApiKey] = useState("");
  const [provisioningKey, setProvisioningKey] = useState("");
  const [selectedModel, setSelectedModel] = useState(settings?.default_model || "google/gemini-2.5-flash");
  const [useFallback, setUseFallback] = useState(settings?.use_system_fallback ?? true);
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [showProvisioningKeyInput, setShowProvisioningKeyInput] = useState(false);

  const isConfigured = settings?.ai_provider === "openrouter" && settings?.openrouter_api_key_encrypted;

  // Reset inputs when opening modal
  useEffect(() => {
    if (open) {
      setApiKey("");
      setProvisioningKey("");
      setShowApiKeyInput(!keyStatus?.api_key_exists);
      setShowProvisioningKeyInput(!keyStatus?.provisioning_key_exists);
      setConnectionStatus(null);
    }
  }, [open, keyStatus]);

  const handleTestConnection = async () => {
    if (!apiKey) {
      toast.error("Ange en API-nyckel först");
      return;
    }

    setIsTesting(true);
    setConnectionStatus(null);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/models", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (response.ok) {
        setConnectionStatus({ type: "success", message: "Anslutningen lyckades! ✓" });
        toast.success("OpenRouter-anslutningen fungerar");
      } else {
        setConnectionStatus({ type: "error", message: "Anslutningen misslyckades. Kontrollera din API-nyckel." });
      }
    } catch (error) {
      setConnectionStatus({ type: "error", message: "Kunde inte ansluta till OpenRouter" });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    // If no new key provided and no existing key, require input
    if (!apiKey && !keyStatus?.api_key_exists) {
      toast.error("Ange en API-nyckel");
      return;
    }

    await saveSettings({
      provider: "openrouter",
      apiKey: apiKey || undefined,
      provisioningKey: provisioningKey || undefined,
      defaultModel: selectedModel,
      useFallback,
    });

    // Reset state and close
    setApiKey("");
    setProvisioningKey("");
    setShowApiKeyInput(false);
    setShowProvisioningKeyInput(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>OpenRouter Configuration</DialogTitle>
          <DialogDescription>
            Konfigurera dina OpenRouter-nycklar för AI-funktionalitet och usage-tracking
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {isConfigured && (
            <Alert>
              <Check className="h-4 w-4" />
              <AlertDescription>
                OpenRouter is currently configured and active
              </AlertDescription>
            </Alert>
          )}

          {/* Sektion 1: API Key */}
          <div className="space-y-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg">API Key (Obligatorisk)</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Används för att göra AI-anrop i hemsidans funktioner (chat, analys, klassificering, etc.)
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              {/* Key Status Display */}
              {keyStatus?.api_key_exists ? (
                <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded border border-green-200 dark:border-green-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="default" className="bg-green-600">✓ API Key sparad</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">
                        {keyStatus.api_key_masked}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                    >
                      {showApiKeyInput ? 'Avbryt' : 'Uppdatera'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded border border-amber-200 dark:border-amber-900">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-sm font-medium">⚠️ Ingen API Key sparad</span>
                  </div>
                </div>
              )}

              {/* Input Field */}
              {(showApiKeyInput || !keyStatus?.api_key_exists) && (
                <div className="space-y-2">
                  <Label htmlFor="api-key">
                    {keyStatus?.api_key_exists ? 'Ny API Key' : 'OpenRouter API Key'}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="api-key"
                      type="password"
                      placeholder="sk-or-v1-..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      disabled={isTesting || isSaving}
                      className="bg-background"
                    />
                    <Button
                      variant="outline"
                      onClick={handleTestConnection}
                      disabled={!apiKey || isTesting || isSaving}
                    >
                      {isTesting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Testing
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Test
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Hämta från{" "}
                    <a
                      href="https://openrouter.ai/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-foreground"
                    >
                      openrouter.ai/keys
                    </a>
                  </p>
                </div>
              )}
            </div>

            <div className="text-xs text-muted-foreground bg-background/50 p-3 rounded">
              <strong className="text-foreground">✅ Krävs för:</strong>
              <ul className="mt-1 space-y-0.5 ml-4 list-disc">
                <li>Chat assistant</li>
                <li>Lead enrichment</li>
                <li>Review analysis</li>
                <li>SMS classification</li>
                <li>Message generation</li>
              </ul>
            </div>
          </div>

          {/* Sektion 2: Provisioning Key */}
          <div className="space-y-4 p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
            <div className="flex items-start gap-3">
              <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg">Provisioning Key (Valfri)</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Används för att hämta aggregerad användningshistorik från OpenRouter och visa för dig
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              {/* Key Status Display */}
              {keyStatus?.provisioning_key_exists ? (
                <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded border border-green-200 dark:border-green-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="default" className="bg-green-600">✓ Provisioning Key sparad</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">
                        {keyStatus.provisioning_key_masked}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowProvisioningKeyInput(!showProvisioningKeyInput)}
                    >
                      {showProvisioningKeyInput ? 'Avbryt' : 'Uppdatera'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded border">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">ℹ️ Ingen Provisioning Key sparad</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Valfri - behövs endast för historik-tracking
                  </p>
                </div>
              )}

              {/* Input Field */}
              {(showProvisioningKeyInput || !keyStatus?.provisioning_key_exists) && (
                <div className="space-y-2">
                  <Label htmlFor="provisioning-key">
                    {keyStatus?.provisioning_key_exists ? 'Ny Provisioning Key' : 'Provisioning Key'}
                  </Label>
                  <Input
                    id="provisioning-key"
                    type="password"
                    placeholder="pk-or-..."
                    value={provisioningKey}
                    onChange={(e) => setProvisioningKey(e.target.value)}
                    disabled={isTesting || isSaving}
                    className="bg-background"
                  />
                  <p className="text-xs text-muted-foreground">
                    Hämta från{" "}
                    <a
                      href="https://openrouter.ai/settings/keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-foreground"
                    >
                      openrouter.ai/settings/keys
                    </a>
                  </p>
                </div>
              )}
            </div>

            <div className="text-xs text-muted-foreground bg-background/50 p-3 rounded">
              <strong className="text-foreground">✅ Låser upp:</strong>
              <ul className="mt-1 space-y-0.5 ml-4 list-disc">
                <li>Historisk användning från OpenRouter</li>
                <li>Daglig breakdown per modell</li>
                <li>Cost trend analysis</li>
              </ul>
            </div>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <Label htmlFor="model">Default Model</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger disabled={isTesting || isSaving}>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_MODELS.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose the default AI model for your requests
            </p>
          </div>

          {/* Fallback Option */}
          <div className="flex items-center space-x-2">
            <Switch
              id="fallback"
              checked={useFallback}
              onCheckedChange={setUseFallback}
              disabled={isTesting || isSaving}
            />
            <Label htmlFor="fallback" className="cursor-pointer">
              Fallback to Lovable AI if OpenRouter fails
            </Label>
          </div>

          {/* Förklaring */}
          <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-900">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm space-y-2">
                <p className="font-semibold text-amber-900 dark:text-amber-100">💡 Hur det fungerar:</p>
                <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-200">
                  <li>• <strong>API Key</strong> används när hemsidan anropar AI-modeller</li>
                  <li>• <strong>Provisioning Key</strong> används för att visa din användning i dashboard</li>
                  <li>• Båda nycklarna krypteras och lagras säkert i databasen</li>
                  <li>• Du kan använda bara API Key om du inte vill ha historik-tracking</li>
                </ul>
              </div>
            </div>
          </div>

          {connectionStatus && (
            <Alert variant={connectionStatus.type === "success" ? "default" : "destructive"}>
              {connectionStatus.type === "success" ? (
                <Check className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{connectionStatus.message}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Avbryt
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sparar...
              </>
            ) : (
              "Spara inställningar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
