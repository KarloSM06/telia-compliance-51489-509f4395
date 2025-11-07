import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RequestStatusBadgeProps {
  status: string;
}

export function RequestStatusBadge({ status }: RequestStatusBadgeProps) {
  const variants: Record<string, { variant: any; className: string }> = {
    pending: {
      variant: 'secondary',
      className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    },
    contacted: {
      variant: 'secondary',
      className: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    },
    closed: {
      variant: 'secondary',
      className: 'bg-green-500/10 text-green-600 border-green-500/20',
    },
  };

  const config = variants[status] || variants.pending;

  const labels: Record<string, string> = {
    pending: 'Väntande',
    contacted: 'Kontaktad',
    closed: 'Stängd',
  };

  return (
    <Badge variant={config.variant} className={cn(config.className, 'capitalize')}>
      {labels[status] || status}
    </Badge>
  );
}
