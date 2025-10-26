import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getStockholmOffset } from "@/lib/timezoneUtils";

interface DSTTransitionBadgeProps {
  date: Date | string;
  className?: string;
}

/**
 * Displays the current timezone offset (CET/CEST) for Stockholm
 * Useful for showing users when DST transitions occur
 */
export const DSTTransitionBadge = ({ date, className }: DSTTransitionBadgeProps) => {
  const offset = getStockholmOffset(date);
  
  return (
    <Badge variant="outline" className={`text-xs ${className}`}>
      <Clock className="h-3 w-3 mr-1" />
      {offset}
    </Badge>
  );
};
