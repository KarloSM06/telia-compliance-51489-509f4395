import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { SparklineComponent } from '@/components/dashboard/charts/SparklineComponent';
import { cn } from '@/lib/utils';

interface ROIMetricCardProps {
  title: string;
  value: string | number;
  trend?: number;
  sparklineData?: number[];
  icon: LucideIcon;
  highlight?: boolean;
}

export const ROIMetricCard = ({ 
  title, 
  value, 
  trend, 
  sparklineData, 
  icon: Icon,
  highlight = false 
}: ROIMetricCardProps) => {
  return (
    <Card className={cn(
      "bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all",
      highlight && "ring-2 ring-gold-500/50 bg-gold-500/5"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/60 uppercase tracking-wide font-medium">
            {title}
          </span>
          <Icon className={cn(
            "h-4 w-4",
            highlight ? "text-gold-400" : "text-gold-500"
          )} />
        </div>
        
        {/* Large value */}
        <div className={cn(
          "text-2xl font-bold mb-1",
          highlight ? "text-gold-300" : "text-white"
        )}>
          {value}
        </div>
        
        {/* Trend */}
        {trend !== undefined && (
          <div className={cn(
            "text-xs font-semibold flex items-center gap-1",
            trend > 0 ? "text-emerald-400" : "text-red-400"
          )}>
            <span>{trend > 0 ? '↑' : '↓'}</span>
            <span>{Math.abs(trend).toFixed(1)}%</span>
          </div>
        )}
        
        {/* Sparkline */}
        {sparklineData && sparklineData.length > 0 && (
          <div className="h-12 mt-2 -mx-2">
            <SparklineComponent 
              data={sparklineData.map(value => ({ value }))} 
              color={highlight ? "rgba(212, 175, 55, 0.9)" : "rgba(212, 175, 55, 0.6)"} 
              height={48}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
