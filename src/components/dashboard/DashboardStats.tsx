import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Phone, CheckCircle, XCircle, Activity } from "lucide-react";
import { useEffect, useState } from "react";

interface StatsProps {
  totalCalls: number;
  averageScore: number | null;
  successRate: number | null;
}

export function DashboardStats({ totalCalls, averageScore, successRate }: StatsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    {
      title: "Totalt Samtal",
      value: totalCalls,
      icon: Phone,
      trend: null,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Genomsnittlig Poäng",
      value: averageScore ? `${averageScore.toFixed(1)}%` : "N/A",
      icon: Activity,
      trend: averageScore && averageScore >= 70 ? "up" : "down",
      color: averageScore && averageScore >= 70 ? "text-success" : "text-warning",
      bgColor: averageScore && averageScore >= 70 ? "bg-success/10" : "bg-warning/10",
    },
    {
      title: "Framgångsgrad",
      value: successRate ? `${successRate.toFixed(1)}%` : "N/A",
      icon: CheckCircle,
      trend: successRate && successRate >= 60 ? "up" : "down",
      color: successRate && successRate >= 60 ? "text-success" : "text-violation",
      bgColor: successRate && successRate >= 60 ? "bg-success/10" : "bg-violation/10",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <Card
          key={stat.title}
          className={`transition-all duration-500 hover:shadow-card hover:scale-105 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              {stat.trend && (
                <div className="flex items-center gap-1">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-violation" />
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
