import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAISettings } from "@/hooks/useAISettings";
import { useAIUsage } from "@/hooks/useAIUsage";
import { useOpenRouterCredits } from "@/hooks/useOpenRouterCredits";
import { useOpenRouterKeyInfo } from "@/hooks/useOpenRouterKeyInfo";
import { useOpenRouterModels } from "@/hooks/useOpenRouterModels";
import { useOpenRouterActivity } from "@/hooks/useOpenRouterActivity";
import { Settings, TrendingUp, Zap, DollarSign, Activity, Pencil, CreditCard, BarChart3, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AreaChartComponent } from "@/components/dashboard/charts/AreaChartComponent";
import { PieChartComponent } from "@/components/dashboard/charts/PieChartComponent";
import { BarChartComponent } from "@/components/dashboard/charts/BarChartComponent";
import { startOfMonth, endOfMonth, subDays } from "date-fns";
import { OpenRouterSetupModal } from "./OpenRouterSetupModal";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AIIntegrationsTab() {
  const navigate = useNavigate();
  const { settings } = useAISettings();
  const { usage, isLoading } = useAIUsage({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [isRealtime, setIsRealtime] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const isOpenRouterConfigured = settings?.ai_provider === 'openrouter' && settings?.openrouter_api_key_encrypted;
  const hasProvisioningKey = !!settings?.openrouter_provisioning_key_encrypted;

  // Fetch OpenRouter data
  const { data: credits } = useOpenRouterCredits();
  const { data: keyInfo } = useOpenRouterKeyInfo();
  const { data: models } = useOpenRouterModels();
  const { data: activityData } = useOpenRouterActivity(dateRange, hasProvisioningKey);

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
              <Button variant="outline" onClick={() => navigate('/dashboard/settings?tab=ai')}>
                Avancerade inställningar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
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

          {isOpenRouterConfigured && (
            <div className="pt-3 border-t">
              <h4 className="text-sm font-semibold mb-2">📊 Tracking Status</h4>
              <div className="space-y-2 text-sm">
                {/* API Key tracking */}
                <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                  <div>
                    <span className="font-medium">Realtids AI-tracking</span>
                    <p className="text-xs text-muted-foreground">
                      Varje AI-anrop loggas direkt till ai_usage_logs
                    </p>
                  </div>
                  <Badge variant="default" className="bg-green-600">Aktiv</Badge>
                </div>
                
                {hasProvisioningKey ? (
                  <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/20 rounded">
                    <div>
                      <span className="font-medium">Historik-tracking (OpenRouter)</span>
                      <p className="text-xs text-muted-foreground">
                        Aggregerad data från /activity endpoint
                      </p>
                    </div>
                    <Badge variant="default" className="bg-green-600">Aktiv</Badge>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900/20 rounded">
                    <div>
                      <span className="font-medium">Historik-tracking</span>
                      <p className="text-xs text-muted-foreground">
                        Lägg till Provisioning Key för historisk data
                      </p>
                    </div>
                    <Badge variant="secondary">Inaktiv</Badge>
                  </div>
                )}
                
                {/* Credit monitoring */}
                <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                  <div>
                    <span className="font-medium">Credit Monitoring</span>
                    <p className="text-xs text-muted-foreground">
                      Uppdateras varje minut från /credits endpoint
                    </p>
                  </div>
                  <Badge variant="default" className="bg-green-600">
                    {credits ? `$${credits.limit_remaining?.toFixed(2)} kvar` : 'Aktiv'}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Overview - Only show if OpenRouter is configured */}
      {isOpenRouterConfigured && (
        <Card>
          <CardHeader>
            <CardTitle>📊 Account Overview</CardTitle>
            <CardDescription>Din OpenRouter-kontoinformation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {/* Credit Balance Card */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">Credit Balance</div>
                </div>
                <div className="text-2xl font-bold">
                  ${credits?.limit_remaining?.toFixed(2) || '0.00'}
                </div>
                <div className="text-xs text-muted-foreground">
                  of ${credits?.total_credits?.toFixed(2) || '0.00'}
                </div>
              </div>
              
              {/* Usage This Month Card */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">Usage This Month</div>
                </div>
                <div className="text-2xl font-bold">
                  ${credits?.total_usage?.toFixed(2) || '0.00'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {credits?.limit_remaining && credits?.total_credits 
                    ? `${((credits.total_usage / credits.total_credits) * 100).toFixed(1)}% used`
                    : 'N/A'}
                </div>
              </div>
              
              {/* Rate Limit Card */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">Rate Limit</div>
                </div>
                <div className="text-2xl font-bold">
                  {keyInfo?.data?.rate_limit?.requests || 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">
                  requests per {keyInfo?.data?.rate_limit?.interval || '10s'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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

      {/* Available Models - Only show if OpenRouter is configured */}
      {isOpenRouterConfigured && models?.data && (
        <Card>
          <CardHeader>
            <CardTitle>🤖 Available Models</CardTitle>
            <CardDescription>
              Alla modeller du kan använda med din OpenRouter API-nyckel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {models.data.slice(0, 20).map((model: any) => (
                <div key={model.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{model.name || model.id}</div>
                    <div className="text-xs text-muted-foreground">{model.id}</div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-muted-foreground">
                      ${model.pricing?.prompt || 'N/A'}/token (prompt)
                    </div>
                    <div className="text-muted-foreground">
                      ${model.pricing?.completion || 'N/A'}/token (completion)
                    </div>
                  </div>
                </div>
              ))}
              {models.data.length > 20 && (
                <p className="text-xs text-center text-muted-foreground pt-2">
                  Visar 20 av {models.data.length} modeller
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity History - Only show if provisioning key is configured */}
      {hasProvisioningKey && activityData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>📈 Activity History</CardTitle>
                <CardDescription>
                  Aggregerad användning per dag och modell (kräver provisioning key)
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    const { data, error } = await supabase.functions.invoke('sync-openrouter-activity', {
                      body: {
                        start_date: dateRange.from.toISOString().split('T')[0],
                        end_date: dateRange.to.toISOString().split('T')[0],
                      }
                    });
                    
                    if (error) throw error;
                    
                    toast.success(`Synkade ${data.synced_records} poster från OpenRouter`);
                  } catch (error) {
                    console.error('Sync error:', error);
                    toast.error('Kunde inte synka data från OpenRouter');
                  }
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Synka från OpenRouter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Activity Chart */}
              {activityData?.data && activityData.data.length > 0 ? (
                <>
                  <div className="h-[300px]">
                    <BarChartComponent
                      title=""
                      data={activityData.data.slice(0, 30).map((row: any) => ({
                        name: row.date,
                        cost: row.cost,
                        requests: row.requests,
                      }))}
                      dataKeys={[
                        { key: 'cost', color: 'hsl(var(--primary))', name: 'Cost ($)' },
                        { key: 'requests', color: 'hsl(var(--chart-2))', name: 'Requests' },
                      ]}
                      height={300}
                    />
                  </div>
                  
                  {/* Activity Table */}
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Model</TableHead>
                          <TableHead className="text-right">Requests</TableHead>
                          <TableHead className="text-right">Tokens</TableHead>
                          <TableHead className="text-right">Cost</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activityData.data.slice(0, 10).map((row: any, i: number) => (
                          <TableRow key={i}>
                            <TableCell>{row.date}</TableCell>
                            <TableCell className="font-mono text-xs">{row.model}</TableCell>
                            <TableCell className="text-right">{row.requests}</TableCell>
                            <TableCell className="text-right">{row.total_tokens?.toLocaleString()}</TableCell>
                            <TableCell className="text-right font-medium">${row.cost?.toFixed(4)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {activityData.data.length > 10 && (
                      <div className="p-2 text-center text-xs text-muted-foreground border-t">
                        Visar 10 av {activityData.data.length} rader
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  Ingen aktivitetshistorik hittades
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
    </div>
  );
}
