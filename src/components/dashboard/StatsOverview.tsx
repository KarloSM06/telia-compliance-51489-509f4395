import { Card, CardContent } from "@/components/ui/card";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Calendar, MessageSquare, Phone, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const StatsOverview = () => {
  const { data, loading } = useAnalytics();

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Bokningar",
      value: data?.bookings.total || 0,
      icon: Calendar,
      description: "Totalt antal bokningar",
      color: "text-blue-500",
    },
    {
      title: "Meddelanden",
      value: data?.messages.total || 0,
      icon: MessageSquare,
      description: "Skickade meddelanden",
      color: "text-green-500",
    },
    {
      title: "Samtal",
      value: data?.calls.total || 0,
      icon: Phone,
      description: "Totalt antal samtal",
      color: "text-purple-500",
    },
    {
      title: "Betyg",
      value: data?.callAnalysis.averageScore ? data.callAnalysis.averageScore.toFixed(1) : "N/A",
      icon: Star,
      description: "Genomsnittligt betyg",
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
