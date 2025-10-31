import { CompactChartWrapper } from "./CompactChartWrapper";

interface GaugeChartProps {
  value: number;
  max?: number;
  title: string;
  label?: string;
  height?: number;
}

export const GaugeChart = ({ 
  value, 
  max = 100, 
  title,
  label,
  height = 180 
}: GaugeChartProps) => {
  const percentage = Math.min((value / max) * 100, 100);
  const rotation = (percentage / 100) * 180 - 90;
  
  return (
    <CompactChartWrapper title={title} height={height}>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="relative w-32 h-16 mb-3">
          {/* Semi-circle background */}
          <svg className="w-full h-full" viewBox="0 0 100 50">
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="hsl(220 13% 91%)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Progress arc */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="hsl(43 96% 56%)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(percentage / 100) * 126} 126`}
            />
            {/* Needle */}
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="15"
              stroke="hsl(222 47% 11%)"
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                transformOrigin: '50px 50px',
                transform: `rotate(${rotation}deg)`
              }}
            />
            {/* Center dot */}
            <circle cx="50" cy="50" r="3" fill="hsl(222 47% 11%)" />
          </svg>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{value.toFixed(1)}</div>
          {label && <div className="text-xs text-muted-foreground mt-1">{label}</div>}
        </div>
      </div>
    </CompactChartWrapper>
  );
};
