import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Check, Clock, XCircle, DollarSign, ArrowDown, ArrowUp, Star } from "lucide-react";

interface SMSStatsCardsProps {
  total: number;
  sent: number;
  pending: number;
  failed: number;
  cost: number;
  inbound: number;
  outbound: number;
  reviews: number;
}

export const SMSStatsCards = ({ 
  total, sent, pending, failed, cost, inbound, outbound, reviews 
}: SMSStatsCardsProps) => {
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
      className: "text-blue-500",
    },
    {
      title: "Utgående",
      value: outbound,
      icon: ArrowUp,
      className: "text-success",
    },
    {
      title: "Omdömen (AI)",
      value: reviews,
      icon: Star,
      className: "text-amber-500",
    },
    {
      title: "Skickade",
      value: sent,
      icon: Check,
      className: "text-green-600",
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
      className: "text-purple-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center">
              <stat.icon className={`h-6 w-6 mb-2 ${stat.className}`} />
              <p className="text-xs font-medium text-muted-foreground mb-1">{stat.title}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
