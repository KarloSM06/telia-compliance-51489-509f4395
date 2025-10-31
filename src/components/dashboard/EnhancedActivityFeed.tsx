import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  MessageSquare, 
  Calendar, 
  Star, 
  ChevronRight,
  Mail,
  Clock
} from "lucide-react";
import { useAllActivities, Activity, ActivityType } from "@/hooks/useAllActivities";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EnhancedActivityFeedProps {
  onActivityClick?: (activity: Activity) => void;
  limit?: number;
}

export const EnhancedActivityFeed = ({ onActivityClick, limit = 20 }: EnhancedActivityFeedProps) => {
  const { data: activities, isLoading } = useAllActivities(limit);

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'telephony':
        return Phone;
      case 'sms':
        return MessageSquare;
      case 'email':
        return Mail;
      case 'booking':
        return Calendar;
      case 'review':
        return Star;
    }
  };

  const getActivityGradient = (type: ActivityType) => {
    switch (type) {
      case 'telephony':
        return 'bg-gradient-to-br from-blue-500/20 to-blue-600/10';
      case 'sms':
        return 'bg-gradient-to-br from-green-500/20 to-green-600/10';
      case 'email':
        return 'bg-gradient-to-br from-purple-500/20 to-purple-600/10';
      case 'booking':
        return 'bg-gradient-to-br from-amber-500/20 to-amber-600/10';
      case 'review':
        return 'bg-gradient-to-br from-pink-500/20 to-pink-600/10';
    }
  };

  const getActivityBadgeVariant = (type: ActivityType) => {
    switch (type) {
      case 'telephony':
        return 'default' as const;
      case 'sms':
        return 'secondary' as const;
      case 'email':
        return 'outline' as const;
      case 'booking':
        return 'default' as const;
      case 'review':
        return 'secondary' as const;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
        <p className="text-muted-foreground">Inga aktiviteter än</p>
        <p className="text-sm text-muted-foreground mt-2">
          Aktiviteter kommer att visas här när de sker
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-2">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type);
          
          return (
            <Card
              key={activity.id}
              className={cn(
                "hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group",
                "border-border/50"
              )}
              onClick={() => onActivityClick?.(activity)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Icon with gradient background */}
                  <div className={cn(
                    "p-3 rounded-xl transition-transform group-hover:scale-110",
                    getActivityGradient(activity.type)
                  )}>
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getActivityBadgeVariant(activity.type)} className="text-xs">
                        {activity.typeLabel}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.timestamp), {
                          addSuffix: true,
                          locale: sv
                        })}
                      </span>
                    </div>
                    <h4 className="font-semibold group-hover:text-primary transition-colors truncate">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {activity.description}
                    </p>
                  </div>
                  
                  {/* Arrow */}
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
};
