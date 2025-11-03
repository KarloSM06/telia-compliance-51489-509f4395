import { Button } from "@/components/ui/button";
import { RefreshCw, Settings, Zap } from "lucide-react";
import { useSyncOpenRouterAccount } from "@/hooks/useSyncOpenRouterAccount";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";

interface OpenRouterHeaderProps {
  lastSyncAt?: string;
  onSettingsClick: () => void;
}

export const OpenRouterHeader = ({ lastSyncAt, onSettingsClick }: OpenRouterHeaderProps) => {
  const { mutate: syncAccount, isPending: isSyncing } = useSyncOpenRouterAccount();

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => syncAccount()}
        disabled={isSyncing}
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
        Synka Nu
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onSettingsClick}
      >
        <Settings className="h-4 w-4 mr-2" />
        Inställningar
      </Button>
    </div>
  );
};
