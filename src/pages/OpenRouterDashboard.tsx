import { useState, useMemo } from "react";
import { OpenRouterHeader } from "@/components/dashboard/openrouter/OpenRouterHeader";
import { ConnectionStatusBanner } from "@/components/dashboard/openrouter/ConnectionStatusBanner";
import { AccountBalanceCards } from "@/components/dashboard/openrouter/AccountBalanceCards";
import { APIKeysOverview } from "@/components/dashboard/openrouter/APIKeysOverview";
import { APIKeyUsageBreakdown } from "@/components/dashboard/openrouter/APIKeyUsageBreakdown";
import { ModelUsageChart } from "@/components/dashboard/openrouter/ModelUsageChart";
import { APIKeyUsageChart } from "@/components/dashboard/openrouter/APIKeyUsageChart";
import { TopModelsCard } from "@/components/dashboard/openrouter/TopModelsCard";
import { useOpenRouterCredits } from "@/hooks/useOpenRouterCredits";
import { useOpenRouterKeyInfo } from "@/hooks/useOpenRouterKeyInfo";
import { useOpenRouterKeys } from "@/hooks/useOpenRouterKeys";
import { useOpenRouterKeysList } from "@/hooks/useOpenRouterKeysList";
import { useOpenRouterAccountSnapshots } from "@/hooks/useOpenRouterAccountSnapshots";
import { useOpenRouterActivity } from "@/hooks/useOpenRouterActivity";
import { OpenRouterSetupModal } from "@/components/integrations/OpenRouterSetupModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DateRange {
  from: Date;
  to: Date;
}

const OpenRouterDashboard = () => {
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [dateRangeDays, setDateRangeDays] = useState(30);
  const isMobile = useIsMobile();

  const dateRange: DateRange = useMemo(() => {
    const to = new Date();
    to.setHours(0, 0, 0, 0);
    const from = new Date(to);
    from.setDate(to.getDate() - dateRangeDays);
    return { from, to };
  }, [dateRangeDays]);

  // Fetch data
  const { data: keysStatus } = useOpenRouterKeys();
  const { data: credits, isLoading: isLoadingCredits } = useOpenRouterCredits();
  const { data: keyInfo, isLoading: isLoadingKeyInfo } = useOpenRouterKeyInfo();
  const { data: keysList, isLoading: isLoadingKeys } = useOpenRouterKeysList(
    keysStatus?.provisioning_key_exists || false
  );
  const { data: snapshots } = useOpenRouterAccountSnapshots();
  const { data: activityData, isLoading: isLoadingActivity } = useOpenRouterActivity(
    dateRange,
    keysStatus?.provisioning_key_exists || false
  );

  const apiKeyExists = keysStatus?.api_key_exists || false;
  const provisioningKeyExists = keysStatus?.provisioning_key_exists || false;
  const lastSnapshot = snapshots?.[0];

  // Calculate today's cost
  const todaysCost = useMemo(() => {
    if (!activityData?.data) return 0;
    const today = new Date().toISOString().split('T')[0];
    return activityData.data
      .filter(item => item.date.startsWith(today))
      .reduce((sum, item) => sum + (item.usage || 0), 0);
  }, [activityData]);

  // Calculate model costs for top models
  const modelCosts = useMemo(() => {
    if (!activityData?.data) return [];
    const costs: Record<string, { cost: number; calls: number }> = activityData.data.reduce((acc, item) => {
      const model = item.model || 'Unknown';
      if (!acc[model]) {
        acc[model] = { cost: 0, calls: 0 };
      }
      acc[model].cost += item.usage || 0;
      acc[model].calls += item.requests || 1;
      return acc;
    }, {} as Record<string, { cost: number; calls: number }>);

    const totalCost = Object.values(costs).reduce((sum, c) => sum + c.cost, 0);
    
    return Object.entries(costs)
      .map(([model, data]) => ({
        model,
        cost: data.cost,
        calls: data.calls,
        percentage: totalCost > 0 ? (data.cost / totalCost) * 100 : 0
      }))
      .sort((a, b) => b.cost - a.cost);
  }, [activityData]);

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              OpenRouter Dashboard
            </h1>
            <p className="text-xs text-muted-foreground">
              Hantera API-nycklar och övervaka användning
            </p>
          </div>
          <OpenRouterHeader
            lastSyncAt={lastSnapshot?.created_at}
            onSettingsClick={() => setShowSetupModal(true)}
          />
        </div>
      </div>

      {/* Main Content with ResizablePanels */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup
          direction={isMobile ? "vertical" : "horizontal"}
          className="h-full"
        >
          {/* Left Panel - Overview & Lists */}
          <ResizablePanel defaultSize={45} minSize={30}>
            <ScrollArea className="h-full">
              <div className="space-y-4 p-6">
                {/* Connection Status (only if not fully configured) */}
                {(!apiKeyExists || !provisioningKeyExists) && (
                  <ConnectionStatusBanner
                    apiKeyExists={apiKeyExists}
                    provisioningKeyExists={provisioningKeyExists}
                    rateLimitRequests={keyInfo?.data?.rate_limit?.requests}
                    rateLimitInterval={keyInfo?.data?.rate_limit?.interval}
                    onSetupClick={() => setShowSetupModal(true)}
                  />
                )}

                {/* Stats Cards */}
                {isLoadingCredits || isLoadingKeyInfo ? (
                  <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                  </div>
                ) : (
                  <AccountBalanceCards
                    totalCredits={credits?.data?.total_credits}
                    totalUsage={credits?.data?.total_usage}
                    limitRemaining={keyInfo?.data?.limit_remaining}
                    rateLimitRequests={keyInfo?.data?.rate_limit?.requests}
                    rateLimitInterval={keyInfo?.data?.rate_limit?.interval}
                    todaysCost={todaysCost}
                  />
                )}

                {/* Date Range Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Tidsperiod:</span>
                  <Tabs value={dateRangeDays.toString()} onValueChange={(v) => setDateRangeDays(Number(v))}>
                    <TabsList>
                      <TabsTrigger value="7">7d</TabsTrigger>
                      <TabsTrigger value="30">30d</TabsTrigger>
                      <TabsTrigger value="90">90d</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* API Keys Overview */}
                <APIKeysOverview
                  keys={keysList}
                  isLoading={isLoadingKeys}
                />

                {/* API Key Usage Breakdown */}
                <APIKeyUsageBreakdown
                  keys={keysList}
                  isLoading={isLoadingKeys}
                />
              </div>
            </ScrollArea>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel - Charts & Analysis */}
          <ResizablePanel defaultSize={55} minSize={30}>
            <ScrollArea className="h-full">
              <div className="space-y-4 p-6">
                <div>
                  <h2 className="text-lg font-semibold mb-1">Användning & Analys</h2>
                  <p className="text-xs text-muted-foreground">Visualisera dina användningsmönster</p>
                </div>

                {/* Model Usage Chart */}
                <ModelUsageChart 
                  activityData={activityData?.data || []}
                  isLoading={isLoadingActivity}
                />

                {/* API Key Usage Chart */}
                <APIKeyUsageChart 
                  activityData={activityData?.data || []}
                  keysList={keysList?.data || []}
                  isLoading={isLoadingActivity}
                />

                {/* Top Models */}
                <TopModelsCard
                  models={modelCosts.slice(0, 5)}
                  isLoading={isLoadingActivity}
                />
              </div>
            </ScrollArea>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <OpenRouterSetupModal
        open={showSetupModal}
        onOpenChange={setShowSetupModal}
      />
    </div>
  );
};

export default OpenRouterDashboard;
