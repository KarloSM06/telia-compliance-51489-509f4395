import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CompactChartWrapperProps {
  title: string;
  children: React.ReactNode;
  height?: number;
  className?: string;
}

export const CompactChartWrapper = ({ 
  title, 
  children, 
  height = 200,
  className 
}: CompactChartWrapperProps) => {
  return (
    <Card className={cn("p-3", className)}>
      <h3 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
        {title}
      </h3>
      <div style={{ height }}>
        {children}
      </div>
    </Card>
  );
};
