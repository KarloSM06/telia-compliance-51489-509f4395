import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { SparklineComponent } from "./charts/SparklineComponent";
import { cn } from "@/lib/utils";

interface ROIMetricCardProps {
  title: string;
  value: string;
  trend?: number;
  sparkline?: { value: number }[];
  icon: LucideIcon;
  highlighted?: boolean;
}

export const ROIMetricCard = ({ 
  title, 
  value, 
  trend, 
  sparkline, 
  icon: Icon,
  highlighted 
}: ROIMetricCardProps) => {
  return (
    <Card className={cn(
      "bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300",
      highlighted && "ring-2 ring-[#D4AF37]/50"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/60 uppercase tracking-wide font-medium">{title}</span>
          <Icon className={cn(
            "h-4 w-4",
            highlighted ? "text-[#D4AF37]" : "text-white/40"
          )} />
        </div>
        
        {/* Large value */}
        <div className={cn(
          "text-2xl font-bold mb-1",
          highlighted ? "text-[#D4AF37]" : "text-white"
        )}>
          {value}
        </div>
        
        {/* Trend */}
        {trend !== undefined && (
          <div className={cn(
            "text-xs font-semibold mb-2",
            trend > 0 ? "text-emerald-400" : trend < 0 ? "text-red-400" : "text-white/60"
          )}>
            {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend).toFixed(1)}% vs förra veckan
          </div>
        )}
        
        {/* Sparkline */}
        {sparkline && sparkline.length > 0 && (
          <div className="h-12 mt-2 -mx-2">
            <SparklineComponent 
              data={sparkline} 
              color={highlighted ? "rgba(212, 175, 55, 0.8)" : "rgba(255, 255, 255, 0.6)"} 
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
