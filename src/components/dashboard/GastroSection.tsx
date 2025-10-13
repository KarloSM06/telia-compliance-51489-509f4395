import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, TrendingUp, Clock, Settings, UtensilsCrossed } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface GastroStats {
  totalBookings: number;
  todayBookings: number;
  weekBookings: number;
  avgPartySize: number;
}

export function GastroSection() {
  const { user } = useAuth();
  const [stats, setStats] = useState<GastroStats>({
    totalBookings: 0,
    todayBookings: 0,
    weekBookings: 0,
    avgPartySize: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchGastroStats();
    }
  }, [user]);

  const fetchGastroStats = async () => {
    try {
      const { data: bookingData } = await supabase
        .from('bookings')
        .select('*');

      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const todayBookings = (bookingData || []).filter(b => 
        b.created_at?.startsWith(today)
      ).length;

      const weekBookings = (bookingData || []).filter(b => 
        new Date(b.created_at) >= weekAgo
      ).length;

      setStats({
        totalBookings: bookingData?.length || 0,
        todayBookings,
        weekBookings,
        avgPartySize: 0, // Could be calculated from extra_info if available
      });
    } catch (error) {
      console.error('Error fetching Gastro stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Totala bokningar",
      value: stats.totalBookings,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Idag",
      value: stats.todayBookings,
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Senaste veckan",
      value: stats.weekBookings,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Gäster totalt",
      value: stats.avgPartySize,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Restaurang & Café AI (Gastro)</h2>
          <p className="text-muted-foreground">Hantera bokningar och kundinteraktioner</p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Inställningar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Senaste bokningar</CardTitle>
          <CardDescription>Översikt av kommande och tidigare bokningar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <UtensilsCrossed className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Inga bokningar att visa än</p>
            <p className="text-sm mt-2">Bokningar kommer att visas här när de registreras</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
