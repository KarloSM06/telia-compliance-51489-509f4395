import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Brain, Activity, DollarSign, TrendingUp, BarChart3, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { useOpenRouterKeys } from "@/hooks/useOpenRouterKeys";
import { OpenRouterSetupModal } from "./OpenRouterSetupModal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useAIUsage } from "@/hooks/useAIUsage";

export function AIIntegrationsTab() {
  const [showSetupModal, setShowSetupModal] = useState(false);
  const navigate = useNavigate();
  const { data: keysStatus } = useOpenRouterKeys();
  const { usage: aiUsage } = useAIUsage({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  const apiKeyConfigured = keysStatus?.api_key_exists || false;
  const provisioningKeyConfigured = keysStatus?.provisioning_key_exists || false;

  const totalCost = aiUsage?.total_cost_sek || 0;
  const totalTokens = aiUsage?.total_tokens || 0;
  const totalCalls = aiUsage?.total_calls || 0;
  const avgCost = totalCalls > 0 ? totalCost / totalCalls : 0;

  return (
    <div className="space-y-6">
      <Alert className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <Brain className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <div>
            <p className="font-medium">OpenRouter Dashboard</p>
            <p className="text-sm text-muted-foreground">Se all din OpenRouter-data på ett ställe</p>
          </div>
          <Button onClick={() => navigate('/dashboard/openrouter')} variant="secondary">
            <ArrowRight className="h-4 w-4 mr-2" />
            Gå till Dashboard
          </Button>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            OpenRouter Integration
          </CardTitle>
          <CardDescription>
            Hantera dina OpenRouter API-nycklar och övervaka användning
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {apiKeyConfigured ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm font-medium">API Key</span>
                <Badge variant={apiKeyConfigured ? "default" : "secondary"}>
                  {apiKeyConfigured ? "Konfigurerad" : "Inte konfigurerad"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {provisioningKeyConfigured ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm font-medium">Provisioning Key</span>
                <Badge variant={provisioningKeyConfigured ? "default" : "secondary"}>
                  {provisioningKeyConfigured ? "Konfigurerad" : "Inte konfigurerad"}
                </Badge>
              </div>
            </div>
            <Button onClick={() => setShowSetupModal(true)}>
              {apiKeyConfigured || provisioningKeyConfigured ? "Hantera Nycklar" : "Konfigurera"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {apiKeyConfigured && (
        <Card>
          <CardHeader>
            <CardTitle>Användningsöversikt (senaste 30 dagar)</CardTitle>
            <CardDescription>Statistik från dina AI-anrop</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Total Kostnad
                </p>
                <p className="text-2xl font-bold">
                  {totalCost.toFixed(2)} SEK
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Totala Tokens
                </p>
                <p className="text-2xl font-bold">
                  {totalTokens.toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Anrop
                </p>
                <p className="text-2xl font-bold">
                  {totalCalls}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Snitt/Anrop
                </p>
                <p className="text-2xl font-bold">
                  {avgCost.toFixed(2)} SEK
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <OpenRouterSetupModal
        open={showSetupModal}
        onOpenChange={setShowSetupModal}
      />
    </div>
  );
}
