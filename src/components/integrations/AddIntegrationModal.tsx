import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  PROVIDER_CAPABILITIES, 
  PROVIDER_CREDENTIALS_SCHEMA,
  Capability,
  useIntegrations
} from '@/hooks/useIntegrations';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface AddIntegrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AVAILABLE_PROVIDERS = [
  { id: 'twilio', name: 'Twilio', category: 'telephony' },
  { id: 'telnyx', name: 'Telnyx', category: 'telephony' },
  { id: 'vapi', name: 'Vapi', category: 'telephony' },
  { id: 'retell', name: 'Retell', category: 'telephony' },
  { id: 'simplybook', name: 'SimplyBook.me', category: 'calendar', type: 'Full API' },
  { id: 'bokamera', name: 'BokaMera', category: 'calendar', type: 'Full API' },
  { id: 'hapio', name: 'Hapio', category: 'calendar', type: 'Full API' },
  { id: 'bookeo', name: 'Bookeo', category: 'calendar', type: 'Full API' },
  { id: 'supersaas', name: 'SuperSaaS', category: 'calendar', type: 'Full API' },
  { id: 'tixly', name: 'Tixly', category: 'calendar', type: 'Full API' },
  { id: 'hogia_bookit', name: 'Hogia BOOKIT', category: 'calendar', type: 'Full API' },
  { id: 'ireserve', name: 'i-Reserve', category: 'calendar', type: 'Full API' },
  { id: 'bokadirekt', name: 'Bokadirekt', category: 'calendar', type: 'Full API' },
  { id: 'bokase', name: 'Boka.se', category: 'calendar', type: 'Kalendersynk' },
  { id: 'google_calendar', name: 'Google Calendar', category: 'calendar', type: 'Kalendersynk' },
  { id: 'outlook', name: 'Microsoft Outlook', category: 'calendar', type: 'Kalendersynk' },
];

export const AddIntegrationModal = ({ open, onOpenChange }: AddIntegrationModalProps) => {
  const { integrations, addIntegration, isAddingIntegration } = useIntegrations();
  const [step, setStep] = useState<'select' | 'configure'>('select');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [selectedCapabilities, setSelectedCapabilities] = useState<Capability[]>([]);
  const [displayName, setDisplayName] = useState('');

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    const provider = AVAILABLE_PROVIDERS.find(p => p.id === providerId);
    setDisplayName(provider?.name || providerId);
    setSelectedCapabilities(PROVIDER_CAPABILITIES[providerId] || []);
    setStep('configure');
  };

  const handleBack = () => {
    setStep('select');
    setSelectedProvider(null);
    setCredentials({});
    setSelectedCapabilities([]);
  };

  const handleSubmit = async () => {
    if (!selectedProvider) return;

    addIntegration({
      provider: selectedProvider,
      providerDisplayName: displayName,
      capabilities: selectedCapabilities,
      credentials,
    }, {
      onSuccess: () => {
        onOpenChange(false);
        handleBack();
      },
    });
  };

  const isIntegrated = (providerId: string) => {
    return integrations.some(i => i.provider === providerId);
  };

  const getCredentialFields = () => {
    if (!selectedProvider) return [];
    return PROVIDER_CREDENTIALS_SCHEMA[selectedProvider] || [];
  };

  const canToggleCapabilities = selectedProvider && ['twilio', 'telnyx'].includes(selectedProvider);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'select' ? 'Lägg till integration' : `Konfigurera ${displayName}`}
          </DialogTitle>
        </DialogHeader>

        {step === 'select' && (
          <div className="space-y-6">
            {/* Telephony providers */}
            <div>
              <h3 className="font-semibold mb-3">Telefoni & Röst</h3>
              <div className="grid grid-cols-2 gap-3">
                {AVAILABLE_PROVIDERS.filter(p => p.category === 'telephony').map(provider => (
                  <Button
                    key={provider.id}
                    variant="outline"
                    className="h-auto flex flex-col items-start p-4 relative"
                    onClick={() => handleProviderSelect(provider.id)}
                    disabled={isIntegrated(provider.id)}
                  >
                    {isIntegrated(provider.id) && (
                      <Badge className="absolute top-2 right-2" variant="secondary">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Tillagd
                      </Badge>
                    )}
                    <span className="font-semibold mb-2">{provider.name}</span>
                    <div className="flex flex-wrap gap-1">
                      {PROVIDER_CAPABILITIES[provider.id]?.slice(0, 3).map(cap => (
                        <Badge key={cap} variant="outline" className="text-xs">
                          {cap}
                        </Badge>
                      ))}
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Calendar providers */}
            <div>
              <h3 className="font-semibold mb-3">Kalender & Bokning</h3>
              <div className="grid grid-cols-2 gap-3">
                {AVAILABLE_PROVIDERS.filter(p => p.category === 'calendar').map(provider => (
                  <Button
                    key={provider.id}
                    variant="outline"
                    className="h-auto flex flex-col items-start p-4 relative"
                    onClick={() => handleProviderSelect(provider.id)}
                    disabled={isIntegrated(provider.id)}
                  >
                    {isIntegrated(provider.id) && (
                      <Badge className="absolute top-2 right-2" variant="secondary">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Tillagd
                      </Badge>
                    )}
                    <div className="flex items-center justify-between w-full mb-2">
                      <span className="font-semibold">{provider.name}</span>
                      {'type' in provider && (
                        <Badge variant="outline" className="text-xs">
                          {provider.type}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {PROVIDER_CAPABILITIES[provider.id]?.slice(0, 2).map(cap => (
                        <Badge key={cap} variant="outline" className="text-xs">
                          {cap === 'calendar_sync' && 'Kalender'}
                          {cap === 'booking' && 'Bokning'}
                        </Badge>
                      ))}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'configure' && (
          <div className="space-y-6">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Tillbaka
            </Button>

            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName">Visningsnamn</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={`T.ex. ${displayName} Production`}
                />
              </div>

              {/* Credentials */}
              {getCredentialFields().map(field => (
                <div key={field}>
                  <Label htmlFor={field}>
                    {field === 'accountSid' && 'Account SID'}
                    {field === 'authToken' && 'Auth Token'}
                    {field === 'apiKey' && 'API Key'}
                    {field === 'webhookKey' && 'Webhook Key'}
                    {field === 'companyLogin' && 'Company Login'}
                    {field === 'clientId' && 'Client ID'}
                    {field === 'clientSecret' && 'Client Secret'}
                    {field === 'refreshToken' && 'Refresh Token'}
                    {field === 'secretKey' && 'Secret Key'}
                    {field === 'accountName' && 'Account Name'}
                    {field === 'accountId' && 'Account ID'}
                    {field === 'hotelId' && 'Hotel ID'}
                  </Label>
                  <Input
                    id={field}
                    type={field.includes('token') || field.includes('secret') || field.includes('key') ? 'password' : 'text'}
                    value={credentials[field] || ''}
                    onChange={(e) => setCredentials({ ...credentials, [field]: e.target.value })}
                    placeholder={`Ange ${field}`}
                  />
                </div>
              ))}

              {/* Capabilities selection (for multi-providers) */}
              {canToggleCapabilities && (
                <div>
                  <Label className="mb-3 block">Välj funktioner att aktivera</Label>
                  <div className="space-y-2">
                    {PROVIDER_CAPABILITIES[selectedProvider].map(cap => (
                      <div key={cap} className="flex items-center space-x-2">
                        <Checkbox
                          id={cap}
                          checked={selectedCapabilities.includes(cap)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCapabilities([...selectedCapabilities, cap]);
                            } else {
                              setSelectedCapabilities(selectedCapabilities.filter(c => c !== cap));
                            }
                          }}
                        />
                        <Label htmlFor={cap} className="capitalize cursor-pointer">
                          {cap}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button variant="outline" onClick={handleBack}>
                Avbryt
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isAddingIntegration || !displayName || getCredentialFields().some(f => !credentials[f])}
              >
                {isAddingIntegration ? 'Lägger till...' : 'Lägg till integration'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
