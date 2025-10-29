import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, XCircle, Webhook, Key, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Integration } from "@/hooks/useIntegrations";

interface IntegrationTesterProps {
  integration: Integration | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TestType = 'webhook' | 'api' | 'sync';
type TestResult = {
  success: boolean;
  message: string;
  details?: any;
  responseTime?: number;
};

export function IntegrationTester({ integration, open, onOpenChange }: IntegrationTesterProps) {
  const [testing, setTesting] = useState<TestType | null>(null);
  const [results, setResults] = useState<Record<TestType, TestResult | null>>({
    webhook: null,
    api: null,
    sync: null,
  });

  if (!integration) return null;

  const runTest = async (testType: TestType) => {
    setTesting(testType);
    const startTime = Date.now();

    try {
      const { data, error } = await supabase.functions.invoke('test-integration', {
        body: {
          integration_id: integration.id,
          test_type: testType,
        },
      });

      const responseTime = Date.now() - startTime;

      if (error) throw error;

      const result: TestResult = {
        success: data.success,
        message: data.message,
        details: data.details,
        responseTime,
      };

      setResults(prev => ({ ...prev, [testType]: result }));
      
      if (result.success) {
        toast.success(`${testType === 'webhook' ? 'Webhook' : testType === 'api' ? 'API' : 'Sync'} test lyckades`);
      } else {
        toast.error(`${testType === 'webhook' ? 'Webhook' : testType === 'api' ? 'API' : 'Sync'} test misslyckades`);
      }
    } catch (error: any) {
      const result: TestResult = {
        success: false,
        message: error.message || 'Ett oväntat fel inträffade',
        responseTime: Date.now() - startTime,
      };
      setResults(prev => ({ ...prev, [testType]: result }));
      toast.error('Test misslyckades');
    } finally {
      setTesting(null);
    }
  };

  const triggerSync = async () => {
    setTesting('sync');
    const startTime = Date.now();

    try {
      const { data, error } = await supabase.functions.invoke('trigger-manual-sync', {
        body: {
          integration_id: integration.id,
        },
      });

      const responseTime = Date.now() - startTime;

      if (error) throw error;

      const result: TestResult = {
        success: data.success,
        message: data.message,
        details: data.details,
        responseTime,
      };

      setResults(prev => ({ ...prev, sync: result }));
      toast.success('Manuell synkronisering startad');
    } catch (error: any) {
      const result: TestResult = {
        success: false,
        message: error.message || 'Kunde inte starta synkronisering',
        responseTime: Date.now() - startTime,
      };
      setResults(prev => ({ ...prev, sync: result }));
      toast.error('Synkronisering misslyckades');
    } finally {
      setTesting(null);
    }
  };

  const isTelephony = integration.provider_type === 'telephony' || integration.provider_type === 'multi';
  const isCalendar = integration.provider_type === 'calendar';

  const ResultDisplay = ({ result }: { result: TestResult | null }) => {
    if (!result) return null;

    return (
      <Alert variant={result.success ? "default" : "destructive"}>
        <div className="flex items-start gap-2">
          {result.success ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-destructive" />
          )}
          <div className="flex-1">
            <AlertDescription>
              <p className="font-medium">{result.message}</p>
              {result.responseTime && (
                <p className="text-xs text-muted-foreground mt-1">
                  Responstid: {result.responseTime}ms
                </p>
              )}
              {result.details && (
                <pre className="text-xs mt-2 p-2 bg-muted rounded overflow-auto max-h-32">
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              )}
            </AlertDescription>
          </div>
        </div>
      </Alert>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Testa integration: {integration.provider}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isTelephony && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    <Webhook className="h-4 w-4" />
                    Webhook Test
                  </h3>
                  <Button
                    onClick={() => runTest('webhook')}
                    disabled={testing !== null}
                    size="sm"
                  >
                    {testing === 'webhook' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Testa Webhook
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Skickar ett mock-event till webhook URL och verifierar svar
                </p>
                <ResultDisplay result={results.webhook} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    API-anslutning
                  </h3>
                  <Button
                    onClick={() => runTest('api')}
                    disabled={testing !== null}
                    size="sm"
                  >
                    {testing === 'api' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Testa API
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Verifierar credentials genom att göra ett API-anrop
                </p>
                <ResultDisplay result={results.api} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Manuell Synkronisering
                  </h3>
                  <Button
                    onClick={triggerSync}
                    disabled={testing !== null}
                    size="sm"
                  >
                    {testing === 'sync' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Synka Nu
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Startar en manuell synkronisering av samtal och meddelanden
                </p>
                <ResultDisplay result={results.sync} />
              </div>
            </>
          )}

          {isCalendar && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    API-anslutning
                  </h3>
                  <Button
                    onClick={() => runTest('api')}
                    disabled={testing !== null}
                    size="sm"
                  >
                    {testing === 'api' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Testa API
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Verifierar OAuth/API credentials
                </p>
                <ResultDisplay result={results.api} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Synka händelser
                  </h3>
                  <Button
                    onClick={triggerSync}
                    disabled={testing !== null}
                    size="sm"
                  >
                    {testing === 'sync' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Synka händelser
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Manuellt trigga inbound/outbound synkronisering
                </p>
                <ResultDisplay result={results.sync} />
              </div>
            </>
          )}

          {integration.last_synced_at && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Senaste synkronisering:{" "}
                {new Date(integration.last_synced_at).toLocaleString('sv-SE')}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
