import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineStepProps {
  icon: LucideIcon;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  children?: ReactNode;
  isLast?: boolean;
}

export function TimelineStep({ 
  icon: Icon, 
  title, 
  description, 
  enabled, 
  onToggle, 
  children,
  isLast = false 
}: TimelineStepProps) {
  return (
    <div className="relative">
      <Card className={cn(
        "transition-all duration-300",
        enabled && "ring-2 ring-primary/20 shadow-card"
      )}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className={cn(
              "rounded-full p-3 transition-colors",
              enabled ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              <Icon className="h-5 w-5" />
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <Switch checked={enabled} onCheckedChange={onToggle} />
              </div>
              
              {enabled && children && (
                <div className="animate-fade-in space-y-4 pl-2 border-l-2 border-primary/20">
                  {children}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {!isLast && (
        <div className="absolute left-[38px] top-full h-6 w-0.5 bg-border" />
      )}
    </div>
  );
}
