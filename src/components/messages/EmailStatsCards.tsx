import { Card, CardContent } from "@/components/ui/card";
import { Mail, Check, Eye, MousePointer, XCircle, DollarSign } from "lucide-react";

interface EmailStatsCardsProps {
  total: number;
  sent: number;
  opened: number;
  clicked: number;
  failed: number;
  cost: number;
}

export const EmailStatsCards = ({ total, sent, opened, clicked, failed, cost }: EmailStatsCardsProps) => {
  const stats = [
    {
      title: "Totalt Email",
      value: total,
      icon: Mail,
      className: "text-primary",
    },
    {
      title: "Skickade",
      value: sent,
      icon: Check,
      className: "text-success",
    },
    {
      title: "Öppnade",
      value: opened,
      icon: Eye,
      className: "text-blue-500",
    },
    {
      title: "Klickade",
      value: clicked,
      icon: MousePointer,
      className: "text-purple-500",
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
