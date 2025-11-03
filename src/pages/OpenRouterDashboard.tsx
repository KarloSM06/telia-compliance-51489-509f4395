import { useState, useMemo } from "react";
import { OpenRouterHeader } from "@/components/dashboard/openrouter/OpenRouterHeader";
import { ConnectionStatusBanner } from "@/components/dashboard/openrouter/ConnectionStatusBanner";
import { AccountBalanceCards } from "@/components/dashboard/openrouter/AccountBalanceCards";
import { APIKeysTable } from "@/components/dashboard/openrouter/APIKeysTable";
import { APIKeysOverview } from "@/components/dashboard/openrouter/APIKeysOverview";
import { SpendOverview } from "@/components/dashboard/openrouter/SpendOverview";
import { CostTrendChart } from "@/components/dashboard/openrouter/CostTrendChart";
import { TopModelsCard } from "@/components/dashboard/openrouter/TopModelsCard";
import { APIModelsOverview } from "@/components/dashboard/openrouter/APIModelsOverview";
import { MultiLineModelCostChart } from "@/components/dashboard/openrouter/MultiLineModelCostChart";
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
        modelOverview: [],
        modelCostsOverTime: [],
        modelNames: [],
        totalSpend: 0,
        avgDailyCost: 0,
        highestCostDay: 0,
        periodDays: selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90
      };
    }

    const activity = activityData.data;
    
    // Calculate daily costs
    const dailyCostsMap = new Map<string, number>();
    activity.forEach((item: any) => {
      if (!item.created_at) return;
      const dateObj = new Date(item.created_at);
      if (isNaN(dateObj.getTime())) return;
      const date = dateObj.toISOString().split('T')[0];
      const cost = (item.total_cost || 0) * 11;
      dailyCostsMap.set(date, (dailyCostsMap.get(date) || 0) + cost);
    });

    const dailyCosts = Array.from(dailyCostsMap.entries())
      .map(([date, cost]) => ({ date, cost }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate total spend and metrics
    const totalSpend = dailyCosts.reduce((sum, item) => sum + item.cost, 0);
    const periodDays = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 90;
    const avgDailyCost = dailyCosts.length > 0 ? totalSpend / dailyCosts.length : 0;
    const highestCostDay = dailyCosts.length > 0 
      ? Math.max(...dailyCosts.map(d => d.cost))
      : 0;

    // Calculate model costs and calls
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

    // Model overview for grid display
    const modelOverview = Array.from(modelCostsMap.entries()).map(([model, data]) => ({
      model,
      cost: data.cost,
      calls: data.calls,
      percentage: totalSpend > 0 ? (data.cost / totalSpend) * 100 : 0,
      avgCostPerCall: data.calls > 0 ? data.cost / data.calls : 0,
      status: data.calls > 0 ? 'active' as const : 'inactive' as const
    })).sort((a, b) => b.cost - a.cost);

    // Top models for card
    const topModels = modelOverview.map(({ model, cost, calls, percentage }) => ({
      model,
      cost,
      calls,
      percentage
    }));

    // Model costs by date for multi-line chart
    const modelCostsByDate = new Map<string, Map<string, number>>();
    activity.forEach((item: any) => {
      if (!item.created_at) return;
      const dateObj = new Date(item.created_at);
      if (isNaN(dateObj.getTime())) return;
      const date = dateObj.toISOString().split('T')[0];
      const model = item.model || 'Unknown';
      const cost = (item.total_cost || 0) * 11;
      
      if (!modelCostsByDate.has(date)) {
        modelCostsByDate.set(date, new Map());
      }
      const dateMap = modelCostsByDate.get(date)!;
      dateMap.set(model, (dateMap.get(model) || 0) + cost);
    });

    const modelCostsOverTime = Array.from(modelCostsByDate.entries())
      .map(([date, models]) => ({
        date,
        ...Object.fromEntries(models.entries())
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const modelNames = Array.from(new Set(activity.map((item: any) => item.model || 'Unknown'))) as string[];

    return {
      dailyCosts,
      topModels,
      modelOverview,
      modelCostsOverTime,
      modelNames,
      totalSpend,
      avgDailyCost,
      highestCostDay,
      periodDays
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

      <APIKeysOverview
        keys={keysList}
        isLoading={isLoadingKeys}
      />

      <APIModelsOverview
        models={processedData.modelOverview}
        isLoading={isLoadingActivity}
      />

      <Tabs value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as '7d' | '30d' | '90d')}>
        <TabsList>
          <TabsTrigger value="7d">7 dagar</TabsTrigger>
          <TabsTrigger value="30d">30 dagar</TabsTrigger>
          <TabsTrigger value="90d">90 dagar</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedPeriod} className="space-y-6 mt-6">
          <SpendOverview
            totalSpend={processedData.totalSpend}
            averageDailyCost={processedData.avgDailyCost}
            highestCostDay={processedData.highestCostDay}
            periodDays={processedData.periodDays}
          />

          <MultiLineModelCostChart
            data={processedData.modelCostsOverTime}
            modelNames={processedData.modelNames}
            isLoading={isLoadingActivity}
          />

          <TopModelsCard
            models={processedData.topModels}
            isLoading={isLoadingActivity}
          />
        </TabsContent>
      </Tabs>

      <OpenRouterSetupModal
        open={showSetupModal}
        onOpenChange={setShowSetupModal}
      />
    </div>
  );
};

export default OpenRouterDashboard;
