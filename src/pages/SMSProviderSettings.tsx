import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useIntegrations, PROVIDER_CREDENTIALS_SCHEMA } from "@/hooks/useIntegrations";
import { CheckCircle2, AlertCircle, Loader2, Trash2, Info, MessageSquare, Shield, ExternalLink, Send, RefreshCw, Phone } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { PremiumTelephonyStatCard } from "@/components/telephony/PremiumTelephonyStatCard";
import hiemsLogoSnowflake from "@/assets/hiems-logo-snowflake.png";
import { useQueryClient } from "@tanstack/react-query";

type SMSProvider = 'twilio' | 'telnyx';

export default function SMSProviderSettings() {
  const { 
    integrations, 
    isLoading, 
    addIntegration, 
    isAddingIntegration,
    updateIntegration,
    deleteIntegration,
    isDeletingIntegration 
  } = useIntegrations();
  const queryClient = useQueryClient();
  
  // Find existing SMS integration (Twilio or Telnyx)
  const smsIntegration = integrations.find(i => 
    (i.provider === 'twilio' || i.provider === 'telnyx') && i.is_active
  );
  
  const [provider, setProvider] = useState<SMSProvider>('twilio');
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [fromPhoneNumber, setFromPhoneNumber] = useState('');
  const [testPhoneNumber, setTestPhoneNumber] = useState('');
  const [webhookOpen, setWebhookOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (smsIntegration) {
      setProvider(smsIntegration.provider as SMSProvider);
      setFromPhoneNumber(smsIntegration.config?.from_phone_number || '');
    }
  }, [smsIntegration]);

  const handleTest = async () => {
    if (!testPhoneNumber) {
      toast.error('Ange ett telefonnummer att skicka test-SMS till');
      return;
    }
    setIsTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-sms-provider', {
        body: { provider, credentials, fromPhoneNumber, testPhoneNumber },
      });
      
      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Test misslyckades');
      
      toast.success('Test-SMS skickat! Kontrollera din telefon.');
    } catch (error: any) {
      toast.error(`Test misslyckades: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    if (!fromPhoneNumber) {
      toast.error('Ange från-nummer');
      return;
    }
    
    const requiredFields = PROVIDER_CREDENTIALS_SCHEMA[provider] || [];
    const missingFields = requiredFields.filter(field => !credentials[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Saknas: ${missingFields.join(', ')}`);
      return;
    }

    // Add from_phone_number to config
    const config = { from_phone_number: fromPhoneNumber };
    
    if (smsIntegration) {
      // Update existing integration
      updateIntegration({
        integrationId: smsIntegration.id,
        updates: { config },
      });
    } else {
      // Create new integration
      addIntegration({
        provider,
        providerDisplayName: provider === 'twilio' ? 'Twilio' : 'Telnyx',
        capabilities: provider === 'twilio' 
          ? ['voice', 'sms', 'mms', 'video', 'fax']
          : ['voice', 'sms', 'mms', 'fax', 'number_management'],
        credentials,
        config,
      });
    }
  };

  const handleDelete = () => {
    if (smsIntegration) {
      deleteIntegration(smsIntegration.id);
    }
  };

  const handleRefresh = async () => {
    toast.loading('Uppdaterar integration...');
    await queryClient.invalidateQueries({ queryKey: ['integrations'] });
    toast.dismiss();
    toast.success('Integration uppdaterad');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-0 w-full">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
        {/* Radial gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
        
        {/* Snowflakes */}
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] opacity-5 pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_60s_linear_infinite]" />
        </div>
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] opacity-[0.03] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_45s_linear_infinite_reverse]" />
        </div>
        <div className="absolute -bottom-20 right-1/4 w-[400px] h-[400px] opacity-[0.04] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_80s_linear_infinite]" />
        </div>
        <div className="absolute top-10 left-1/3 w-[300px] h-[300px] opacity-[0.02] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_100s_linear_infinite_reverse]" />
        </div>
        <div className="absolute bottom-1/3 right-10 w-[250px] h-[250px] opacity-[0.03] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_70s_linear_infinite]" />
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-block">
                <span className="text-sm font-semibold tracking-wider text-primary uppercase">Integration</span>
                <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50 mt-2" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
                SMS-leverantör
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                Konfigurera din SMS-provider för att skicka meddelanden till kunder
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Quick Actions Bar */}
      {smsIntegration && (
        <section className="relative py-6 border-y border-primary/10 bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-muted-foreground">Live</span>
                </div>
                <Badge variant="secondary">{smsIntegration.provider === 'twilio' ? 'Twilio' : 'Telnyx'}</Badge>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleRefresh} variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Uppdatera
                </Button>
                <Button onClick={handleTest} disabled={isTesting} variant="outline" size="sm" className="gap-2">
                  <Send className="h-4 w-4" />
                  {isTesting ? "Testar..." : "Testa"}
                </Button>
                <Button onClick={handleSave} disabled={isAddingIntegration} size="sm" className="gap-2">
                  {isAddingIntegration ? "Sparar..." : "Spara"}
                </Button>
                <Button onClick={handleDelete} disabled={isDeletingIntegration} variant="destructive" size="sm" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Ta bort
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-8 py-8 space-y-8">
        {/* Status Overview */}
        {smsIntegration && (
          <AnimatedSection delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PremiumTelephonyStatCard
                title="Provider"
                value={smsIntegration.provider === 'twilio' ? 'Twilio' : 'Telnyx'}
                icon={MessageSquare}
                subtitle="Aktiv leverantör"
                color="text-blue-600"
              />
              <PremiumTelephonyStatCard
                title="Status"
                value={smsIntegration.is_active ? 'Aktiv' : 'Inaktiv'}
                icon={smsIntegration.is_active ? CheckCircle2 : AlertCircle}
                subtitle={smsIntegration.is_active ? 'Redo att använda' : 'Ej aktiv'}
                color={smsIntegration.is_active ? "text-green-600" : "text-red-600"}
                animate={smsIntegration.is_active}
              />
              <PremiumTelephonyStatCard
                title="Från-nummer"
                value={smsIntegration.config?.from_phone_number || 'N/A'}
                icon={Phone}
                subtitle="Avsändarnummer"
                color="text-purple-600"
              />
            </div>
          </AnimatedSection>
        )}

        {/* Success Alert */}
        {smsIntegration && (
          <AnimatedSection delay={200}>
            <Alert className="border-success/50 bg-success/5 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <AlertTitle>Integration aktiv</AlertTitle>
          <AlertDescription>
            <div className="space-y-1 mt-2 text-sm">
              Din SMS-integration är konfigurerad och redo att användas.
              {smsIntegration.last_synced_at && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">
                    Senast synkad: {format(new Date(smsIntegration.last_synced_at), 'PPP HH:mm', { locale: sv })}
                  </Badge>
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
          </AnimatedSection>
        )}

        {/* Webhook Info - Collapsible */}
        {smsIntegration && (
          <AnimatedSection delay={300}>
            <Collapsible open={webhookOpen} onOpenChange={setWebhookOpen}>
              <Card className="border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-xl hover:border-primary/30 transition-all duration-500">
            <CollapsibleTrigger className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    <CardTitle>Webhook-konfiguration</CardTitle>
                  </div>
                  <ExternalLink className="h-4 w-4" />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Konfigurera följande webhook URL i din {smsIntegration.provider === 'twilio' ? 'Twilio' : 'Telnyx'} dashboard
                  för att få realtidsuppdateringar om meddelandestatus:
                </p>
                <div className="p-3 bg-muted rounded-lg">
                  <code className="text-xs break-all">
                    https://shskknkivuewuqonjdjc.supabase.co/functions/v1/{smsIntegration.provider}-webhook
                  </code>
                </div>
                {smsIntegration.provider === 'twilio' && (
                  <p className="text-xs text-muted-foreground">
                    I Twilio Console: Phone Numbers → Din nummer → Messaging Configuration → 
                    "A MESSAGE COMES IN" webhook
                  </p>
                )}
                {smsIntegration.provider === 'telnyx' && (
                  <p className="text-xs text-muted-foreground">
                    I Telnyx Portal: Messaging → Messaging Profiles → Din profil → 
                    Webhooks → Add webhook URL
                  </p>
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
            </Collapsible>
          </AnimatedSection>
        )}

        {/* Configuration Form */}
        <AnimatedSection delay={400}>
          <Card className="border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-xl hover:border-primary/30 transition-all duration-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Provider-konfiguration
          </CardTitle>
          <CardDescription>
            {smsIntegration ? 'Uppdatera' : 'Konfigurera'} ditt SMS-providerkonto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Provider Selection */}
          <div className="space-y-3">
            <Label>Välj SMS-leverantör</Label>
            <RadioGroup value={provider} onValueChange={(value) => setProvider(value as SMSProvider)}>
              <div className="grid grid-cols-2 gap-4">
                <Label htmlFor="twilio" className="cursor-pointer">
                  <Card className={provider === 'twilio' ? 'ring-2 ring-primary bg-primary/5' : 'bg-card/50'}>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="twilio" id="twilio" />
                        <div>
                          <div className="font-semibold">Twilio</div>
                          <div className="text-xs text-muted-foreground">Globalt, pålitligt</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Label>
                <Label htmlFor="telnyx" className="cursor-pointer">
                  <Card className={provider === 'telnyx' ? 'ring-2 ring-primary bg-primary/5' : 'bg-card/50'}>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="telnyx" id="telnyx" />
                        <div>
                          <div className="font-semibold">Telnyx</div>
                          <div className="text-xs text-muted-foreground">Flexibelt, kostnadseffektivt</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Provider-specific Credentials */}
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            {provider === 'twilio' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="accountSid">Account SID</Label>
                  <Input
                    id="accountSid"
                    type="text"
                    placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    value={credentials.accountSid || ''}
                    onChange={(e) => setCredentials({ ...credentials, accountSid: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="authToken">Auth Token</Label>
                  <Input
                    id="authToken"
                    type="password"
                    placeholder="••••••••••••••••••••••••••••••••"
                    value={credentials.authToken || ''}
                    onChange={(e) => setCredentials({ ...credentials, authToken: e.target.value })}
                  />
                </div>
              </>
            )}

            {provider === 'telnyx' && (
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="KEY••••••••••••••••••••••••••••••••"
                  value={credentials.apiKey || ''}
                  onChange={(e) => setCredentials({ ...credentials, apiKey: e.target.value })}
                />
              </div>
            )}
          </div>

          {/* Phone Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromPhone">Från-nummer</Label>
              <Input
                id="fromPhone"
                type="tel"
                placeholder="+46XXXXXXXXX"
                value={fromPhoneNumber}
                onChange={(e) => setFromPhoneNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Telefonnumret som SMS kommer skickas från
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="testPhone">Test-nummer</Label>
              <Input
                id="testPhone"
                type="tel"
                placeholder="+46XXXXXXXXX"
                value={testPhoneNumber}
                onChange={(e) => setTestPhoneNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                För att verifiera konfigurationen
              </p>
            </div>
          </div>

          {/* Security Note */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Dina autentiseringsuppgifter krypteras säkert innan de sparas i databasen.
            </AlertDescription>
          </Alert>

          {/* Action Buttons - Only show if no integration exists */}
          {!smsIntegration && (
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              <Button onClick={handleTest} disabled={isTesting} variant="outline">
                {isTesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Testa konfiguration
              </Button>
              <Button onClick={handleSave} disabled={isAddingIntegration} size="lg">
                {isAddingIntegration && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Spara inställningar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
        </AnimatedSection>
      </div>
    </div>
  );
}
