import { Button } from "@/components/ui/button";
import { Calendar, Users, TrendingUp, Clock, Settings, UtensilsCrossed } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PremiumHeader } from "@/components/premium/PremiumHeader";
import { PremiumStatCard } from "@/components/premium/PremiumStatCard";
import { PremiumCard } from "@/components/premium/PremiumCard";

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
        avgPartySize: 0,
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

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Bakgrundsgradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
      
      <div className="relative z-10 space-y-8">
        <PremiumHeader
          title="Restaurang & Café AI"
          subtitle="Hantera bokningar och kundinteraktioner"
          actions={
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Inställningar
            </Button>
          }
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <PremiumStatCard
            title="Totala bokningar"
            value={stats.totalBookings}
            icon={Calendar}
            iconColor="text-blue-600"
          />
          <PremiumStatCard
            title="Idag"
            value={stats.todayBookings}
            icon={Clock}
            iconColor="text-green-600"
          />
          <PremiumStatCard
            title="Senaste veckan"
            value={stats.weekBookings}
            icon={TrendingUp}
            iconColor="text-purple-600"
          />
          <PremiumStatCard
            title="Gäster totalt"
            value={stats.avgPartySize}
            icon={Users}
            iconColor="text-orange-600"
          />
        </div>

        <PremiumCard>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Senaste bokningar</h3>
            <p className="text-sm text-muted-foreground">Översikt av kommande och tidigare bokningar</p>
          </div>
          <div className="text-center py-8 text-muted-foreground">
            <UtensilsCrossed className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Inga bokningar att visa än</p>
            <p className="text-sm mt-2">Bokningar kommer att visas här när de registreras</p>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}
