import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle, XCircle, MessageSquare } from "lucide-react";

interface MessageStatsCardsProps {
  total: number;
  pending: number;
  sent: number;
  failed: number;
}

export const MessageStatsCards = ({ total, pending, sent, failed }: MessageStatsCardsProps) => {
  const stats = [
    {
      title: "Totalt",
      value: total,
      icon: MessageSquare,
      className: "text-primary",
    },
    {
      title: "Väntande",
      value: pending,
      icon: Clock,
      className: "text-warning",
    },
    {
      title: "Skickade",
      value: sent,
      icon: CheckCircle,
      className: "text-success",
    },
    {
      title: "Misslyckade",
      value: failed,
      icon: XCircle,
      className: "text-destructive",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
