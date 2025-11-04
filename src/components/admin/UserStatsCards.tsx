import { Users, ShieldCheck, Settings, User } from "lucide-react";
import { PremiumTelephonyStatCard } from "@/components/telephony/PremiumTelephonyStatCard";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

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
  return (
    <section className="relative py-16 bg-gradient-to-b from-background via-primary/3 to-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,hsl(var(--primary)/0.12),transparent_50%)]" />
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <AnimatedSection delay={200}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
