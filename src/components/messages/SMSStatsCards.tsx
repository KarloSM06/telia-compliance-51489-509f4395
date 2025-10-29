import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Check, Clock, XCircle, DollarSign } from "lucide-react";

interface SMSStatsCardsProps {
  total: number;
  sent: number;
  pending: number;
  failed: number;
  cost: number;
}

export const SMSStatsCards = ({ total, sent, pending, failed, cost }: SMSStatsCardsProps) => {
  const stats = [
    {
      title: "Totalt SMS",
      value: total,
      icon: MessageSquare,
      className: "text-primary",
    },
    {
      title: "Skickade",
      value: sent,
      icon: Check,
      className: "text-success",
    },
    {
      title: "Väntande",
      value: pending,
      icon: Clock,
      className: "text-warning",
    },
    {
      title: "Misslyckade",
      value: failed,
      icon: XCircle,
      className: "text-destructive",
    },
    {
      title: "Kostnad",
      value: `${cost.toFixed(2)} SEK`,
      icon: DollarSign,
      className: "text-amber-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.className}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
