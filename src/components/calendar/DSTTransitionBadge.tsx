import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getTimezoneOffset } from "@/lib/timezoneUtils";
import { useUserTimezone } from "@/hooks/useUserTimezone";

interface DSTTransitionBadgeProps {
  date: Date | string;
  className?: string;
}

/**
 * Displays the current timezone offset for the user's selected timezone
 * Useful for showing users when DST transitions occur
 */
export const DSTTransitionBadge = ({ date, className }: DSTTransitionBadgeProps) => {
  const { timezone } = useUserTimezone();
  const offset = getTimezoneOffset(date, timezone);
  
  return (
    <Badge variant="outline" className={`text-xs ${className}`}>
      <Clock className="h-3 w-3 mr-1" />
      {offset}
    </Badge>
  );
};
