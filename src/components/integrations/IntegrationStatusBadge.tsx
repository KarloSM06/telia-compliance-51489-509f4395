import { Circle, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface IntegrationStatusBadgeProps {
  provider: string;
  healthStatus?: 'healthy' | 'warning' | 'error' | null;
  showLabel?: boolean;
  className?: string;
  isActive?: boolean;
}

export const IntegrationStatusBadge = ({
  provider,
  healthStatus,
  showLabel = true,
  className,
  isActive = true
}: IntegrationStatusBadgeProps) => {
  const getStatusIcon = () => {
    if (!isActive) {
      return <Circle className="h-3 w-3 fill-gray-400 text-gray-400" />;
    }
    
    switch (healthStatus) {
      case 'healthy':
        return <Circle className="h-3 w-3 fill-green-500 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-3 w-3 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-3 w-3 text-red-500" />;
      default:
        return <Circle className="h-3 w-3 fill-gray-400 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    if (!isActive) {
      return 'text-muted-foreground';
    }
    
    switch (healthStatus) {
      case 'healthy':
        return 'text-green-700';
      case 'warning':
        return 'text-yellow-700';
      case 'error':
        return 'text-red-700';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {getStatusIcon()}
      {showLabel && (
        <span className={cn("text-sm font-medium capitalize", getStatusColor())}>
          {provider}
        </span>
      )}
    </div>
  );
};
