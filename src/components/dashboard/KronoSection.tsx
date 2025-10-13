import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, Calendar, BarChart3, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface KronoStats {
  totalCalls: number;
  totalSMS: number;
  totalBookings: number;
  minutesUsed: number;
}

export function KronoSection() {
  const { user } = useAuth();
  const [stats, setStats] = useState<KronoStats>({
    totalCalls: 0,
    totalSMS: 0,
    totalBookings: 0,
    minutesUsed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchKronoStats();
    }
  }, [user]);

  const fetchKronoStats = async () => {
    try {
      // Fetch call history
      const { data: callData } = await supabase
        .from('call_history')
        .select('duration');

      // Fetch messages
      const { data: messageData } = await supabase
        .from('messages')
        .select('id');

      // Fetch bookings
      const { data: bookingData } = await supabase
        .from('bookings')
        .select('id');

      const minutesUsed = (callData || []).reduce((acc, call) => {
        if (call.duration) {
          // Parse duration if it's in format like "2:30"
          const parts = call.duration.split(':');
          const minutes = parseInt(parts[0] || '0') + (parseInt(parts[1] || '0') / 60);
          return acc + minutes;
        }
        return acc;
      }, 0);

      setStats({
        totalCalls: callData?.length || 0,
        totalSMS: messageData?.length || 0,
        totalBookings: bookingData?.length || 0,
        minutesUsed: Math.round(minutesUsed),
      });
    } catch (error) {
      console.error('Error fetching Krono stats:', error);
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
      title: "Samtal",
      value: stats.totalCalls,
      icon: Phone,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "SMS",
      value: stats.totalSMS,
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Bokningar",
      value: stats.totalBookings,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Minuter använda",
      value: stats.minutesUsed,
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Receptionist (Krono)</h2>
          <p className="text-muted-foreground">Hantera dina samtals- och SMS-interaktioner</p>
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
          <CardTitle>Senaste samtal</CardTitle>
          <CardDescription>Översikt av dina senaste kundinteraktioner</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Phone className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Inga samtal att visa än</p>
            <p className="text-sm mt-2">Samtal kommer att visas här när de registreras</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
