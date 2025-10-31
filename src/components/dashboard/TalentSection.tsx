import { Button } from "@/components/ui/button";
import { Users, UserCheck, FileText, TrendingUp, Settings } from "lucide-react";
import { PremiumHeader } from "@/components/premium/PremiumHeader";
import { PremiumStatCard } from "@/components/premium/PremiumStatCard";
import { PremiumCard } from "@/components/premium/PremiumCard";

export function TalentSection() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Bakgrundsgradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
      
      <div className="relative z-10 space-y-8">
        <PremiumHeader
          title="AI Rekrytering"
          subtitle="Hantera rekryteringsprocessen med AI"
          actions={
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Inställningar
            </Button>
          }
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <PremiumStatCard
            title="Kandidater"
            value={0}
            icon={Users}
            iconColor="text-blue-600"
          />
          <PremiumStatCard
            title="Intervjuer"
            value={0}
            icon={UserCheck}
            iconColor="text-green-600"
          />
          <PremiumStatCard
            title="Ansökningar"
            value={0}
            icon={FileText}
            iconColor="text-purple-600"
          />
          <PremiumStatCard
            title="Anställningar"
            value={0}
            icon={TrendingUp}
            iconColor="text-orange-600"
          />
        </div>

        <PremiumCard>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Senaste kandidater</h3>
            <p className="text-sm text-muted-foreground">Översikt av dina rekryteringsaktiviteter</p>
          </div>
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Inga kandidater att visa än</p>
            <p className="text-sm mt-2">Rekryteringsdata kommer att visas här när den blir tillgänglig</p>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}