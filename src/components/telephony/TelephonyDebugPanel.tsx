import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTelephonyMetrics } from "@/hooks/useTelephonyMetrics";
import { useIntegrations } from "@/hooks/useIntegrations";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, ExternalLink, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const TelephonyDebugPanel = () => {
  const { metrics, refetch } = useTelephonyMetrics();
  const { integrations } = useIntegrations();
  const [syncing, setSyncing] = useState(false);

  const telephonyIntegrations = integrations.filter(
    i => i.provider_type === 'telephony' || i.provider_type === 'multi'
  );

  const handleManualSync = async () => {
    setSyncing(true);
    try {
      const { error } = await supabase.functions.invoke('telephony-account-sync');
      
      if (error) throw error;
      
      toast.success('Synkning startad!');
      setTimeout(() => {
        refetch();
      }, 2000);
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Synkning misslyckades');
    } finally {
      setSyncing(false);
    }
  };

  const handleInitialSync = async (integrationId: string) => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('initial-telephony-sync', {
        body: { integrationId, daysBack: 30 }
      });
      
      if (error) throw error;
      
      toast.success(`Historisk synkning klar: ${data.count} händelser`);
      refetch();
    } catch (error) {
      console.error('Initial sync error:', error);
      toast.error('Historisk synkning misslyckades');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Debug Panel - Telefonidata
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Totala händelser</p>
            <p className="text-2xl font-bold">{metrics.totalEvents}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Samtal</p>
            <p className="text-2xl font-bold">{metrics.totalCalls}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">SMS</p>
            <p className="text-2xl font-bold">{metrics.totalSMS}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total kostnad</p>
            <p className="text-2xl font-bold">{metrics.totalCost.toFixed(2)} SEK</p>
          </div>
        </div>

        {/* Per Provider */}
        <div className="space-y-2">
          <h4 className="font-semibold">Per leverantör:</h4>
          {Object.entries(metrics.byProvider).map(([provider, data]: [string, any]) => (
            <div key={provider} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant="outline">{provider.toUpperCase()}</Badge>
                <div className="text-sm">
                  <span className="font-medium">{data.calls}</span> samtal • 
                  <span className="font-medium ml-1">{data.sms}</span> SMS
                </div>
              </div>
              <div className="text-sm font-medium">{data.cost.toFixed(2)} SEK</div>
            </div>
          ))}
        </div>

        {/* Active Integrations */}
        <div className="space-y-2">
          <h4 className="font-semibold">Aktiva integrationer:</h4>
          {telephonyIntegrations.map(integration => (
            <div key={integration.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Badge variant={integration.is_active ? "default" : "secondary"}>
                  {integration.provider}
                </Badge>
                {integration.last_synced_at ? (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <CheckCircle className="h-3 w-3" />
                    Senast synkad: {new Date(integration.last_synced_at).toLocaleString('sv-SE')}
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Aldrig synkad</span>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleInitialSync(integration.id)}
                disabled={syncing}
              >
                Synka historik (30 dagar)
              </Button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleManualSync}
            disabled={syncing}
            className="flex-1"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Synkar...' : 'Synka nu (senaste 100)'}
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open('https://supabase.com/dashboard/project/shskknkivuewuqonjdjc/editor', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Öppna Supabase
          </Button>
        </div>

        {/* Info */}
        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded">
          <p className="font-semibold mb-1">ℹ️ Information:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Automatisk synkning körs var 15:e minut via cron job</li>
            <li>"Synka nu" hämtar de senaste 100 händelserna från varje provider</li>
            <li>"Synka historik" hämtar alla händelser från senaste 30 dagarna</li>
            <li>Data lagras i `telephony_events` tabellen</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
