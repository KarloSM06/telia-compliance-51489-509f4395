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
    <Card className="border border-border/50 bg-card hover:border-border transition-colors">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              {title}
            </p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          
          <div className="rounded-lg p-2 bg-primary/5">
            <Icon className={cn("h-5 w-5", color, animate && "animate-pulse")} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
