import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, ArrowDown, ArrowUp, XCircle, DollarSign } from "lucide-react";

interface MessageStatsCardsProps {
  total: number;
  inbound: number;
  outbound: number;
  failed: number;
  cost: number;
}

export const MessageStatsCards = ({ total, inbound, outbound, failed, cost }: MessageStatsCardsProps) => {
  const stats = [
    {
      title: "Totalt SMS",
      value: total,
      icon: MessageSquare,
      className: "text-primary",
    },
    {
      title: "Inkommande",
      value: inbound,
      icon: ArrowDown,
      className: "text-success",
    },
    {
      title: "Utgående",
      value: outbound,
      icon: ArrowUp,
      className: "text-blue-500",
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
