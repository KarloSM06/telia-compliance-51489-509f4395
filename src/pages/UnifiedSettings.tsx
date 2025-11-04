import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { useIntegrations } from "@/hooks/useIntegrations";
import { useHiemsAdmin } from "@/hooks/useHiemsAdmin";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { MiniStatCard } from "@/components/settings/MiniStatCard";
import { Users, Plug, Building2, Clock, Settings as SettingsIcon } from "lucide-react";
import hiemsLogoSnowflake from "@/assets/hiems-logo-snowflake.png";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { CompanyTeamSection } from "@/components/settings/CompanyTeamSection";
import { IntegrationsSection } from "@/components/settings/IntegrationsSection";
import { ProductsSettings } from "@/components/settings/ProductsSettings";
import { HiemsAdminPanel } from "@/components/settings/HiemsAdminPanel";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";

export default function UnifiedSettings() {
  const { user } = useAuth();
  const { organization } = useOrganization();
  const { integrations } = useIntegrations();
  const { isHiemsAdmin } = useHiemsAdmin();

  useEffect(() => {
    document.title = "Kontrollpanel - Hiems";
  }, []);

  const activeIntegrations = integrations.filter((i) => i.is_active).length;
  const lastUpdated = user?.updated_at
    ? formatDistanceToNow(new Date(user.updated_at), { addSuffix: true, locale: sv })
    : "Aldrig";

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* === HERO SECTION === */}
      <section className="relative py-16 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        
        {/* Snowflakes - 3 stora med olika hastigheter */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] opacity-[0.03] pointer-events-none">
          <img
            src={hiemsLogoSnowflake}
            alt=""
            className="w-full h-full object-contain animate-[spin_60s_linear_infinite]"
          />
        </div>
        <div className="absolute top-1/2 -left-20 w-[350px] h-[350px] opacity-[0.02] pointer-events-none">
          <img
            src={hiemsLogoSnowflake}
            alt=""
            className="w-full h-full object-contain animate-[spin_45s_linear_infinite_reverse]"
          />
        </div>
        <div className="absolute bottom-10 right-1/4 w-[250px] h-[250px] opacity-[0.025] pointer-events-none">
          <img
            src={hiemsLogoSnowflake}
            alt=""
            className="w-full h-full object-contain animate-[spin_90s_linear_infinite]"
          />
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center space-y-6">
              {/* Label with gradient line */}
              <div className="inline-block">
                <span className="text-sm font-semibold tracking-wider text-primary uppercase">
                  Inställningar
                </span>
                <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50 mt-2" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
                Kontrollpanel
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                Hantera din profil, team, integrationer och företagsinställningar på ett ställe
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* === QUICK STATS BAR === */}
      <section className="relative py-8 border-y border-primary/10 bg-gradient-to-b from-background via-primary/2 to-background">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={50}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MiniStatCard icon={Building2} label="Företag" value={organization?.name || "Inget"} />
              <MiniStatCard icon={Plug} label="Integrationer" value={activeIntegrations} />
              <MiniStatCard
                icon={Users}
                label="Plan"
                value={organization?.plan_type.toUpperCase() || "N/A"}
              />
              <MiniStatCard icon={Clock} label="Uppdaterad" value={lastUpdated} />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* === SECTION 1: PROFIL === */}
      <section className="relative py-12 bg-gradient-to-b from-background via-primary/2 to-background">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={0}>
            <div className="max-w-5xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <SettingsIcon className="h-5 w-5 text-primary" />
                  </div>
                  Profilinställningar
                </h2>
                <p className="text-muted-foreground mt-1">
                  Hantera din profil, profilbild och preferenser
                </p>
              </div>
              <ProfileSection />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* === SECTION 2: SÄKERHET === */}
      <section className="relative py-12 bg-gradient-to-b from-background via-primary/2 to-background">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={100}>
            <div className="max-w-5xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <SettingsIcon className="h-5 w-5 text-primary" />
                  </div>
                  Säkerhet & API
                </h2>
                <p className="text-muted-foreground mt-1">
                  Lösenord, autentisering, API-nycklar och dataskydd
                </p>
              </div>
              <SecuritySection />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* === SECTION 3: FÖRETAG & TEAM === */}
      <section className="relative py-12 bg-gradient-to-b from-background via-primary/2 to-background">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={200}>
            <div className="max-w-5xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  Företag & Team
                </h2>
                <p className="text-muted-foreground mt-1">
                  Företagsinformation, ROI-inställningar och teamhantering
                </p>
              </div>
              <CompanyTeamSection />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* === SECTION 4: INTEGRATIONER === */}
      <section className="relative py-12 bg-gradient-to-b from-background via-primary/2 to-background">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={300}>
            <div className="max-w-5xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Plug className="h-5 w-5 text-primary" />
                  </div>
                  Integrationer
                </h2>
                <p className="text-muted-foreground mt-1">
                  Hantera alla dina externa tjänster och API-anslutningar
                </p>
              </div>
              <IntegrationsSection />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* === SECTION 5: PRODUKTER === */}
      <section className="relative py-12 bg-gradient-to-b from-background via-primary/2 to-background">
        <div className="container mx-auto px-6 lg:px-8">
          <AnimatedSection delay={400}>
            <div className="max-w-5xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <SettingsIcon className="h-5 w-5 text-primary" />
                  </div>
                  Mina Produkter
                </h2>
                <p className="text-muted-foreground mt-1">
                  Översikt över dina aktiva produkter och prenumerationer
                </p>
              </div>
              <ProductsSettings />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* === SECTION 6: HIEMS ADMIN (conditional) === */}
      {isHiemsAdmin && (
        <section className="relative py-12 bg-gradient-to-b from-background via-purple-500/5 to-background">
          <div className="container mx-auto px-6 lg:px-8">
            <AnimatedSection delay={500}>
              <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    <div className="p-2 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-lg">
                      <SettingsIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    Hiems Admin
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Administrativa verktyg och övervakningspanel
                  </p>
                </div>
                <HiemsAdminPanel />
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}
    </div>
  );
}
