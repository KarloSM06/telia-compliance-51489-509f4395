import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AVAILABLE_PROVIDERS } from "@/hooks/useBookingIntegrations";

interface IntegrationSetupModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<any>;
}

export const IntegrationSetupModal = ({ open, onClose, onSave }: IntegrationSetupModalProps) => {
  const [selectedProvider, setSelectedProvider] = useState('');
  const [credentials, setCredentials] = useState<Record<string, string>>({});

  const provider = AVAILABLE_PROVIDERS.find(p => p.id === selectedProvider);

  const getCredentialFields = (providerId: string) => {
    const fields: Record<string, { label: string; type: string; placeholder?: string }[]> = {
      simplybook: [
        { label: 'Company Login', type: 'text', placeholder: 'ditt-företag' },
        { label: 'Login (användarnamn)', type: 'text', placeholder: 'admin' },
        { label: 'Password', type: 'password' },
      ],
      bokamera: [
        { label: 'API Nyckel', type: 'text', placeholder: 'din-api-nyckel' },
      ],
      hapio: [
        { label: 'API Key', type: 'text' },
        { label: 'Workspace ID', type: 'text' },
      ],
      bookeo: [
        { label: 'API Key', type: 'text' },
        { label: 'Secret Key', type: 'password' },
      ],
      google_calendar: [
        { label: 'Client ID', type: 'text' },
        { label: 'Client Secret', type: 'password' },
      ],
      outlook: [
        { label: 'Client ID', type: 'text' },
        { label: 'Client Secret', type: 'password' },
        { label: 'Tenant ID', type: 'text' },
      ],
    };

    return fields[providerId] || [
      { label: 'API Key', type: 'text' },
    ];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider) return;

    await onSave({
      provider: provider.id,
      provider_display_name: provider.name,
      integration_type: provider.type,
      encrypted_credentials: credentials,
    });

    setSelectedProvider('');
    setCredentials({});
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Lägg till bokningssystem-integration</DialogTitle>
          <DialogDescription>
            Välj vilket bokningssystem du använder och ange dina inloggningsuppgifter för synkning
          </DialogDescription>
        </DialogHeader>

        {!selectedProvider ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {AVAILABLE_PROVIDERS.map(p => (
              <Card 
                key={p.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => setSelectedProvider(p.id)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{p.name}</CardTitle>
                  <CardDescription>
                    {p.type === 'full_api' ? 'Full API-integration' : 'Kalendersynkning'}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <Card>
              <CardHeader>
                <CardTitle>{provider?.name}</CardTitle>
                <CardDescription>
                  Ange dina inloggningsuppgifter för att aktivera synkning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {getCredentialFields(selectedProvider).map((field, index) => (
                  <div key={index}>
                    <Label htmlFor={field.label}>{field.label} *</Label>
                    <Input
                      id={field.label}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={credentials[field.label] || ''}
                      onChange={(e) => setCredentials({
                        ...credentials,
                        [field.label]: e.target.value
                      })}
                      required
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setSelectedProvider('');
                  setCredentials({});
                }}
              >
                Tillbaka
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Avbryt
                </Button>
                <Button type="submit">
                  Aktivera integration
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
