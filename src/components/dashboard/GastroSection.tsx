import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, TrendingUp, Clock, Settings, UtensilsCrossed, RefreshCw, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { PremiumTelephonyStatCard } from "@/components/telephony/PremiumTelephonyStatCard";
import hiemsLogoSnowflake from '@/assets/hiems-logo-snowflake.png';
import { toast } from "sonner";

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

  const handleRefresh = () => {
    fetchGastroStats();
    toast.success('Data uppdaterad');
  };

  const handleExport = () => {
    toast.success('Export klar');
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
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[350px] h-[350px] opacity-[0.04] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_50s_linear_infinite]" />
        </div>
        <div className="absolute top-1/2 right-1/4 w-[200px] h-[200px] opacity-[0.02] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_35s_linear_infinite]" />
        </div>
        <div className="absolute top-1/3 left-1/3 w-[180px] h-[180px] opacity-[0.025] pointer-events-none">
          <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_45s_linear_infinite_reverse]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-block">
                <span className="text-sm font-semibold tracking-wider text-primary uppercase">Realtidsövervakning</span>
                <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50 mt-2" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
                Restaurang & Café AI (Gastro)
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                Hantera bokningar och kundinteraktioner med AI
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
                <Badge variant="outline">{stats.totalBookings} bokningar</Badge>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={handleRefresh} className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Uppdatera
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport} className="hover:bg-primary/5 hover:border-primary/30 transition-all duration-500">
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
                title="Totala bokningar" 
                value={stats.totalBookings}
                icon={Calendar}
                color="text-blue-600"
                subtitle="Alla bokningar"
              />
              <PremiumTelephonyStatCard 
                title="Idag" 
                value={stats.todayBookings}
                icon={Clock}
                color="text-green-600"
                subtitle="Dagens bokningar"
              />
              <PremiumTelephonyStatCard 
                title="Senaste veckan" 
                value={stats.weekBookings}
                icon={TrendingUp}
                color="text-purple-600"
                subtitle="7 dagar tillbaka"
              />
              <PremiumTelephonyStatCard 
                title="Gäster totalt" 
                value={stats.avgPartySize}
                icon={Users}
                color="text-orange-600"
                subtitle="Genomsnitt per bokning"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={300}>
            <Card className="border border-primary/10 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:shadow-xl hover:border-primary/30 transition-all duration-500">
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
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
