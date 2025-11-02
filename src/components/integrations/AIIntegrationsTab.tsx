import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAISettings } from "@/hooks/useAISettings";
import { useAIUsage } from "@/hooks/useAIUsage";
import { Settings, TrendingUp, Zap, DollarSign, Activity, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AreaChartComponent } from "@/components/dashboard/charts/AreaChartComponent";
import { PieChartComponent } from "@/components/dashboard/charts/PieChartComponent";
import { startOfMonth, endOfMonth } from "date-fns";
import { OpenRouterSetupModal } from "./OpenRouterSetupModal";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, TestTube } from "lucide-react";

export function AIIntegrationsTab() {
  const navigate = useNavigate();
  const { settings } = useAISettings();
  const { usage, isLoading } = useAIUsage({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [isRealtime, setIsRealtime] = useState(false);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  const isOpenRouterConfigured = settings?.ai_provider === 'openrouter' && settings?.openrouter_api_key_encrypted;

  // Realtime indicator for new AI usage
  useEffect(() => {
    const channel = supabase
      .channel('ai-usage-status')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'ai_usage_logs' },
        () => {
          setIsRealtime(true);
          setTimeout(() => setIsRealtime(false), 3000);
        }
      )
      .subscribe();

    return () => { 
      supabase.removeChannel(channel); 
    };
  }, []);

  const handleTestEndpoints = async () => {
    setIsTesting(true);
    setTestModalOpen(true);
    setTestResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('test-openrouter-endpoints', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      setTestResults(data);
      toast.success('Endpoint-test genomfört');
    } catch (error) {
      console.error('Test failed:', error);
      toast.error('Test misslyckades');
      setTestResults({
        error: error instanceof Error ? error.message : 'Unknown error',
        summary: '❌ Test kunde inte genomföras'
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>OpenRouter Connection</CardTitle>
              <CardDescription>
                {isOpenRouterConfigured 
                  ? "Din OpenRouter-nyckel är konfigurerad och aktiv"
                  : "Konfigurera OpenRouter för att använda dina egna modeller"}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={isOpenRouterConfigured ? "outline" : "default"}
                onClick={() => setSetupModalOpen(true)}
              >
                {isOpenRouterConfigured ? (
                  <>
                    <Pencil className="h-4 w-4 mr-2" />
                    Redigera
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4 mr-2" />
                    Konfigurera
                  </>
                )}
              </Button>
              {isOpenRouterConfigured && (
                <Button
                  variant="outline"
                  onClick={handleTestEndpoints}
                  disabled={isTesting}
                >
                  {isTesting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Testar...</>
                  ) : (
                    <><TestTube className="mr-2 h-4 w-4" /> Testa Endpoints</>
                  )}
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate('/dashboard/settings?tab=ai')}>
                Avancerade inställningar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${isOpenRouterConfigured ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-sm font-medium">
                {isOpenRouterConfigured ? 'Ansluten' : 'Ej konfigurerad'}
              </span>
            </div>
            {settings?.ai_provider && (
              <Badge variant="outline">
                Provider: {settings.ai_provider === 'openrouter' ? 'OpenRouter' : 'Lovable AI'}
              </Badge>
            )}
            {settings?.default_model && (
              <Badge variant="outline">
                Standardmodell: {settings.default_model}
              </Badge>
            )}
            <Badge variant={isRealtime ? "default" : "outline"} className="animate-in fade-in">
              {isRealtime ? "🟢 Realtid aktiverad" : "⏸️ Väntar på data"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Usage Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total kostnad (denna månad)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : `${usage?.totalCostSEK.toFixed(2) || '0.00'} SEK`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens använt</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : (usage?.totalTokens.toLocaleString() || '0')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI-anrop</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : (usage?.totalCalls || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Snitt kostnad/anrop</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : usage?.totalCalls 
                ? `${(usage.totalCostSEK / usage.totalCalls).toFixed(2)} SEK`
                : '0.00 SEK'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Kostnad per modell</CardTitle>
            <CardDescription>Fördelning av AI-kostnader per modell</CardDescription>
          </CardHeader>
          <CardContent>
            {!isLoading && usage?.costByModel && usage.costByModel.length > 0 ? (
              <PieChartComponent
                title=""
                data={usage.costByModel.map(m => ({
                  name: m.model.split('/').pop() || m.model,
                  value: m.cost,
                }))}
                height={300}
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Ingen data ännu
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kostnad per användningsområde</CardTitle>
            <CardDescription>Hur AI används i olika delar av systemet</CardDescription>
          </CardHeader>
          <CardContent>
            {!isLoading && usage?.costByUseCase && usage.costByUseCase.length > 0 ? (
              <PieChartComponent
                title=""
                data={usage.costByUseCase.map(u => ({
                  name: u.useCase || 'Okänt',
                  value: u.cost,
                }))}
                height={300}
              />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Ingen data ännu
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Kostnad över tid</CardTitle>
          <CardDescription>Daglig AI-kostnad denna månad</CardDescription>
        </CardHeader>
        <CardContent>
          {!isLoading && usage?.dailyCosts && usage.dailyCosts.length > 0 ? (
            <AreaChartComponent
              title=""
              data={usage.dailyCosts.map(d => ({
                name: new Date(d.date).toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' }),
                kostnad: d.cost,
              }))}
              dataKeys={[
                { key: 'kostnad', color: 'hsl(var(--primary))', name: 'Kostnad (SEK)' }
              ]}
              height={300}
            />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Ingen data ännu
            </div>
          )}
        </CardContent>
      </Card>

      {/* Model Usage Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detaljerad modellstatistik</CardTitle>
          <CardDescription>Alla modeller sorterade efter kostnad</CardDescription>
        </CardHeader>
        <CardContent>
          {!isLoading && usage?.costByModel && usage.costByModel.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="pb-2 font-medium">Modell</th>
                    <th className="pb-2 font-medium text-right">Anrop</th>
                    <th className="pb-2 font-medium text-right">Tokens</th>
                    <th className="pb-2 font-medium text-right">Kostnad (SEK)</th>
                    <th className="pb-2 font-medium text-right">Snitt/anrop</th>
                  </tr>
                </thead>
                <tbody>
                  {usage.costByModel
                    .sort((a, b) => b.cost - a.cost)
                    .map((model, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-3">{model.model}</td>
                        <td className="py-3 text-right">{model.calls}</td>
                        <td className="py-3 text-right">{model.tokens.toLocaleString()}</td>
                        <td className="py-3 text-right font-medium">{model.cost.toFixed(2)}</td>
                        <td className="py-3 text-right text-muted-foreground">
                          {(model.cost / model.calls).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              Ingen användning ännu
            </div>
          )}
        </CardContent>
      </Card>

      <OpenRouterSetupModal 
        open={setupModalOpen} 
        onOpenChange={setSetupModalOpen}
      />

      <Dialog open={testModalOpen} onOpenChange={setTestModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>OpenRouter Endpoint Test</DialogTitle>
            <DialogDescription>
              Verifierar funktionalitet för /api/v1/generation och /api/v1/activity
            </DialogDescription>
          </DialogHeader>

          {isTesting && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3">Testar endpoints...</span>
            </div>
          )}

          {testResults && !isTesting && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Sammanfattning</h3>
                <p className="text-sm">{testResults.summary}</p>
                {testResults.recommendation && (
                  <p className="text-sm mt-2">
                    <strong>Rekommendation:</strong> {testResults.recommendation}
                  </p>
                )}
              </div>

              {/* Generation Endpoint */}
              {testResults.generation_endpoint && (
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">/api/v1/generation</h3>
                    <Badge variant={testResults.generation_endpoint.status === 'success' ? 'default' : 'destructive'}>
                      {testResults.generation_endpoint.status === 'success' ? '✅ Fungerar' : '❌ Error'}
                    </Badge>
                  </div>
                  {testResults.generation_endpoint.error && (
                    <p className="text-sm text-destructive mb-2">{testResults.generation_endpoint.error}</p>
                  )}
                  {testResults.generation_endpoint.data_sample && (
                    <div className="text-sm space-y-1">
                      <p><strong>Antal poster:</strong> {testResults.generation_endpoint.data_sample.total_records}</p>
                      <p><strong>Format:</strong> {testResults.generation_endpoint.data_format}</p>
                      <p><strong>Svarstid:</strong> {testResults.generation_endpoint.response_time_ms}ms</p>
                    </div>
                  )}
                </div>
              )}

              {/* Activity Endpoint */}
              {testResults.activity_endpoint && (
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">/api/v1/activity</h3>
                    <Badge variant={testResults.activity_endpoint.status === 'success' ? 'default' : 'destructive'}>
                      {testResults.activity_endpoint.status === 'success' ? '✅ Fungerar' : '❌ Error'}
                    </Badge>
                  </div>
                  {testResults.activity_endpoint.error && (
                    <p className="text-sm text-destructive mb-2">{testResults.activity_endpoint.error}</p>
                  )}
                  {testResults.activity_endpoint.data_sample && (
                    <div className="text-sm space-y-1">
                      <p><strong>Antal poster:</strong> {testResults.activity_endpoint.data_sample.total_records}</p>
                      <p><strong>Format:</strong> {testResults.activity_endpoint.data_format}</p>
                      <p><strong>Svarstid:</strong> {testResults.activity_endpoint.response_time_ms}ms</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
