import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Shield, Sparkles, ExternalLink, TrendingUp } from "lucide-react";
import { useAISettings } from "@/hooks/useAISettings";
import { useAIUsage } from "@/hooks/useAIUsage";
import { toast } from "sonner";
import { subDays } from "date-fns";
import { useNavigate } from "react-router-dom";

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

export const AIProviderSettings = () => {
  const navigate = useNavigate();
  const { settings, saveSettings, isSaving, isLoading } = useAISettings();
  const { usage: recentUsage } = useAIUsage({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  const [provider, setProvider] = useState<'lovable' | 'openrouter'>(settings.ai_provider);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [defaultModel, setDefaultModel] = useState(settings.default_model);
  const [useFallback, setUseFallback] = useState(settings.use_system_fallback);
  const [chatModel, setChatModel] = useState(settings.chat_model ?? 'use_default');
  const [enrichmentModel, setEnrichmentModel] = useState(settings.enrichment_model ?? 'use_default');
  const [analysisModel, setAnalysisModel] = useState(settings.analysis_model ?? 'use_default');

  useEffect(() => {
    setProvider(settings.ai_provider);
    setDefaultModel(settings.default_model);
    setUseFallback(settings.use_system_fallback);
    setChatModel(settings.chat_model ?? 'use_default');
    setEnrichmentModel(settings.enrichment_model ?? 'use_default');
    setAnalysisModel(settings.analysis_model ?? 'use_default');
  }, [settings]);

  const handleSave = () => {
    // Validate OpenRouter API key if provider is openrouter and key is provided
    if (provider === 'openrouter' && apiKey && !apiKey.startsWith('sk-or-')) {
      toast.error('OpenRouter API-nyckeln måste börja med "sk-or-"');
      return;
    }

    saveSettings({
      provider,
      apiKey: apiKey || undefined,
      defaultModel,
      chatModel: chatModel === 'use_default' ? undefined : chatModel,
      enrichmentModel: enrichmentModel === 'use_default' ? undefined : enrichmentModel,
      analysisModel: analysisModel === 'use_default' ? undefined : analysisModel,
      useFallback,
    });
    setApiKey(''); // Clear input after save
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI-leverantör & Modeller
        </CardTitle>
        <CardDescription>
          Välj mellan Lovable AI (inkluderat) eller din egen OpenRouter-nyckel för full kontroll
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Provider val */}
        <div className="space-y-2">
          <Label>AI-leverantör</Label>
          <Select value={provider} onValueChange={(v) => setProvider(v as 'lovable' | 'openrouter')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lovable">
                ✨ Lovable AI (Inkluderat, begränsad användning)
              </SelectItem>
              <SelectItem value="openrouter">
                🚀 OpenRouter (Din egen nyckel, obegränsad)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* OpenRouter API Key */}
        {provider === 'openrouter' && (
          <div className="space-y-2">
            <Label>OpenRouter API-nyckel</Label>
            <div className="flex gap-2">
              <Input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-..."
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                <Shield className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              Hämta din nyckel från{' '}
              <a 
                href="https://openrouter.ai/keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline inline-flex items-center gap-1"
              >
                openrouter.ai/keys
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
            
            {/* Usage display */}
            {recentUsage && recentUsage.totalCalls > 0 && (
              <div className="mt-3 p-3 bg-muted rounded-md space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Senaste 30 dagar:</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 text-xs"
                    onClick={() => navigate('/dashboard/integrations?tab=ai')}
                  >
                    Se detaljer <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-muted-foreground">Tokens</div>
                    <div className="font-medium">{recentUsage.totalTokens.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Anrop</div>
                    <div className="font-medium">{recentUsage.totalCalls}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Kostnad</div>
                    <div className="font-medium">{recentUsage.totalCostSEK.toFixed(2)} SEK</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Default model */}
        <div className="space-y-2">
          <Label>Standardmodell</Label>
          <Select value={defaultModel} onValueChange={setDefaultModel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OPENROUTER_MODELS.map(model => (
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

        {/* Specialiserade modeller (valfritt) */}
        <details className="space-y-4 border-t pt-4">
          <summary className="cursor-pointer text-sm font-medium hover:text-primary">
            ⚙️ Avancerat: Anpassa modell per ändamål
          </summary>
          
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Chat-modell (för chatbot)</Label>
              <Select value={chatModel} onValueChange={setChatModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Använd standardmodell" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="use_default">Använd standardmodell</SelectItem>
                  {OPENROUTER_MODELS.map(model => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Lead-berikningsmodell</Label>
              <Select value={enrichmentModel} onValueChange={setEnrichmentModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Använd standardmodell" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="use_default">Använd standardmodell</SelectItem>
                  {OPENROUTER_MODELS.map(model => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Analysmodell (reviews, samtal)</Label>
              <Select value={analysisModel} onValueChange={setAnalysisModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Använd standardmodell" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="use_default">Använd standardmodell</SelectItem>
                  {OPENROUTER_MODELS.map(model => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </details>

        {/* Fallback switch */}
        {provider === 'openrouter' && (
          <div className="flex items-center justify-between border-t pt-4">
            <div className="space-y-0.5">
              <Label>Fallback till Lovable AI</Label>
              <p className="text-xs text-muted-foreground">
                Om din OpenRouter-nyckel misslyckas, använd Lovable AI istället
              </p>
            </div>
            <Switch checked={useFallback} onCheckedChange={setUseFallback} />
          </div>
        )}

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          {isSaving ? 'Sparar...' : 'Spara AI-inställningar'}
        </Button>

      </CardContent>
    </Card>
  );
};
