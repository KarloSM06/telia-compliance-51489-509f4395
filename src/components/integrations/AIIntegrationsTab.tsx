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
import { useState } from "react";

export function AIIntegrationsTab() {
  const navigate = useNavigate();
  const { settings } = useAISettings();
  const { usage, isLoading } = useAIUsage({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [setupModalOpen, setSetupModalOpen] = useState(false);

  const isOpenRouterConfigured = settings?.ai_provider === 'openrouter' && settings?.openrouter_api_key_encrypted;

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
    </div>
  );
}
