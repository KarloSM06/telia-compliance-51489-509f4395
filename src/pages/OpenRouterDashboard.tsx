import { useState, useMemo } from "react";
import { OpenRouterHeader } from "@/components/dashboard/openrouter/OpenRouterHeader";
import { ConnectionStatusBanner } from "@/components/dashboard/openrouter/ConnectionStatusBanner";
import { AccountBalanceCards } from "@/components/dashboard/openrouter/AccountBalanceCards";
import { APIKeysOverview } from "@/components/dashboard/openrouter/APIKeysOverview";
import { APIKeyUsageBreakdown } from "@/components/dashboard/openrouter/APIKeyUsageBreakdown";
import { ModelUsageChart } from "@/components/dashboard/openrouter/ModelUsageChart";
import { APIKeyUsageChart } from "@/components/dashboard/openrouter/APIKeyUsageChart";
import { useOpenRouterCredits } from "@/hooks/useOpenRouterCredits";
import { useOpenRouterKeyInfo } from "@/hooks/useOpenRouterKeyInfo";
import { useOpenRouterKeys } from "@/hooks/useOpenRouterKeys";
import { useOpenRouterKeysList } from "@/hooks/useOpenRouterKeysList";
import { useOpenRouterAccountSnapshots } from "@/hooks/useOpenRouterAccountSnapshots";
import { useOpenRouterActivity } from "@/hooks/useOpenRouterActivity";
import { OpenRouterSetupModal } from "@/components/integrations/OpenRouterSetupModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DateRange {
  from: Date;
  to: Date;
}

const OpenRouterDashboard = () => {
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [dateRangeDays, setDateRangeDays] = useState(30);

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

      <APIKeyUsageBreakdown
        keys={keysList}
        isLoading={isLoadingKeys}
      />

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Tidsperiod för grafer</h3>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={dateRangeDays === 7 ? "default" : "outline"}
            onClick={() => setDateRangeDays(7)}
          >
            7 dagar
          </Button>
          <Button 
            variant={dateRangeDays === 30 ? "default" : "outline"}
            onClick={() => setDateRangeDays(30)}
          >
            30 dagar
          </Button>
          <Button 
            variant={dateRangeDays === 90 ? "default" : "outline"}
            onClick={() => setDateRangeDays(90)}
          >
            90 dagar
          </Button>
        </div>
      </Card>

      <ModelUsageChart 
        activityData={activityData?.data || []}
        isLoading={isLoadingActivity}
      />

      <APIKeyUsageChart 
        activityData={activityData?.data || []}
        keysList={keysList?.data || []}
        isLoading={isLoadingActivity}
      />

      <OpenRouterSetupModal
        open={showSetupModal}
        onOpenChange={setShowSetupModal}
      />
    </div>
  );
};

export default OpenRouterDashboard;
