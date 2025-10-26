import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useOwnerNotifications } from "@/hooks/useOwnerNotifications";
import { Badge } from "./ui/badge";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";

export const OwnerNotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useOwnerNotifications();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center px-2 py-2 border-b">
          <h3 className="font-semibold">Notiser</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => markAllAsRead()}
            >
              Markera alla som lästa
            </Button>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            Inga notiser
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex flex-col items-start gap-2 p-4 cursor-pointer ${
                notification.status !== 'read' ? 'bg-muted/50' : ''
              }`}
              onClick={() => {
                if (notification.status !== 'read') {
                  markAsRead(notification.id);
                }
              }}
            >
              <div className="flex justify-between items-start w-full">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{notification.title}</span>
                    <Badge variant={getPriorityColor(notification.priority)} className="text-xs">
                      {notification.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(notification.created_at), { 
                  addSuffix: true,
                  locale: sv 
                })}
              </span>
              {notification.metadata?.customer_phone && (
                <div className="flex gap-2 mt-2">
                  <a 
                    href={`tel:${notification.metadata.customer_phone}`}
                    className="text-xs text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Ring kund
                  </a>
                  {notification.metadata?.customer_email && (
                    <a 
                      href={`mailto:${notification.metadata.customer_email}`}
                      className="text-xs text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Mejla kund
                    </a>
                  )}
                </div>
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
