import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MiniStatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  className?: string;
}

export function MiniStatCard({ icon: Icon, label, value, className }: MiniStatCardProps) {
  return (
    <div className={cn(
      "flex items-center gap-3 p-4 rounded-lg border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-lg hover:border-primary/30 transition-all duration-500",
      className
    )}>
      <div className="p-2 bg-primary/10 rounded-lg">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}
