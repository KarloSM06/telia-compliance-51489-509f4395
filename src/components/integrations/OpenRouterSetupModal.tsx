import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAISettings } from '@/hooks/useAISettings';
import { toast } from 'sonner';
import { Eye, EyeOff, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';

interface OpenRouterSetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AVAILABLE_MODELS = [
  { value: 'google/gemini-2.5-flash', label: 'Gemini 2.5 Flash (Rekommenderad)' },
  { value: 'google/gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
  { value: 'google/gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite' },
  { value: 'openai/gpt-5', label: 'GPT-5' },
  { value: 'openai/gpt-5-mini', label: 'GPT-5 Mini' },
  { value: 'openai/gpt-5-nano', label: 'GPT-5 Nano' },
];

export function OpenRouterSetupModal({ open, onOpenChange }: OpenRouterSetupModalProps) {
  const { settings, saveSettings, isSaving } = useAISettings();
  const [apiKey, setApiKey] = useState('');
  const [provisioningKey, setProvisioningKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [showProvisioningKey, setShowProvisioningKey] = useState(false);
  const [defaultModel, setDefaultModel] = useState(settings.default_model);
  const [useFallback, setUseFallback] = useState(settings.use_system_fallback);
  const [isTesting, setIsTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  const handleTestConnection = async () => {
    if (!apiKey) {
      toast.error('Ange en API-nyckel först');
      return;
    }

    setIsTesting(true);
    setTestSuccess(false);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (response.ok) {
        setTestSuccess(true);
        toast.success('Anslutningen lyckades!');
      } else {
        toast.error('Anslutningen misslyckades. Kontrollera din API-nyckel.');
      }
    } catch (error) {
      toast.error('Kunde inte ansluta till OpenRouter');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    if (!apiKey && settings.ai_provider !== 'openrouter') {
      toast.error('Ange en OpenRouter API-nyckel');
      return;
    }

    saveSettings({
      provider: 'openrouter',
      apiKey: apiKey || undefined,
      provisioningKey: provisioningKey || undefined,
      defaultModel,
      useFallback,
    });

    onOpenChange(false);
  };

  const isConfigured = settings.ai_provider === 'openrouter' && settings.openrouter_api_key_encrypted;
  const hasProvisioningKey = settings.openrouter_provisioning_key_encrypted;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isConfigured ? 'Redigera OpenRouter-konfiguration' : 'Konfigurera OpenRouter'}
          </DialogTitle>
          <DialogDescription>
            Anslut din OpenRouter API-nyckel för att använda olika AI-modeller.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* API Key Input */}
          <div className="space-y-2">
            <Label htmlFor="api-key">
              OpenRouter API-nyckel
              {isConfigured && !apiKey && (
                <span className="text-xs text-muted-foreground ml-2">(Konfigurerad)</span>
              )}
            </Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showKey ? 'text' : 'password'}
                placeholder={isConfigured ? '••••••••••••••••' : 'sk-or-v1-...'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Hämta din nyckel från{' '}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                openrouter.ai/keys
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>

          {/* Test Connection Button */}
          {apiKey && (
            <Button
              type="button"
              variant="outline"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="w-full"
            >
              {isTesting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testar anslutning...
                </>
              ) : testSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                  Anslutning lyckades
                </>
              ) : (
                'Testa anslutning'
              )}
            </Button>
          )}

          {/* Default Model Selection */}
          <div className="space-y-2">
            <Label htmlFor="default-model">Standardmodell</Label>
            <Select value={defaultModel} onValueChange={setDefaultModel}>
              <SelectTrigger id="default-model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_MODELS.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Provisioning Key Input (Optional) */}
          <div className="space-y-2 pt-4 border-t">
            <Label htmlFor="provisioning-key">
              OpenRouter Provisioning Key (Valfritt)
              {hasProvisioningKey && !provisioningKey && (
                <span className="text-xs text-green-600 ml-2">(✓ Konfigurerad)</span>
              )}
            </Label>
            <div className="relative">
              <Input
                id="provisioning-key"
                type={showProvisioningKey ? 'text' : 'password'}
                placeholder={hasProvisioningKey ? '••••••••••••••••' : 'sk-or-prov-...'}
                value={provisioningKey}
                onChange={(e) => setProvisioningKey(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setShowProvisioningKey(!showProvisioningKey)}
              >
                {showProvisioningKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Provisioning key ger tillgång till aggregerad användningshistorik via /activity endpoint.
              Hämta från{' '}
              <a
                href="https://openrouter.ai/settings/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                openrouter.ai/settings/keys
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>

          {/* Fallback Option */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="use-fallback"
              checked={useFallback}
              onChange={(e) => setUseFallback(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="use-fallback" className="text-sm font-normal">
              Använd Lovable AI som fallback om OpenRouter misslyckas
            </Label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Avbryt
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sparar...
                </>
              ) : (
                'Spara'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
