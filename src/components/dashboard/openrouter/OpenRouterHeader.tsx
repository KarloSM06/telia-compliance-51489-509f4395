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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          OpenRouter Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Hantera dina API-nycklar och övervaka användning
        </p>
        {lastSyncAt && (
          <p className="text-xs text-muted-foreground mt-2">
            Senast synkad: {formatDistanceToNow(new Date(lastSyncAt), { addSuffix: true, locale: sv })}
          </p>
        )}
      </div>
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
    </div>
  );
};
