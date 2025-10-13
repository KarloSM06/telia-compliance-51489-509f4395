import { WidgetProps } from "@/types/widget.types";
import { BaseWidget } from "../base/BaseWidget";
import { useWidgetData } from "@/hooks/useWidgetData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";

export const ActivityFeedWidget = ({ id, config, dataSource, isEditing }: WidgetProps) => {
  const { data, isLoading } = useWidgetData(dataSource, id);
  
  const activities = data || [];

  return (
    <BaseWidget config={config} id={id} dataSource={dataSource} isEditing={isEditing}>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Laddar...</p>
        </div>
      ) : (
        <ScrollArea className="h-full">
          <div className="space-y-2">
            {activities.map((activity: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center p-2 rounded bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.title || activity.name}</p>
                  {activity.description && (
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                  )}
                </div>
                {activity.created_at && (
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.created_at), { 
                      addSuffix: true,
                      locale: sv 
                    })}
                  </span>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </BaseWidget>
  );
};
