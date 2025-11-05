import React from 'react';
import { LineChart, Line, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { DollarSign, Users, CreditCard, Activity, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- MOCK DATA ---
const analyticsData = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    changeType: 'positive' as const,
    icon: DollarSign,
    chartData: [
      { name: 'Page A', uv: 4000 },
      { name: 'Page B', uv: 3000 },
      { name: 'Page C', uv: 2000 },
      { name: 'Page D', uv: 2780 },
      { name: 'Page E', uv: 1890 },
      { name: 'Page F', uv: 2390 },
      { name: 'Page G', uv: 3490 },
    ],
  },
  {
    title: 'Subscriptions',
    value: '+2350',
    change: '+180.1%',
    changeType: 'positive' as const,
    icon: Users,
    chartData: [
      { name: 'Page A', uv: 1200 },
      { name: 'Page B', uv: 2100 },
      { name: 'Page C', uv: 1800 },
      { name: 'Page D', uv: 2500 },
      { name: 'Page E', uv: 2100 },
      { name: 'Page F', uv: 3000 },
      { name: 'Page G', uv: 3200 },
    ],
  },
  {
    title: 'Sales',
    value: '+12,234',
    change: '+19%',
    changeType: 'negative' as const,
    icon: CreditCard,
    chartData: [
      { name: 'Page A', uv: 4000 },
      { name: 'Page B', uv: 3500 },
      { name: 'Page C', uv: 3800 },
      { name: 'Page D', uv: 3200 },
      { name: 'Page E', uv: 2800 },
      { name: 'Page F', uv: 2500 },
      { name: 'Page G', uv: 2300 },
    ],
  },
  {
    title: 'Active Now',
    value: '+573',
    change: '+201 since last hour',
    changeType: 'positive' as const,
    icon: Activity,
    chartData: [
      { name: 'Page A', uv: 2000 },
      { name: 'Page B', uv: 2200 },
      { name: 'Page C', uv: 2800 },
      { name: 'Page D', uv: 2400 },
      { name: 'Page E', uv: 3000 },
      { name: 'Page F', uv: 2700 },
      { name: 'Page G', uv: 3800 },
    ],
  },
];

// --- CUSTOM TOOLTIP ---
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover/95 p-2.5 text-sm shadow-elegant backdrop-blur-sm">
        <p className="font-medium text-popover-foreground">
          Value: <span className="font-bold">{payload[0].value.toLocaleString()}</span>
        </p>
      </div>
    );
  }
  return null;
};

// --- STAT CARD COMPONENT ---
interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: LucideIcon;
  chartData: { name: string; uv: number }[];
}

function StatCard({ title, value, change, changeType, icon: Icon, chartData }: StatCardProps) {
  const isPositive = changeType === 'positive';

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card shadow-card",
        "transition-all duration-500 ease-smooth",
        "hover:shadow-elegant hover:scale-[1.02] hover:-translate-y-1",
        "bg-gradient-to-br from-card via-card to-primary/5"
      )}
    >
      {/* Gradient overlay on hover */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500",
          "from-primary/0 via-primary/0 to-primary/10 group-hover:opacity-100"
        )} 
      />

      {/* Glow effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary)/0.15),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
            {title}
          </h3>
          <div className={cn(
            "p-2.5 rounded-lg transition-all duration-300",
            "bg-primary/10 group-hover:bg-primary/15 group-hover:scale-110 group-hover:rotate-3"
          )}>
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>

        {/* Value and Chart */}
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-3xl font-bold tracking-tight text-foreground transition-all duration-300 group-hover:text-primary">
              {value}
            </p>
            <p className={cn(
              "text-xs font-medium transition-colors duration-300",
              isPositive 
                ? "text-success group-hover:text-success/90" 
                : "text-destructive group-hover:text-destructive/90"
            )}>
              {change}
            </p>
          </div>

          {/* Sparkline Chart */}
          <div className="h-14 w-28 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop 
                      offset="5%" 
                      stopColor={isPositive ? 'hsl(142, 76%, 36%)' : 'hsl(0, 84%, 60%)'} 
                      stopOpacity={0.3} 
                    />
                    <stop 
                      offset="95%" 
                      stopColor={isPositive ? 'hsl(142, 76%, 36%)' : 'hsl(0, 84%, 60%)'} 
                      stopOpacity={0} 
                    />
                  </linearGradient>
                </defs>
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: 'hsl(var(--border))',
                    strokeWidth: 1,
                    strokeDasharray: '3 3',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="uv"
                  stroke={isPositive ? 'hsl(142, 76%, 36%)' : 'hsl(0, 84%, 60%)'}
                  strokeWidth={2}
                  fill={`url(#gradient-${title})`}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom gradient bar */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-1",
        "bg-gradient-to-r from-primary/0 via-primary to-primary/0",
        "opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      )} />
    </div>
  );
}

// --- DASHBOARD COMPONENT ---
export default function AnalyticsDashboard() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Here's your performance summary.
          </p>
        </div>
        <button
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-semibold",
            "bg-primary text-primary-foreground shadow-button",
            "transition-all duration-300 hover:scale-105 hover:shadow-glow",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          )}
        >
          Generate Report
        </button>
      </header>

      {/* Stats Grid */}
      <main>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {analyticsData.map((data, index) => (
            <div
              key={data.title}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <StatCard
                title={data.title}
                value={data.value}
                change={data.change}
                changeType={data.changeType}
                icon={data.icon}
                chartData={data.chartData}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
