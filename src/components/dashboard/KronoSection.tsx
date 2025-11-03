import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Phone, MessageSquare, Calendar, BarChart3, Settings, RefreshCw, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PremiumTelephonyStatCard } from "@/components/telephony/PremiumTelephonyStatCard";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import hiemsLogoSnowflake from '@/assets/hiems-logo-snowflake.png';

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
        
        {/* Snowflakes */}
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] opacity-5 pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_60s_linear_infinite]" />
        </div>
        <div className="absolute -top-20 -left-20 w-[450px] h-[450px] opacity-[0.03] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_40s_linear_infinite_reverse]" />
        </div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-block">
                <span className="text-sm font-semibold tracking-wider text-primary uppercase">Realtidsövervakning</span>
                <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50 mt-2" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
                AI Receptionist (Krono)
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                Hantera dina samtals- och SMS-interaktioner
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="relative py-8 border-y border-primary/10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={100}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 hover:scale-105 transition-transform duration-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-semibold text-green-600 uppercase tracking-wide">Live</span>
                </div>
                <Badge variant="outline">{stats.totalCalls} samtal</Badge>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={fetchKronoStats} className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Uppdatera
                </Button>
                <Button variant="outline" size="sm" className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                  <Settings className="h-4 w-4 mr-2" />
                  Inställningar
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="relative py-16 bg-gradient-to-b from-background via-primary/3 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,hsl(var(--primary)/0.12),transparent_50%)]" />
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection delay={200}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <PremiumTelephonyStatCard 
                title="Samtal" 
                value={stats.totalCalls}
                icon={Phone}
                color="text-blue-600"
                subtitle="Totalt antal"
              />
              <PremiumTelephonyStatCard 
                title="SMS" 
                value={stats.totalSMS}
                icon={MessageSquare}
                color="text-green-600"
                subtitle="Skickade"
              />
              <PremiumTelephonyStatCard 
                title="Bokningar" 
                value={stats.totalBookings}
                icon={Calendar}
                color="text-purple-600"
                subtitle="Skapade"
              />
              <PremiumTelephonyStatCard 
                title="Minuter använda" 
                value={stats.minutesUsed}
                icon={BarChart3}
                color="text-orange-600"
                subtitle="Total samtalstid"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={300}>
            <Card className="p-6 border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md">
              <div className="text-center py-8 text-muted-foreground">
                <Phone className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">Inga samtal att visa än</p>
                <p className="text-sm mt-2">Samtal kommer att visas här när de registreras</p>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
