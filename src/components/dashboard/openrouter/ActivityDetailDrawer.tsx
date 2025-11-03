import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, DollarSign, Hash, Cpu, Code, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface ActivityDetailDrawerProps {
  activity: any;
  open: boolean;
  onClose: () => void;
}

export const ActivityDetailDrawer = ({ activity, open, onClose }: ActivityDetailDrawerProps) => {
  if (!activity) return null;

  const getKeyDisplayName = () => {
    return activity.key_name || activity.key_label || activity.api_key?.slice(0, 8) || 'Unknown';
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Activity Details
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <Badge variant={activity.status === 'success' ? 'default' : 'destructive'}>
              {activity.status === 'success' ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : (
                <XCircle className="h-3 w-3 mr-1" />
              )}
              {activity.status}
            </Badge>
          </div>

          <Separator />

          {/* Model Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Code className="h-4 w-4" />
              Model Information
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Model:</span>
                <p className="font-mono mt-1">{activity.model}</p>
              </div>
              <div>
                <span className="text-muted-foreground">API Key:</span>
                <p className="mt-1">{getKeyDisplayName()}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Token Usage */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Token Usage
            </h3>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Prompt</span>
                <p className="text-lg font-semibold mt-1">{activity.prompt_tokens || 0}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <span className="text-muted-foreground">Completion</span>
                <p className="text-lg font-semibold mt-1">{activity.completion_tokens || 0}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <span className="text-muted-foreground">Total</span>
                <p className="text-lg font-semibold mt-1">{activity.total_tokens || 0}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Cost Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Cost Breakdown
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 bg-muted rounded">
                <span className="text-muted-foreground">Prompt Cost:</span>
                <span className="font-mono">${(activity.prompt_cost || 0).toFixed(6)}</span>
              </div>
              <div className="flex justify-between p-2 bg-muted rounded">
                <span className="text-muted-foreground">Completion Cost:</span>
                <span className="font-mono">${(activity.completion_cost || 0).toFixed(6)}</span>
              </div>
              <div className="flex justify-between p-3 bg-primary/10 rounded font-semibold">
                <span>Total Cost:</span>
                <span className="font-mono">${(activity.total_cost || 0).toFixed(6)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timing Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Timing
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Created At:</span>
                <p className="mt-1">
                  {format(new Date(activity.created_at), 'PPP HH:mm:ss', { locale: sv })}
                </p>
              </div>
              {activity.latency_ms && (
                <div>
                  <span className="text-muted-foreground">Latency:</span>
                  <p className="mt-1">{activity.latency_ms}ms</p>
                </div>
              )}
            </div>
          </div>

          {/* Request ID */}
          {activity.request_id && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Request ID</h3>
                <p className="text-xs font-mono bg-muted p-2 rounded break-all">
                  {activity.request_id}
                </p>
              </div>
            </>
          )}

          {/* Additional Metadata */}
          {activity.metadata && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Metadata</h3>
                <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                  {JSON.stringify(activity.metadata, null, 2)}
                </pre>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
