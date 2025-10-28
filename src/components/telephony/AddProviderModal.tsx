import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useTelephonyAccounts } from "@/hooks/useTelephonyAccounts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface AddProviderModalProps {
  open: boolean;
  onClose: () => void;
}

type ProviderType = 'vapi' | 'retell' | 'twilio' | 'telnyx';

interface ProviderConfig {
  name: string;
  description: string;
  fields: {
    key: string;
    label: string;
    type: 'text' | 'password';
    required: boolean;
    placeholder: string;
    helpText?: string;
  }[];
  docsUrl: string;
}

const PROVIDER_CONFIGS: Record<ProviderType, ProviderConfig> = {
  vapi: {
    name: 'Vapi',
    description: 'AI-powered voice platform med realtids samtalshantering',
    docsUrl: 'https://docs.vapi.ai',
    fields: [
      {
        key: 'apiKey',
        label: 'API Key',
        type: 'password',
        required: true,
        placeholder: 'sk_live_...',
        helpText: 'Hämta från Vapi Dashboard → API Keys'
      },
      {
        key: 'webhookSecret',
        label: 'Webhook Secret (valfritt)',
        type: 'password',
        required: false,
        placeholder: 'whsec_...',
        helpText: 'För webhook-signaturverifiering'
      }
    ]
  },
  retell: {
    name: 'Retell',
    description: 'AI phone agent platform med REST + realtime streaming',
    docsUrl: 'https://docs.retellai.com',
    fields: [
      {
        key: 'apiKey',
        label: 'API Key',
        type: 'password',
        required: true,
        placeholder: 'key_...',
        helpText: 'REST API key från Retell Dashboard'
      },
      {
        key: 'webhookKey',
        label: 'Webhook Key',
        type: 'password',
        required: true,
        placeholder: 'webhook_...',
        helpText: 'Separat nyckel för webhook-autentisering'
      }
    ]
  },
  twilio: {
    name: 'Twilio',
    description: 'Omfattande kommunikationsplattform (Voice, SMS, Video)',
    docsUrl: 'https://www.twilio.com/docs',
    fields: [
      {
        key: 'accountSid',
        label: 'Account SID',
        type: 'text',
        required: true,
        placeholder: 'AC...',
        helpText: 'Från Twilio Console'
      },
      {
        key: 'authToken',
        label: 'Auth Token',
        type: 'password',
        required: true,
        placeholder: '',
        helpText: 'Primary Auth Token (kan också använda API Key)'
      },
      {
        key: 'apiKeySid',
        label: 'API Key SID (valfritt)',
        type: 'text',
        required: false,
        placeholder: 'SK...',
        helpText: 'Alternativ till Auth Token för bättre säkerhet'
      },
      {
        key: 'apiKeySecret',
        label: 'API Key Secret (valfritt)',
        type: 'password',
        required: false,
        placeholder: '',
        helpText: 'Krävs om API Key SID används'
      }
    ]
  },
  telnyx: {
    name: 'Telnyx',
    description: 'Voice API + Messaging med webhook-signering',
    docsUrl: 'https://developers.telnyx.com',
    fields: [
      {
        key: 'apiKey',
        label: 'API Key',
        type: 'password',
        required: true,
        placeholder: 'KEY...',
        helpText: 'V2 API Key från Mission Control Portal'
      },
      {
        key: 'webhookPublicKey',
        label: 'Webhook Public Key',
        type: 'text',
        required: true,
        placeholder: '',
        helpText: 'Hämta från Mission Control → Webhooks för signaturverifiering'
      }
    ]
  }
};

export function AddProviderModal({ open, onClose }: AddProviderModalProps) {
  const [provider, setProvider] = useState<ProviderType>('vapi');
  const [displayName, setDisplayName] = useState('');
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { addAccount } = useTelephonyAccounts();

  const config = PROVIDER_CONFIGS[provider];

  const handleSubmit = async () => {
    if (!displayName.trim()) {
      return;
    }

    // Validate required fields
    const missingFields = config.fields
      .filter(f => f.required && !credentials[f.key]?.trim())
      .map(f => f.label);

    if (missingFields.length > 0) {
      return;
    }

    setLoading(true);
    try {
      await addAccount({
        provider,
        displayName,
        credentials,
      });

      // Reset and close
      setDisplayName('');
      setCredentials({});
      setProvider('vapi');
      onClose();
    } catch (error) {
      console.error('Error adding provider:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialChange = (key: string, value: string) => {
    setCredentials(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Lägg till telefoni-leverantör</DialogTitle>
          <DialogDescription>
            Konfigurera en ny telefoni-leverantör för att synka samtal och meddelanden
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Provider Selection */}
          <div className="space-y-2">
            <Label htmlFor="provider">Leverantör</Label>
            <Select value={provider} onValueChange={(v) => {
              setProvider(v as ProviderType);
              setCredentials({});
            }}>
              <SelectTrigger id="provider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PROVIDER_CONFIGS).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex flex-col">
                      <span className="font-medium">{config.name}</span>
                      <span className="text-xs text-muted-foreground">{config.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Provider Info Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">{config.name} Configuration</p>
                <p className="text-sm">
                  Dokumentation: <a href={config.docsUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">{config.docsUrl}</a>
                </p>
              </div>
            </AlertDescription>
          </Alert>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name *</Label>
            <Input
              id="displayName"
              placeholder={`T.ex. "${config.name} Production"`}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          {/* Dynamic Credential Fields */}
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold mb-3">Credentials</h4>
              {config.fields.map((field) => (
                <div key={field.key} className="space-y-2 mb-4">
                  <Label htmlFor={field.key}>
                    {field.label} {field.required && '*'}
                  </Label>
                  <Input
                    id={field.key}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={credentials[field.key] || ''}
                    onChange={(e) => handleCredentialChange(field.key, e.target.value)}
                  />
                  {field.helpText && (
                    <p className="text-xs text-muted-foreground">{field.helpText}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Avbryt
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !displayName.trim()}>
            {loading ? 'Lägger till...' : 'Lägg till'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
