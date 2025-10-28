import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTelephonyAccounts } from '@/hooks/useTelephonyAccounts';
import { getProviderLogo, getProviderDisplayName } from '@/lib/telephonyFormatters';

interface AddProviderModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddProviderModal = ({ open, onClose }: AddProviderModalProps) => {
  const [provider, setProvider] = useState<string>('');
  const [displayName, setDisplayName] = useState('');
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const { addAccount, isAddingAccount } = useTelephonyAccounts();

  const providers = [
    { value: 'twilio', label: 'Twilio', fields: ['accountSid', 'authToken'] },
    { value: 'telnyx', label: 'Telnyx', fields: ['apiKey'] },
    { value: 'vapi', label: 'Vapi', fields: ['apiKey', 'webhookSecret'] },
    { value: 'retell', label: 'Retell', fields: ['apiKey', 'webhookSecret'] },
  ];

  const selectedProvider = providers.find(p => p.value === provider);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!provider || !displayName || !selectedProvider) return;

    // Validate all fields are filled
    const allFieldsFilled = selectedProvider.fields.every(field => credentials[field]);
    if (!allFieldsFilled) return;

    addAccount(
      { provider, credentials, displayName },
      {
        onSuccess: () => {
          setProvider('');
          setDisplayName('');
          setCredentials({});
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Lägg till telefonileverantör</DialogTitle>
          <DialogDescription>
            Anslut en ny telefonileverantör för att börja samla in data
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="provider">Leverantör</Label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger>
                <SelectValue placeholder="Välj leverantör" />
              </SelectTrigger>
              <SelectContent>
                {providers.map(p => (
                  <SelectItem key={p.value} value={p.value}>
                    <div className="flex items-center gap-2">
                      <img 
                        src={getProviderLogo(p.value)} 
                        alt={p.label}
                        className="h-5 w-5 object-contain"
                      />
                      {p.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {provider && (
            <>
              <div>
                <Label htmlFor="displayName">Visningsnamn</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={`Mitt ${getProviderDisplayName(provider)}-konto`}
                  required
                />
              </div>

              {selectedProvider?.fields.map(field => (
                <div key={field}>
                  <Label htmlFor={field}>
                    {field === 'accountSid' && 'Account SID'}
                    {field === 'authToken' && 'Auth Token'}
                    {field === 'apiKey' && 'API Key'}
                    {field === 'webhookSecret' && 'Webhook Secret'}
                  </Label>
                  <Input
                    id={field}
                    type={field.includes('Token') || field.includes('Secret') || field.includes('Key') ? 'password' : 'text'}
                    value={credentials[field] || ''}
                    onChange={(e) => setCredentials({ ...credentials, [field]: e.target.value })}
                    placeholder={`Ange ${field}`}
                    required
                  />
                </div>
              ))}
            </>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Avbryt
            </Button>
            <Button type="submit" disabled={isAddingAccount || !provider || !displayName}>
              {isAddingAccount ? 'Lägger till...' : 'Lägg till'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
