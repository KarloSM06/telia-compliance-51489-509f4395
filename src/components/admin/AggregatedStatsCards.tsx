import { PremiumTelephonyStatCard } from "@/components/telephony/PremiumTelephonyStatCard";
import { Phone, MessageSquare, Calendar, Users, TrendingUp, DollarSign } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

interface AggregatedStatsCardsProps {
  totalCalls: number;
  totalSms: number;
  totalMeetings: number;
  totalLeads: number;
  activeUsers: number;
  totalRevenue: number;
  callsTrend?: number;
  smsTrend?: number;
  meetingsTrend?: number;
}

export const AggregatedStatsCards = ({
  totalCalls,
  totalSms,
  totalMeetings,
  totalLeads,
  activeUsers,
  totalRevenue,
  callsTrend,
  smsTrend,
  meetingsTrend,
}: AggregatedStatsCardsProps) => {
  return (
    <section className="relative py-12 bg-gradient-to-b from-background via-primary/2 to-background">
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
      
      <AnimatedSection className="container mx-auto px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <PremiumTelephonyStatCard
            icon={Phone}
            title="Totalt Samtal"
            value={totalCalls.toLocaleString()}
            subtitle="Alla kunder"
            color="text-primary"
            trend={callsTrend ? { value: callsTrend, isPositive: callsTrend > 0 } : undefined}
          />
          
          <PremiumTelephonyStatCard
            icon={MessageSquare}
            title="Totalt SMS"
            value={totalSms.toLocaleString()}
            subtitle="Alla kunder"
            color="text-primary"
            trend={smsTrend ? { value: smsTrend, isPositive: smsTrend > 0 } : undefined}
          />
          
          <PremiumTelephonyStatCard
            icon={Calendar}
            title="Totalt Möten"
            value={totalMeetings.toLocaleString()}
            subtitle="Alla kunder"
            color="text-primary"
            trend={meetingsTrend ? { value: meetingsTrend, isPositive: meetingsTrend > 0 } : undefined}
          />
          
          <PremiumTelephonyStatCard
            icon={TrendingUp}
            title="Totalt Leads"
            value={totalLeads.toLocaleString()}
            subtitle="Genererade"
            color="text-primary"
          />
          
          <PremiumTelephonyStatCard
            icon={Users}
            title="Aktiva Användare"
            value={activeUsers.toLocaleString()}
            subtitle="Senaste 30 dagarna"
            color="text-primary"
          />
          
          <PremiumTelephonyStatCard
            icon={DollarSign}
            title="Total Intäkt"
            value={`${totalRevenue.toLocaleString()} kr`}
            subtitle="Från möten"
            color="text-primary"
          />
        </div>
      </AnimatedSection>
    </section>
  );
};
