import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Settings, Download, Key } from "lucide-react";
import { toast } from "sonner";
import { ConnectionStatusBanner } from "@/components/dashboard/openrouter/ConnectionStatusBanner";
import { AccountBalanceCards } from "@/components/dashboard/openrouter/AccountBalanceCards";
import { ActivityFilters, ActivityFilterValues } from "@/components/dashboard/openrouter/ActivityFilters";
import { ActivityTable } from "@/components/dashboard/openrouter/ActivityTable";
import { ActivityDetailDrawer } from "@/components/dashboard/openrouter/ActivityDetailDrawer";
import { APIKeysManagementDialog } from "@/components/dashboard/openrouter/APIKeysManagementDialog";
import { useOpenRouterCredits } from "@/hooks/useOpenRouterCredits";
import { useOpenRouterKeyInfo } from "@/hooks/useOpenRouterKeyInfo";
import { useOpenRouterKeys } from "@/hooks/useOpenRouterKeys";
import { useOpenRouterKeysList } from "@/hooks/useOpenRouterKeysList";
import { useOpenRouterAccountSnapshots } from "@/hooks/useOpenRouterAccountSnapshots";
import { useOpenRouterActivity } from "@/hooks/useOpenRouterActivity";
import { OpenRouterSetupModal } from "@/components/integrations/OpenRouterSetupModal";
import { Skeleton } from "@/components/ui/skeleton";

const OpenRouterDashboard = () => {
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showKeysDialog, setShowKeysDialog] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [filters, setFilters] = useState<ActivityFilterValues>({
    search: '',
    model: 'all',
    apiKey: 'all',
  });

  const dateRange = useMemo(() => {
    const to = new Date();
    to.setHours(23, 59, 59, 999);
    const from = new Date(to);
    from.setDate(to.getDate() - 30);
    from.setHours(0, 0, 0, 0);
    return { from, to };
  }, []);

  // Fetch data
  const { data: keysStatus } = useOpenRouterKeys();
  const { data: credits, isLoading: isLoadingCredits } = useOpenRouterCredits();
  const { data: keyInfo, isLoading: isLoadingKeyInfo } = useOpenRouterKeyInfo();
  const { data: keysList, isLoading: isLoadingKeys } = useOpenRouterKeysList(
    keysStatus?.provisioning_key_exists || false
  );
  const { data: snapshots, refetch: refetchSnapshots } = useOpenRouterAccountSnapshots();
  const { data: activityData, isLoading: isLoadingActivity, refetch: refetchActivity } = useOpenRouterActivity(
    dateRange,
    keysStatus?.provisioning_key_exists || false
  );

  const apiKeyExists = keysStatus?.api_key_exists || false;
  const provisioningKeyExists = keysStatus?.provisioning_key_exists || false;
  const isFullyConfigured = apiKeyExists && provisioningKeyExists;

  const lastSnapshot = snapshots?.[0];
  const activities = activityData?.data || [];
  const apiKeys = keysList?.data || [];

  // Extract unique models from activities
  const uniqueModels = useMemo(() => {
    const models = new Set(activities.map((a: any) => a.model).filter(Boolean));
    return Array.from(models).sort() as string[];
  }, [activities]);

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter((activity: any) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          activity.model?.toLowerCase().includes(searchLower) ||
          activity.key_name?.toLowerCase().includes(searchLower) ||
          activity.key_label?.toLowerCase().includes(searchLower) ||
          activity.api_key?.includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Model filter
      if (filters.model !== 'all' && activity.model !== filters.model) {
        return false;
      }

      // API Key filter
      if (filters.apiKey !== 'all' && activity.api_key !== filters.apiKey) {
        return false;
      }

      // Date filters
      if (filters.dateFrom) {
        const activityDate = new Date(activity.created_at);
        if (activityDate < filters.dateFrom) return false;
      }
      if (filters.dateTo) {
        const activityDate = new Date(activity.created_at);
        const endOfDay = new Date(filters.dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        if (activityDate > endOfDay) return false;
      }

      return true;
    });
  }, [activities, filters]);

  const handleRefresh = async () => {
    toast.loading('Uppdaterar data...');
    await Promise.all([refetchSnapshots(), refetchActivity()]);
    toast.dismiss();
    toast.success('Data uppdaterad');
  };

  const handleExport = () => {
    const csvContent = [
      ['Timestamp', 'Model', 'API Key', 'Tokens', 'Cost', 'Status'].join(','),
      ...filteredActivities.map((activity: any) =>
        [
          activity.created_at,
          activity.model,
          activity.key_name || activity.key_label || activity.api_key?.slice(0, 8),
          activity.total_tokens || 0,
          activity.total_cost || 0,
          activity.status || '-',
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `openrouter-activity-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Export klar');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">OpenRouter</h1>
          <p className="text-muted-foreground">
            Realtidsövervakning av din AI API-användning
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowKeysDialog(true)}>
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Synka Nu
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowSetupModal(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Inställningar
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Connection Status Banner */}
      {!isFullyConfigured && (
        <ConnectionStatusBanner
          apiKeyExists={apiKeyExists}
          provisioningKeyExists={provisioningKeyExists}
          rateLimitRequests={keyInfo?.data?.rate_limit?.requests}
          rateLimitInterval={keyInfo?.data?.rate_limit?.interval}
          onSetupClick={() => setShowSetupModal(true)}
        />
      )}

      {/* Account Balance Cards */}
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

      {/* Activity Filters */}
      <ActivityFilters
        onFilterChange={setFilters}
        models={uniqueModels}
        apiKeys={apiKeys}
      />

      {/* Activity Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Activity</h2>
          <p className="text-sm text-muted-foreground">
            Visar {filteredActivities.length} av {activities.length} requests
          </p>
        </div>
        {isLoadingActivity ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ActivityTable
            activities={filteredActivities}
            onViewDetails={setSelectedActivity}
          />
        )}
      </div>

      {/* Dialogs */}
      <APIKeysManagementDialog
        open={showKeysDialog}
        onClose={() => setShowKeysDialog(false)}
        keys={keysList}
        isLoading={isLoadingKeys}
      />

      <ActivityDetailDrawer
        activity={selectedActivity}
        open={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />

      <OpenRouterSetupModal
        open={showSetupModal}
        onOpenChange={setShowSetupModal}
      />
    </div>
  );
};

export default OpenRouterDashboard;
