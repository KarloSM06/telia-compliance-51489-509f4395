import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, Users, CheckCircle, Sparkles, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadStatsProps {
  stats: {
    totalLeads: number;
    newLeads: number;
    contacted: number;
    conversions: number;
    enrichedLeads: number;
    avgAiScore: number;
  };
  compact?: boolean;
}
export function LeadStats({
  stats,
  compact = false
}: LeadStatsProps) {
  const statCards = [{
    title: "Totalt Leads",
    value: stats.totalLeads,
    icon: Target,
    gradient: "from-blue-500 to-blue-600",
    change: "+12%"
  }, {
    title: "Nya",
    value: stats.newLeads,
    icon: Users,
    gradient: "from-blue-400 to-blue-500",
    change: "+8%"
  }, {
    title: "Berikade",
    value: stats.enrichedLeads,
    icon: Sparkles,
    gradient: "from-emerald-500 to-emerald-600",
    change: "AI-berikade"
  }, {
    title: "Genomsnittlig AI Score",
    value: stats.avgAiScore > 0 ? `${stats.avgAiScore}/100` : "-",
    icon: Award,
    gradient: "from-purple-500 to-purple-600",
    change: stats.enrichedLeads > 0 ? `${stats.enrichedLeads} berikade` : "-"
  }, {
    title: "Kontaktade",
    value: stats.contacted,
    icon: TrendingUp,
    gradient: "from-yellow-500 to-yellow-600",
    change: "+15%"
  }, {
    title: "Konverteringar",
    value: stats.conversions,
    icon: CheckCircle,
    gradient: "from-green-500 to-green-600",
    change: "+20%"
  }];
  if (compact) {
    return (
      <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="border-l-4" style={{ borderLeftColor: `hsl(var(--primary))` }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-muted-foreground">{stat.title}</p>
                <div className={cn("p-1.5 rounded-md bg-gradient-to-br", stat.gradient)}>
                  <stat.icon className="h-3 w-3 text-white" />
                </div>
              </div>
              <div className="text-xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div className={cn("p-2 rounded-lg bg-gradient-to-br", stat.gradient)}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}