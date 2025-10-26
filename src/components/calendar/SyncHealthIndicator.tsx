import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle2, AlertCircle, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SyncHealthIndicatorProps {
  successRate: number;
  pendingCount: number;
  failedCount: number;
  className?: string;
}

export const SyncHealthIndicator = ({
  successRate,
  pendingCount,
  failedCount,
  className,
}: SyncHealthIndicatorProps) => {
  const getHealthStatus = () => {
    if (failedCount > 5 || successRate < 50) {
      return {
        icon: XCircle,
        color: 'text-destructive',
        bgColor: 'bg-destructive/10',
        label: 'Kritisk',
        message: `Låg framgångsgrad (${successRate}%) och ${failedCount} misslyckade synkar`,
      };
    }
    
    if (failedCount > 0 || successRate < 90) {
      return {
        icon: AlertCircle,
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        label: 'Varning',
        message: `${failedCount} misslyckade synkar, framgångsgrad ${successRate}%`,
      };
    }

    if (pendingCount > 10) {
      return {
        icon: Loader2,
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        label: 'Synkar',
        message: `${pendingCount} händelser väntar på synkronisering`,
        animate: true,
      };
    }

    return {
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
      label: 'Hälsosam',
      message: `Allt fungerar bra! Framgångsgrad: ${successRate}%`,
    };
  };

  const status = getHealthStatus();
  const Icon = status.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={cn(
              'gap-2 cursor-help',
              status.bgColor,
              status.color,
              className
            )}
          >
            <Icon
              className={cn(
                'h-3.5 w-3.5',
                status.animate && 'animate-spin'
              )}
            />
            <span className="text-xs font-medium">{status.label}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{status.message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
