import { Card, CardContent } from "@/components/ui/card";
import { Users, ShieldCheck, Settings, UserPlus } from "lucide-react";

interface UserStatsCardsProps {
  totalUsers: number;
  adminCount: number;
  clientCount: number;
  usersWithCustomPermissions: number;
}

export function UserStatsCards({ 
  totalUsers, 
  adminCount, 
  clientCount, 
  usersWithCustomPermissions 
}: UserStatsCardsProps) {
  const stats = [
    {
      title: "Totalt antal användare",
      value: totalUsers,
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Administratörer",
      value: adminCount,
      icon: ShieldCheck,
      color: "text-purple-600",
    },
    {
      title: "Klienter",
      value: clientCount,
      icon: UserPlus,
      color: "text-blue-600",
    },
    {
      title: "Anpassade rättigheter",
      value: usersWithCustomPermissions,
      icon: Settings,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
