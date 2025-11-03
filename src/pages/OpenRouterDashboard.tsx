import { useState } from "react";
import { OpenRouterHeader } from "@/components/dashboard/openrouter/OpenRouterHeader";
import { ConnectionStatusBanner } from "@/components/dashboard/openrouter/ConnectionStatusBanner";
import { AccountBalanceCards } from "@/components/dashboard/openrouter/AccountBalanceCards";
import { APIKeysTable } from "@/components/dashboard/openrouter/APIKeysTable";
import { useOpenRouterCredits } from "@/hooks/useOpenRouterCredits";
import { useOpenRouterKeyInfo } from "@/hooks/useOpenRouterKeyInfo";
import { useOpenRouterKeys } from "@/hooks/useOpenRouterKeys";
import { useOpenRouterKeysList } from "@/hooks/useOpenRouterKeysList";
import { useOpenRouterAccountSnapshots } from "@/hooks/useOpenRouterAccountSnapshots";
import { OpenRouterSetupModal } from "@/components/integrations/OpenRouterSetupModal";
import { Skeleton } from "@/components/ui/skeleton";

const OpenRouterDashboard = () => {
  const [showSetupModal, setShowSetupModal] = useState(false);

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
