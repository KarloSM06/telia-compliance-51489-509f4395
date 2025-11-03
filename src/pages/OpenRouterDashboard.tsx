import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Settings, Download } from "lucide-react";
import { ConnectionStatusBanner } from "@/components/dashboard/openrouter/ConnectionStatusBanner";
import { APIKeysOverview } from "@/components/dashboard/openrouter/APIKeysOverview";
import { ModelUsageChart } from "@/components/dashboard/openrouter/ModelUsageChart";
import { APIKeyUsageChart } from "@/components/dashboard/openrouter/APIKeyUsageChart";
import { StatCard } from "@/components/dashboard/charts/StatCard";
import { DateRangePicker } from "@/components/dashboard/filters/DateRangePicker";
import { useOpenRouterCredits } from "@/hooks/useOpenRouterCredits";
import { useOpenRouterKeyInfo } from "@/hooks/useOpenRouterKeyInfo";
import { useOpenRouterKeys } from "@/hooks/useOpenRouterKeys";
import { useOpenRouterKeysList } from "@/hooks/useOpenRouterKeysList";
import { useOpenRouterActivity } from "@/hooks/useOpenRouterActivity";
import { useSyncOpenRouterAccount } from "@/hooks/useSyncOpenRouterAccount";
import { OpenRouterSetupModal } from "@/components/integrations/OpenRouterSetupModal";
import { DollarSign, Activity, TrendingUp, Key, Brain, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface DateRange {
  from: Date;
  to: Date;
}

const OpenRouterDashboard = () => {
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });

  const { data: keysStatus } = useOpenRouterKeys();
  const { data: credits, isLoading: isLoadingCredits } = useOpenRouterCredits();
  const { data: keyInfo, isLoading: isLoadingKeyInfo } = useOpenRouterKeyInfo();
  const { data: keysList, isLoading: isLoadingKeys } = useOpenRouterKeysList(
    keysStatus?.provisioning_key_exists || false
  );
  const { data: activityData, isLoading: isLoadingActivity, refetch: refetchActivity } = useOpenRouterActivity(
    dateRange,
    true
  );
  const { mutate: syncAccount, isPending: isSyncing } = useSyncOpenRouterAccount();

  const apiKeyExists = keysStatus?.api_key_exists || false;
  const provisioningKeyExists = keysStatus?.provisioning_key_exists || false;

  const processedStats = useMemo(() => {
    if (!activityData?.data) return null;

    const activities = activityData.data;
    const totalCost = activities.reduce((sum, a) => sum + (a.total_cost || 0) * 11, 0);
    const totalRequests = activities.length;
    const avgCostPerRequest = totalRequests > 0 ? totalCost / totalRequests : 0;
    const totalTokens = activities.reduce((sum, a) => sum + (a.total_tokens || 0), 0);
    const avgTokensPerRequest = totalRequests > 0 ? totalTokens / totalRequests : 0;

    const uniqueModels = new Set(activities.map(a => a.model)).size;
    const uniqueKeys = new Set(
      activities
        .map(a => a.generation_id?.split('-')[0])
        .filter(Boolean)
    ).size;

    // Group by date and model
    const modelUsageByDate = activities.reduce((acc, item) => {
      if (!item.created_at) return acc;
      
      const date = item.created_at.split('T')[0];
      const model = item.model || 'Unknown';

      if (!acc[date]) acc[date] = {};
      if (!acc[date][model]) {
        acc[date][model] = { tokens: 0, requests: 0, cost: 0 };
      }

      acc[date][model].tokens += item.total_tokens || 0;
      acc[date][model].requests += 1;
      acc[date][model].cost += (item.total_cost || 0) * 11;

      return acc;
    }, {} as Record<string, Record<string, { tokens: number; requests: number; cost: number }>>);

    // Group by date and API key
    const keyUsageByDate = activities.reduce((acc, item) => {
      if (!item.created_at) return acc;
      
      const date = item.created_at.split('T')[0];
      const keyId = item.generation_id?.split('-')[0] || 'Unknown';

      if (!acc[date]) acc[date] = {};
      if (!acc[date][keyId]) {
        acc[date][keyId] = { requests: 0, cost: 0 };
      }

      acc[date][keyId].requests += 1;
      acc[date][keyId].cost += (item.total_cost || 0) * 11;

      return acc;
    }, {} as Record<string, Record<string, { requests: number; cost: number }>>);

    return {
      totalCost,
      totalRequests,
      avgCostPerRequest,
      avgTokensPerRequest,
      activeModels: uniqueModels,
      activeKeys: uniqueKeys,
      modelUsageByDate,
      keyUsageByDate,
    };
  }, [activityData]);

  const handleRefresh = () => {
    syncAccount();
    refetchActivity();
    toast.success("Uppdaterar data...");
  };

  const handleExport = () => {
    if (!activityData?.data) {
      toast.error("Ingen data att exportera");
      return;
    }

    const csvData = [
      ['Datum', 'Modell', 'Requests', 'Tokens', 'Kostnad (SEK)'],
      ...activityData.data.map(item => [
        new Date(item.created_at).toISOString().split('T')[0],
        item.model || 'Unknown',
        '1',
        item.total_tokens || 0,
        ((item.total_cost || 0) * 11).toFixed(4)
      ])
    ];

    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `openrouter-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exporterad!");
  };

  const creditsRemaining = credits?.data 
    ? (credits.data.total_credits || 0) - (credits.data.total_usage || 0)
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            OpenRouter Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Realtidsövervakning av AI-modeller och API-kostnader
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isSyncing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            Uppdatera
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={!activityData?.data?.length}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSetupModal(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Inställningar
          </Button>
        </div>
      </div>

      {/* Connection Status Banner */}
      <ConnectionStatusBanner
        apiKeyExists={apiKeyExists}
        provisioningKeyExists={provisioningKeyExists}
        rateLimitRequests={keyInfo?.data?.rate_limit?.requests}
        rateLimitInterval={keyInfo?.data?.rate_limit?.interval}
        onSetupClick={() => setShowSetupModal(true)}
      />

      {/* Date Range Picker */}
      <div className="bg-card p-4 rounded-lg border">
        <p className="text-sm font-medium mb-3">Välj tidsperiod:</p>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Hero Stats Row 1 - 4 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Kostnad"
          value={processedStats ? `${processedStats.totalCost.toFixed(2)} SEK` : "0 SEK"}
          icon={<DollarSign className="h-6 w-6" />}
        />
        <StatCard
          title="Totalt Requests"
          value={processedStats?.totalRequests || 0}
          icon={<Activity className="h-6 w-6" />}
        />
        <StatCard
          title="Genomsnitt/Request"
          value={processedStats ? `${processedStats.avgCostPerRequest.toFixed(4)} SEK` : "0 SEK"}
          icon={<TrendingUp className="h-6 w-6" />}
        />
        <StatCard
          title="Credits Kvar"
          value={`$${creditsRemaining.toFixed(2)}`}
          icon={<DollarSign className="h-6 w-6" />}
        />
      </div>

      {/* Stats Row 2 - 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Aktiva Modeller"
          value={processedStats?.activeModels || 0}
          icon={<Brain className="h-6 w-6" />}
        />
        <StatCard
          title="Aktiva API-nycklar"
          value={processedStats?.activeKeys || 0}
          icon={<Key className="h-6 w-6" />}
        />
        <StatCard
          title="Genomsnitt Tokens/Request"
          value={Math.round(processedStats?.avgTokensPerRequest || 0)}
          icon={<Sparkles className="h-6 w-6" />}
        />
      </div>

      {/* Model Usage Chart */}
      <ModelUsageChart
        data={processedStats?.modelUsageByDate}
        isLoading={isLoadingActivity}
      />

      {/* API Key Usage Chart */}
      <APIKeyUsageChart
        data={processedStats?.keyUsageByDate}
        keys={keysList}
        isLoading={isLoadingActivity}
      />

      {/* API Keys Overview */}
      <APIKeysOverview
        keys={keysList}
        isLoading={isLoadingKeys}
      />

      {/* Setup Modal */}
      <OpenRouterSetupModal
        open={showSetupModal}
        onOpenChange={setShowSetupModal}
      />
    </div>
  );
};

export default OpenRouterDashboard;
