import { Users, ShieldCheck, Settings, User, Activity, TrendingUp } from "lucide-react";
import { PremiumTelephonyStatCard } from "@/components/telephony/PremiumTelephonyStatCard";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

interface UserStatsCardsProps {
  totalUsers: number;
  adminCount: number;
  clientCount: number;
  usersWithCustomPermissions: number;
  activeUsers?: number;
  newUsersThisWeek?: number;
  activeUsersTrend?: number;
  newUsersTrend?: number;
}

export function UserStatsCards({ 
  totalUsers, 
  adminCount, 
  clientCount, 
  usersWithCustomPermissions,
  activeUsers = 0,
  newUsersThisWeek = 0,
  activeUsersTrend = 0,
  newUsersTrend = 0,
}: UserStatsCardsProps) {
  return (
    <section className="relative py-16 bg-gradient-to-b from-background via-primary/3 to-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,hsl(var(--primary)/0.12),transparent_50%)]" />
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <AnimatedSection delay={200}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <PremiumTelephonyStatCard 
              title="Totalt Användare" 
              value={totalUsers} 
              icon={Users} 
              color="text-blue-600" 
              subtitle="Registrerade konton" 
            />
            <PremiumTelephonyStatCard 
              title="Administratörer" 
              value={adminCount} 
              icon={ShieldCheck} 
              color="text-purple-600" 
              subtitle="Full åtkomst" 
            />
            <PremiumTelephonyStatCard 
              title="Klienter" 
              value={clientCount} 
              icon={User} 
              color="text-green-600" 
              subtitle="Standard användare" 
            />
            <PremiumTelephonyStatCard 
              title="Aktiva Användare" 
              value={activeUsers} 
              icon={Activity} 
              color="text-emerald-600" 
              subtitle="Senaste 30 dagarna"
              trend={activeUsersTrend !== 0 ? {
                value: Math.abs(activeUsersTrend),
                isPositive: activeUsersTrend > 0
              } : undefined}
            />
            <PremiumTelephonyStatCard 
              title="Nya denna vecka" 
              value={newUsersThisWeek} 
              icon={TrendingUp} 
              color="text-sky-600" 
              subtitle="7 dagar"
              trend={newUsersTrend !== 0 ? {
                value: Math.abs(newUsersTrend),
                isPositive: newUsersTrend > 0
              } : undefined}
            />
            <PremiumTelephonyStatCard 
              title="Anpassade Rättigheter" 
              value={usersWithCustomPermissions} 
              icon={Settings} 
              color="text-orange-600" 
              subtitle="Modifierade användare" 
            />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
