import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, Calendar, BarChart3, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PremiumHeader } from "@/components/premium/PremiumHeader";
import { PremiumStatCard } from "@/components/premium/PremiumStatCard";
import { PremiumCard } from "@/components/premium/PremiumCard";

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
      const { data: callData } = await supabase
        .from('call_history')
        .select('duration');

      const { data: messageData } = await supabase
        .from('messages')
        .select('id');

      const { data: bookingData } = await supabase
        .from('bookings')
        .select('id');

      const minutesUsed = (callData || []).reduce((acc, call) => {
        if (call.duration && typeof call.duration === 'number') {
          return acc + call.duration;
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

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Bakgrundsgradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
      
      <div className="relative z-10 space-y-8">
        <PremiumHeader
          title="AI Receptionist"
          subtitle="Hantera dina samtals- och SMS-interaktioner"
          actions={
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Inställningar
            </Button>
          }
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <PremiumStatCard
            title="Samtal"
            value={stats.totalCalls}
            icon={Phone}
            iconColor="text-blue-600"
          />
          <PremiumStatCard
            title="SMS"
            value={stats.totalSMS}
            icon={MessageSquare}
            iconColor="text-green-600"
          />
          <PremiumStatCard
            title="Bokningar"
            value={stats.totalBookings}
            icon={Calendar}
            iconColor="text-purple-600"
          />
          <PremiumStatCard
            title="Minuter använda"
            value={stats.minutesUsed}
            icon={BarChart3}
            iconColor="text-orange-600"
          />
        </div>

        <PremiumCard>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Senaste samtal</h3>
            <p className="text-sm text-muted-foreground">Översikt av dina senaste kundinteraktioner</p>
          </div>
          <div className="text-center py-8 text-muted-foreground">
            <Phone className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Inga samtal att visa än</p>
            <p className="text-sm mt-2">Samtal kommer att visas här när de registreras</p>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}
