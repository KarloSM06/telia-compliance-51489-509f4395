import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import hiemsLogoSnowflake from '@/assets/hiems-logo-snowflake.png';

interface PremiumTelephonyStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle: string;
  color: string;
  animate?: boolean;
}

export const PremiumTelephonyStatCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  color,
  animate = false
}: PremiumTelephonyStatCardProps) => {
  return (
    <Card className={cn(
      "relative overflow-hidden border-primary/10",
      "bg-gradient-to-br from-card/80 via-card/50 to-card/30",
      "backdrop-blur-md",
      "hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1",
      "transition-all duration-500 group"
    )}>
      {/* Snowflake background */}
      <div className="absolute -top-8 -right-8 w-24 h-24 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
        <img 
          src={hiemsLogoSnowflake} 
          alt="" 
          className="w-full h-full object-contain animate-[spin_60s_linear_infinite]"
        />
      </div>
      
      {/* Radial gradient glow */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
        "bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_70%)]"
      )} />
      
      <CardContent className="pt-6 relative">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold">{value}</p>
            </div>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          
          {/* Icon with premium styling */}
          <div className={cn(
            "rounded-xl p-3 backdrop-blur-sm",
            "bg-gradient-to-br from-primary/20 to-primary/5",
            "border border-primary/20",
            "group-hover:scale-110 transition-transform",
            animate && "animate-pulse"
          )}>
            <Icon className={cn("h-6 w-6", color)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
