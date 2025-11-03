import { useState, useMemo } from "react";
import { OpenRouterHeader } from "@/components/dashboard/openrouter/OpenRouterHeader";
import { ConnectionStatusBanner } from "@/components/dashboard/openrouter/ConnectionStatusBanner";
import { AccountBalanceCards } from "@/components/dashboard/openrouter/AccountBalanceCards";
import { APIKeysTable } from "@/components/dashboard/openrouter/APIKeysTable";
import { SpendOverview } from "@/components/dashboard/openrouter/SpendOverview";
import { CostTrendChart } from "@/components/dashboard/openrouter/CostTrendChart";
import { TopModelsCard } from "@/components/dashboard/openrouter/TopModelsCard";
import { UseCaseBreakdown } from "@/components/dashboard/openrouter/UseCaseBreakdown";
import { SpendInsights } from "@/components/dashboard/openrouter/SpendInsights";
import { useOpenRouterCredits } from "@/hooks/useOpenRouterCredits";
import { useOpenRouterKeyInfo } from "@/hooks/useOpenRouterKeyInfo";
import { useOpenRouterKeys } from "@/hooks/useOpenRouterKeys";
import { useOpenRouterKeysList } from "@/hooks/useOpenRouterKeysList";
import { useOpenRouterAccountSnapshots } from "@/hooks/useOpenRouterAccountSnapshots";
import { useOpenRouterActivity } from "@/hooks/useOpenRouterActivity";
import { OpenRouterSetupModal } from "@/components/integrations/OpenRouterSetupModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { subDays, startOfDay, endOfDay } from "date-fns";

const OpenRouterDashboard = () => {
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  // Fetch data
  const { data: keysStatus } = useOpenRouterKeys();
  const { data: credits, isLoading: isLoadingCredits } = useOpenRouterCredits();
  const { data: keyInfo, isLoading: isLoadingKeyInfo } = useOpenRouterKeyInfo();
  const { data: keysList, isLoading: isLoadingKeys } = useOpenRouterKeysList(
    keysStatus?.provisioning_key_exists || false
  );
  const { data: snapshots } = useOpenRouterAccountSnapshots();

  const apiKeyExists = keysStatus?.api_key_exists || false;
  const provisioningKeyExists = keysStatus?.provisioning_key_exists || false;

  const lastSnapshot = snapshots?.[0];

  // Date ranges for different periods
  const dateRanges = {
    '7d': { from: startOfDay(subDays(new Date(), 7)), to: endOfDay(new Date()) },
    '30d': { from: startOfDay(subDays(new Date(), 30)), to: endOfDay(new Date()) },
    '90d': { from: startOfDay(subDays(new Date(), 90)), to: endOfDay(new Date()) }
  };

  const { data: activityData, isLoading: isLoadingActivity } = useOpenRouterActivity(
    dateRanges[selectedPeriod],
    apiKeyExists
  );

  // Process activity data for visualizations
  const processedData = useMemo(() => {
    if (!activityData?.data) {
      return {
        dailyCosts: [],
        topModels: [],
        useCases: [],
        totalSpend: 0,
        insights: []
      };
    }

    const activity = activityData.data;
    
    // Calculate daily costs
    const dailyCostsMap = new Map<string, number>();
    activity.forEach((item: any) => {
      const date = new Date(item.created_at).toISOString().split('T')[0];
      const cost = (item.total_cost || 0) * 11; // Convert USD to SEK
      dailyCostsMap.set(date, (dailyCostsMap.get(date) || 0) + cost);
    });

    const dailyCosts = Array.from(dailyCostsMap.entries())
      .map(([date, cost]) => ({ date, cost }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate total spend
    const totalSpend = dailyCosts.reduce((sum, item) => sum + item.cost, 0);

    // Calculate top models
    const modelCostsMap = new Map<string, { cost: number; calls: number }>();
    activity.forEach((item: any) => {
      const model = item.model || 'Unknown';
      const cost = (item.total_cost || 0) * 11;
      const existing = modelCostsMap.get(model) || { cost: 0, calls: 0 };
      modelCostsMap.set(model, {
        cost: existing.cost + cost,
        calls: existing.calls + 1
      });
    });

    const topModels = Array.from(modelCostsMap.entries())
      .map(([model, data]) => ({
        model,
        cost: data.cost,
        calls: data.calls,
        percentage: totalSpend > 0 ? (data.cost / totalSpend) * 100 : 0
      }))
      .sort((a, b) => b.cost - a.cost);

    // Generate insights
    const insights = [];
    if (totalSpend > 1000) {
      insights.push({
        type: 'warning' as const,
        message: `Hög användning: ${totalSpend.toFixed(2)} SEK spenderat de senaste ${selectedPeriod === '7d' ? '7 dagarna' : selectedPeriod === '30d' ? '30 dagarna' : '90 dagarna'}`
      });
    }
    if (topModels.length > 0 && topModels[0].percentage > 70) {
      insights.push({
        type: 'info' as const,
        message: `${topModels[0].model} står för ${topModels[0].percentage.toFixed(1)}% av total kostnad`
      });
    }

    return {
      dailyCosts,
      topModels,
      useCases: [],
      totalSpend,
      insights
    };
  }, [activityData, selectedPeriod]);

  return (
    <div className="space-y-6 p-6">
      <OpenRouterHeader
        lastSyncAt={lastSnapshot?.created_at}
        onSettingsClick={() => setShowSetupModal(true)}
      />

      <ConnectionStatusBanner
        apiKeyExists={apiKeyExists}
        provisioningKeyExists={provisioningKeyExists}
        rateLimitRequests={keyInfo?.data?.rate_limit?.requests}
        rateLimitInterval={keyInfo?.data?.rate_limit?.interval}
        onSetupClick={() => setShowSetupModal(true)}
      />

      {isLoadingCredits || isLoadingKeyInfo ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : (
        <AccountBalanceCards
          totalCredits={credits?.data?.total_credits}
          totalUsage={credits?.data?.total_usage}
          limitRemaining={keyInfo?.data?.limit_remaining}
          rateLimitRequests={keyInfo?.data?.rate_limit?.requests}
          rateLimitInterval={keyInfo?.data?.rate_limit?.interval}
        />
      )}

      <Tabs value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as '7d' | '30d' | '90d')}>
        <TabsList>
          <TabsTrigger value="7d">7 dagar</TabsTrigger>
          <TabsTrigger value="30d">30 dagar</TabsTrigger>
          <TabsTrigger value="90d">90 dagar</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedPeriod} className="space-y-6 mt-6">
          <SpendOverview
            totalSpend={processedData.totalSpend}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <CostTrendChart
              data={processedData.dailyCosts}
              isLoading={isLoadingActivity}
            />
            <TopModelsCard
              models={processedData.topModels}
              isLoading={isLoadingActivity}
            />
          </div>

          {processedData.insights.length > 0 && (
            <SpendInsights insights={processedData.insights} />
          )}
        </TabsContent>
      </Tabs>

      <APIKeysTable
        keys={keysList}
        isLoading={isLoadingKeys}
        hasProvisioningKey={provisioningKeyExists}
        onSetupClick={() => setShowSetupModal(true)}
      />

      <OpenRouterSetupModal
        open={showSetupModal}
        onOpenChange={setShowSetupModal}
      />
    </div>
  );
};

export default OpenRouterDashboard;
