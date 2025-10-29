import { CheckCircle2, AlertCircle, XCircle, Webhook, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';

interface Props {
  confidence: number;
  overallHealth: 'healthy' | 'warning' | 'error' | 'unknown';
  webhookHealth: string;
  pollingHealth: string;
  lastWebhookReceived?: string | null;
  lastPollAt?: string | null;
}

export function SyncConfidenceIndicator({ 
  confidence, 
  overallHealth, 
  webhookHealth, 
  pollingHealth,
  lastWebhookReceived,
  lastPollAt 
}: Props) {
  const getColor = () => {
    if (confidence >= 90) return 'text-green-500';
    if (confidence >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const getIcon = () => {
    if (confidence >= 90) return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (confidence >= 60) return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getHealthBadge = (health: string) => {
    const colors = {
      healthy: 'text-green-600',
      degraded: 'text-yellow-600',
      failing: 'text-red-600',
      unknown: 'text-muted-foreground'
    };
    return colors[health as keyof typeof colors] || colors.unknown;
  };
  
  return (
    <div className="flex items-center gap-3">
      {getIcon()}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">Synk-säkerhet</span>
          <span className={`text-lg font-bold ${getColor()}`}>
            {confidence}%
          </span>
        </div>
        <Progress value={confidence} className="h-2" />
        
        {/* Details */}
        <div className="text-xs text-muted-foreground mt-2 space-y-1">
          <div className="flex items-center gap-2">
            <Webhook className="h-3 w-3" />
            <span className={getHealthBadge(webhookHealth)}>
              Webhooks: {webhookHealth}
            </span>
            {lastWebhookReceived && (
              <span className="text-xs">
                ({formatDistanceToNow(new Date(lastWebhookReceived), { 
                  addSuffix: true,
                  locale: sv 
                })})
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-3 w-3" />
            <span className={getHealthBadge(pollingHealth)}>
              Polling: {pollingHealth}
            </span>
            {lastPollAt && (
              <span className="text-xs">
                ({formatDistanceToNow(new Date(lastPollAt), { 
                  addSuffix: true,
                  locale: sv 
                })})
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
