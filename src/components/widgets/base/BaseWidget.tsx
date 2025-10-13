import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WidgetProps } from "@/types/widget.types";
import { cn } from "@/lib/utils";

interface BaseWidgetProps extends WidgetProps {
  children: React.ReactNode;
  className?: string;
}

export const BaseWidget = ({ 
  config, 
  children, 
  className,
  isEditing = false 
}: BaseWidgetProps) => {
  return (
    <Card className={cn(
      "h-full transition-all",
      isEditing && "ring-2 ring-primary",
      className
    )}>
      {config.title && (
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {config.title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={config.title ? "pt-0" : "pt-6"}>
        {children}
      </CardContent>
    </Card>
  );
};
