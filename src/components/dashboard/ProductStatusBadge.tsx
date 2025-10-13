import { Badge } from "@/components/ui/badge";
import { Activity, AlertCircle, Clock, Lock, CheckCircle } from "lucide-react";

interface ProductStatusBadgeProps {
  status: 'active-high' | 'active-low' | 'trial' | 'locked' | 'active';
  usageCount?: number;
  daysLeft?: number;
}

export function ProductStatusBadge({ status, usageCount, daysLeft }: ProductStatusBadgeProps) {
  const badges = {
    'active-high': {
      variant: 'default' as const,
      icon: Activity,
      text: usageCount ? `Aktiv - ${usageCount} användningar/mån` : 'Aktiv',
      className: 'bg-success text-white',
    },
    'active-low': {
      variant: 'secondary' as const,
      icon: AlertCircle,
      text: 'Aktiv - Outnyttjad',
      className: 'bg-warning/20 text-warning',
    },
    'trial': {
      variant: 'outline' as const,
      icon: Clock,
      text: daysLeft ? `Prövoperiod - ${daysLeft} dagar kvar` : 'Prövoperiod',
      className: 'border-blue-500 text-blue-600',
    },
    'locked': {
      variant: 'secondary' as const,
      icon: Lock,
      text: 'Tillgänglig att köpa',
      className: 'bg-muted text-muted-foreground',
    },
    'active': {
      variant: 'default' as const,
      icon: CheckCircle,
      text: 'Aktiv',
      className: 'bg-success text-white',
    },
  };

  const config = badges[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={`${config.className} gap-1.5`}>
      <Icon className="h-3.5 w-3.5" />
      {config.text}
    </Badge>
  );
}
