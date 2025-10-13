import { Card, CardContent } from "@/components/ui/card";
import { Phone, Calendar, MessageSquare, Award, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { useDashboardSummary } from "@/hooks/useDashboardSummary";
import { Skeleton } from "@/components/ui/skeleton";

export function UnifiedStats() {
  const { summary, loading } = useDashboardSummary();

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
      </div>
    );
  }

  const stats = [
    {
      title: "Totalt samtal",
      value: summary?.totalCalls || 0,
      change: summary?.callsChange || 0,
      icon: Phone,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Bokningar",
      value: summary?.totalBookings || 0,
      change: summary?.bookingsChange || 0,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Meddelanden",
      value: summary?.totalMessages || 0,
      change: summary?.messagesChange || 0,
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "AI Kvalitetsbetyg",
      value: summary?.avgQualityScore 
        ? `${summary.avgQualityScore}/10` 
        : "N/A",
      change: 0,
      icon: Award,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      hideChange: true,
    },
  ];

  const formatLastActivity = (date?: Date) => {
    if (!date) return "Ingen aktivitet";
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just nu";
    if (diffMins < 60) return `${diffMins} min sedan`;
    if (diffHours < 24) return `${diffHours} h sedan`;
    if (diffDays < 7) return `${diffDays} dagar sedan`;
    return date.toLocaleDateString('sv-SE');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Senaste 30 dagarna</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Senaste aktivitet: {formatLastActivity(summary?.lastActivity)}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;
          
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  {!stat.hideChange && stat.change !== 0 && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      isPositive ? 'text-success' : 'text-destructive'
                    }`}>
                      {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      {Math.abs(stat.change)}%
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
                  {!stat.hideChange && (
                    <p className="text-xs text-muted-foreground mt-2">
                      vs förra perioden
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
