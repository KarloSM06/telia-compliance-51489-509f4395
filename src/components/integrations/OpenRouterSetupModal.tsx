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
import { Check, Loader2, AlertCircle, Zap, BarChart3, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface OpenRouterSetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TestResult {
  status: 'success' | 'error' | 'skipped';
  data?: any;
  error?: string;
  duration?: number;
}

interface TestResults {
  aiCall?: TestResult;
  credits?: TestResult;
  keyInfo?: TestResult;
  models?: TestResult;
  activity?: TestResult;
}

const OPENROUTER_MODELS = [
  { value: 'anthropic/claude-sonnet-4-5', label: 'Claude Sonnet 4.5 (Bäst reasoning)', cost: '$$$' },
  { value: 'anthropic/claude-opus-4-1', label: 'Claude Opus 4.1 (Mest intelligent)', cost: '$$$$' },
  { value: 'openai/gpt-5', label: 'GPT-5 (Kraftfull)', cost: '$$$' },
  { value: 'openai/gpt-5-mini', label: 'GPT-5 Mini (Balanserad)', cost: '$$' },
  { value: 'google/gemini-2.5-pro', label: 'Gemini 2.5 Pro (Multimodal)', cost: '$$' },
  { value: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash (Snabb)', cost: '$' },
  { value: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B', cost: '$' },
  { value: 'mistralai/mistral-large-2411', label: 'Mistral Large', cost: '$$' },
];

export function OpenRouterSetupModal({ open, onOpenChange }: OpenRouterSetupModalProps) {
  const { settings, saveSettings, isSaving } = useAISettings();
  const { data: keyStatus, isLoading: keysLoading } = useOpenRouterKeys();
  const [apiKey, setApiKey] = useState("");
  const [provisioningKey, setProvisioningKey] = useState("");
  const [defaultModel, setDefaultModel] = useState(settings?.default_model || "google/gemini-2.5-flash");
  const [chatModel, setChatModel] = useState(settings?.chat_model ?? 'use_default');
  const [enrichmentModel, setEnrichmentModel] = useState(settings?.enrichment_model ?? 'use_default');
  const [analysisModel, setAnalysisModel] = useState(settings?.analysis_model ?? 'use_default');
  const [useFallback, setUseFallback] = useState(settings?.use_system_fallback ?? true);
  const [isTesting, setIsTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [showProvisioningKeyInput, setShowProvisioningKeyInput] = useState(false);
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [showTestResults, setShowTestResults] = useState(false);

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

  const handleFullTest = async () => {
    setIsTesting(true);
    setShowTestResults(true);
    const results: TestResults = {};

    // Test 1: AI Call
    try {
      const startTime = Date.now();
      const { data, error } = await supabase.functions.invoke('submit-prompt', {
        body: { 
          messages: [{ role: 'user', content: 'Säg "Test OK" om du får detta meddelande.' }],
          use_case: 'test'
        }
      });
      const duration = Date.now() - startTime;

      if (error) throw error;
      results.aiCall = { status: 'success', data, duration };
    } catch (error: any) {
      results.aiCall = { status: 'error', error: error.message };
    }

    // Test 2: Credits
    try {
      const startTime = Date.now();
      const { data, error } = await supabase.functions.invoke('get-openrouter-credits');
      const duration = Date.now() - startTime;

      if (error) throw error;
      results.credits = { status: 'success', data, duration };
    } catch (error: any) {
      results.credits = { status: 'error', error: error.message };
    }

    // Test 3: Key Info
    try {
      const startTime = Date.now();
      const { data, error } = await supabase.functions.invoke('get-openrouter-key-info');
      const duration = Date.now() - startTime;

      if (error) throw error;
      results.keyInfo = { status: 'success', data, duration };
    } catch (error: any) {
      results.keyInfo = { status: 'error', error: error.message };
    }

    // Test 4: Models
    try {
      const startTime = Date.now();
      const { data, error } = await supabase.functions.invoke('get-openrouter-models');
      const duration = Date.now() - startTime;

      if (error) throw error;
      results.models = { status: 'success', data, duration };
    } catch (error: any) {
      results.models = { status: 'error', error: error.message };
    }

    // Test 5: Activity (only if provisioning key exists)
    if (keyStatus?.provisioning_key_exists || provisioningKey) {
      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        const startTime = Date.now();
        const { data, error } = await supabase.functions.invoke('get-openrouter-activity', {
          body: {
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0],
          }
        });
        const duration = Date.now() - startTime;

        if (error) throw error;
        results.activity = { status: 'success', data, duration };
      } catch (error: any) {
        results.activity = { status: 'error', error: error.message };
      }
    } else {
      results.activity = { status: 'skipped', error: 'Ingen provisioning key konfigurerad' };
    }

    setTestResults(results);
    setIsTesting(false);

    // Show summary toast
    const successCount = Object.values(results).filter(r => r?.status === 'success').length;
    const errorCount = Object.values(results).filter(r => r?.status === 'error').length;
    
    if (errorCount === 0) {
      toast.success(`Alla tester lyckades! (${successCount}/${Object.keys(results).length})`);
    } else {
      toast.warning(`${successCount} tester lyckades, ${errorCount} misslyckades`);
    }
  };

  const handleSave = async () => {
    console.log('💾 Saving AI settings:', {
      hasNewApiKey: !!apiKey,
      hasNewProvisioningKey: !!provisioningKey,
      existingApiKey: !!keyStatus?.api_key_exists,
      existingProvisioningKey: !!keyStatus?.provisioning_key_exists,
      defaultModel,
    });

    if (!apiKey && !keyStatus?.api_key_exists) {
      toast.error("Ange en API-nyckel");
      return;
    }

    try {
      await saveSettings({
        provider: "openrouter",
        apiKey: apiKey || undefined,
        provisioningKey: provisioningKey || undefined,
        defaultModel,
        chatModel: chatModel === 'use_default' ? undefined : chatModel,
        enrichmentModel: enrichmentModel === 'use_default' ? undefined : enrichmentModel,
        analysisModel: analysisModel === 'use_default' ? undefined : analysisModel,
        useFallback,
      });

      console.log('✅ AI settings saved successfully');
      
      // Reset state and close
      setApiKey("");
      setProvisioningKey("");
      setShowApiKeyInput(false);
      setShowProvisioningKeyInput(false);
      onOpenChange(false);
    } catch (error) {
      console.error('❌ Failed to save AI settings:', error);
      // Error already handled by onError in useAISettings
    }
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

          {/* Modellkonfiguration */}
          <div className="space-y-4 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Modellkonfiguration
            </h3>
            
            {/* Default model */}
            <div className="space-y-2">
              <Label htmlFor="model">Standardmodell för alla anrop</Label>
              <Select value={defaultModel} onValueChange={setDefaultModel}>
                <SelectTrigger disabled={isTesting || isSaving}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OPENROUTER_MODELS.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label} <span className="text-muted-foreground ml-2">{model.cost}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Används för alla ändamål om inget annat anges nedan
              </p>
            </div>

            {/* Avancerade inställningar */}
            <details className="space-y-3">
              <summary className="cursor-pointer text-sm font-medium hover:text-primary">
                ⚙️ Specialiserade modeller per ändamål
              </summary>
              
              <div className="space-y-3 pt-2">
                {/* Chat model */}
                <div className="space-y-2">
                  <Label>Chat-modell (för chatbot)</Label>
                  <Select value={chatModel} onValueChange={setChatModel}>
                    <SelectTrigger disabled={isTesting || isSaving}>
                      <SelectValue placeholder="Använd standardmodell" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="use_default">Använd standardmodell</SelectItem>
                      {OPENROUTER_MODELS.map(m => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Enrichment model */}
                <div className="space-y-2">
                  <Label>Lead-berikningsmodell</Label>
                  <Select value={enrichmentModel} onValueChange={setEnrichmentModel}>
                    <SelectTrigger disabled={isTesting || isSaving}>
                      <SelectValue placeholder="Använd standardmodell" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="use_default">Använd standardmodell</SelectItem>
                      {OPENROUTER_MODELS.map(m => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Analysis model */}
                <div className="space-y-2">
                  <Label>Analysmodell (reviews, samtal)</Label>
                  <Select value={analysisModel} onValueChange={setAnalysisModel}>
                    <SelectTrigger disabled={isTesting || isSaving}>
                      <SelectValue placeholder="Använd standardmodell" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="use_default">Använd standardmodell</SelectItem>
                      {OPENROUTER_MODELS.map(m => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </details>

            {/* Fallback switch */}
            <div className="flex items-center justify-between border-t pt-3">
              <div>
                <Label htmlFor="fallback">Fallback till Lovable AI</Label>
                <p className="text-xs text-muted-foreground">
                  Om OpenRouter misslyckas, använd Lovable AI automatiskt
                </p>
              </div>
              <Switch
                id="fallback"
                checked={useFallback}
                onCheckedChange={setUseFallback}
                disabled={isTesting || isSaving}
              />
            </div>
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

          <Separator />

          {/* Test Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">🧪 Testa integration</h3>
                <p className="text-sm text-muted-foreground">
                  Kör ett fullständigt test av OpenRouter-integrationen
                </p>
              </div>
              <div className="flex gap-2">
                {testResults && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTestResults(null);
                      setShowTestResults(false);
                    }}
                  >
                    Rensa
                  </Button>
                )}
                <Button
                  onClick={handleFullTest}
                  disabled={isTesting || (!keyStatus?.api_key_exists && !apiKey)}
                  size="sm"
                >
                  {isTesting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testar...
                    </>
                  ) : (
                    "Kör test"
                  )}
                </Button>
              </div>
            </div>

            {testResults && (
              <div className="rounded-lg border bg-card">
                <button
                  onClick={() => setShowTestResults(!showTestResults)}
                  className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
                >
                  <span className="font-medium">Testresultat</span>
                  {showTestResults ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {showTestResults && (
                  <div className="p-4 pt-0 space-y-3 border-t">
                    {/* AI Call Test */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {testResults.aiCall?.status === 'success' ? '✅' : '❌'}
                        <span className="font-medium">AI-anrop</span>
                        {testResults.aiCall?.duration && (
                          <span className="text-xs text-muted-foreground">({testResults.aiCall.duration}ms)</span>
                        )}
                      </div>
                      {testResults.aiCall?.status === 'success' && testResults.aiCall.data && (
                        <div className="text-sm text-muted-foreground ml-6 space-y-0.5">
                          <div>Model: {testResults.aiCall.data.model || 'N/A'}</div>
                          <div>Provider: {testResults.aiCall.data.provider || 'N/A'}</div>
                          {testResults.aiCall.data.usage && (
                            <div>Tokens: {testResults.aiCall.data.usage.prompt_tokens || 0} prompt, {testResults.aiCall.data.usage.completion_tokens || 0} completion</div>
                          )}
                        </div>
                      )}
                      {testResults.aiCall?.status === 'error' && (
                        <div className="text-sm text-destructive ml-6">{testResults.aiCall.error}</div>
                      )}
                    </div>

                    {/* Credits Test */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {testResults.credits?.status === 'success' ? '✅' : '❌'}
                        <span className="font-medium">Credits</span>
                        {testResults.credits?.duration && (
                          <span className="text-xs text-muted-foreground">({testResults.credits.duration}ms)</span>
                        )}
                      </div>
                      {testResults.credits?.status === 'success' && testResults.credits.data?.data && (
                        <div className="text-sm text-muted-foreground ml-6 space-y-0.5">
                          <div>Balance: ${testResults.credits.data.data.balance?.toFixed(2) || '0.00'}</div>
                          <div>Usage: ${testResults.credits.data.data.usage?.toFixed(2) || '0.00'}</div>
                        </div>
                      )}
                      {testResults.credits?.status === 'error' && (
                        <div className="text-sm text-destructive ml-6">{testResults.credits.error}</div>
                      )}
                    </div>

                    {/* Key Info Test */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {testResults.keyInfo?.status === 'success' ? '✅' : '❌'}
                        <span className="font-medium">Key Info</span>
                        {testResults.keyInfo?.duration && (
                          <span className="text-xs text-muted-foreground">({testResults.keyInfo.duration}ms)</span>
                        )}
                      </div>
                      {testResults.keyInfo?.status === 'success' && testResults.keyInfo.data?.data && (
                        <div className="text-sm text-muted-foreground ml-6 space-y-0.5">
                          <div>Rate limit: {testResults.keyInfo.data.data.rate_limit?.requests || 'N/A'} req/min</div>
                          <div>Label: {testResults.keyInfo.data.data.label || 'N/A'}</div>
                        </div>
                      )}
                      {testResults.keyInfo?.status === 'error' && (
                        <div className="text-sm text-destructive ml-6">{testResults.keyInfo.error}</div>
                      )}
                    </div>

                    {/* Models Test */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {testResults.models?.status === 'success' ? '✅' : '❌'}
                        <span className="font-medium">Modeller</span>
                        {testResults.models?.duration && (
                          <span className="text-xs text-muted-foreground">({testResults.models.duration}ms)</span>
                        )}
                      </div>
                      {testResults.models?.status === 'success' && testResults.models.data?.data && (
                        <div className="text-sm text-muted-foreground ml-6">
                          <div>{testResults.models.data.data.length || 0} tillgängliga modeller</div>
                        </div>
                      )}
                      {testResults.models?.status === 'error' && (
                        <div className="text-sm text-destructive ml-6">{testResults.models.error}</div>
                      )}
                    </div>

                    {/* Activity Test */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {testResults.activity?.status === 'success' ? '✅' : testResults.activity?.status === 'skipped' ? '⏭️' : '❌'}
                        <span className="font-medium">Activity</span>
                        {testResults.activity?.duration && (
                          <span className="text-xs text-muted-foreground">({testResults.activity.duration}ms)</span>
                        )}
                      </div>
                      {testResults.activity?.status === 'success' && testResults.activity.data?.data && (
                        <div className="text-sm text-muted-foreground ml-6">
                          <div>Senaste 7 dagarna: {testResults.activity.data.data.length || 0} aktiviteter</div>
                        </div>
                      )}
                      {testResults.activity?.status === 'skipped' && (
                        <div className="text-sm text-muted-foreground ml-6">{testResults.activity.error}</div>
                      )}
                      {testResults.activity?.status === 'error' && (
                        <div className="text-sm text-destructive ml-6">{testResults.activity.error}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
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
