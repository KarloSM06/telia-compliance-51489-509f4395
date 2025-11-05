import { TooltipProps } from 'recharts';

interface PremiumTooltipProps extends TooltipProps<any, any> {
  valueFormatter?: (value: number) => string;
  labelFormatter?: (label: string) => string;
}

export const PremiumTooltip = ({ 
  active, 
  payload, 
  label,
  valueFormatter = (v) => v.toLocaleString(),
  labelFormatter = (l) => l
}: PremiumTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs font-medium text-muted-foreground mb-2">
        {labelFormatter(label)}
      </p>
      <div className="space-y-1.5">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-foreground/80">
                {entry.name}
              </span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              {valueFormatter(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
