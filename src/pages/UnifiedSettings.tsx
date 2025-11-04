import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { CompanyTeamSection } from "@/components/settings/CompanyTeamSection";
import { EnhancedIntegrationsSection } from "@/components/settings/EnhancedIntegrationsSection";
import { ProductsSettings } from "@/components/settings/ProductsSettings";
import { HiemsAdminPanel } from "@/components/settings/HiemsAdminPanel";
import { MiniStatCard } from "@/components/settings/MiniStatCard";
import { useAuth } from "@/hooks/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { useIntegrations } from "@/hooks/useIntegrations";
import { useHiemsAdmin } from "@/hooks/useHiemsAdmin";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { User, Shield, Building2, Plug, Package, ShieldCheck, Building, Clock, Star, Zap } from "lucide-react";

export default function UnifiedSettings() {
  const { user } = useAuth();
  const { organization } = useOrganization();
  const { integrations } = useIntegrations();
  const { isHiemsAdmin } = useHiemsAdmin();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const activeTab = searchParams.get('tab') || 'profil';
  
  useEffect(() => {
    document.title = "Inställningar - Hiems";
  }, []);

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const activeIntegrationsCount = integrations.filter(i => i.is_active).length;
  const lastUpdated = user?.updated_at 
    ? format(new Date(user.updated_at), 'PPp', { locale: sv })
    : 'Aldrig';

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      
      {/* Floating snowflakes effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-snowflake opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-${Math.random() * 20}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          >
            ❄️
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto py-8 px-4 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-8 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent animate-gradient">
            Inställningar
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hantera ditt konto, säkerhet, företagsinställningar och integrationer
          </p>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MiniStatCard
            label="Företag"
            value={organization?.name || "Inget företag"}
            icon={Building}
          />
          <MiniStatCard
            label="Integrationer"
            value={`${activeIntegrationsCount} aktiva`}
            icon={Plug}
          />
          <MiniStatCard
            label="Plan"
            value="Pro"
            icon={Star}
          />
          <MiniStatCard
            label="Senast uppdaterad"
            value={lastUpdated}
            icon={Clock}
          />
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:inline-flex lg:w-auto gap-2 h-auto p-1 bg-card/50 backdrop-blur-sm border border-border/50">
            <TabsTrigger value="profil" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="sakerhet" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Säkerhet</span>
            </TabsTrigger>
            <TabsTrigger value="foretag" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Företag</span>
            </TabsTrigger>
            <TabsTrigger value="integrationer" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Plug className="h-4 w-4" />
              <span className="hidden sm:inline">Integrationer</span>
            </TabsTrigger>
            <TabsTrigger value="produkter" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Produkter</span>
            </TabsTrigger>
            {isHiemsAdmin && (
              <TabsTrigger value="admin" className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
                <ShieldCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="profil" className="space-y-6 animate-enter">
            <ProfileSection />
          </TabsContent>

          <TabsContent value="sakerhet" className="space-y-6 animate-enter">
            <SecuritySection />
          </TabsContent>

          <TabsContent value="foretag" className="space-y-6 animate-enter">
            <CompanyTeamSection />
          </TabsContent>

          <TabsContent value="integrationer" className="space-y-6 animate-enter">
            <EnhancedIntegrationsSection />
          </TabsContent>

          <TabsContent value="produkter" className="space-y-6 animate-enter">
            <ProductsSettings />
          </TabsContent>

          {isHiemsAdmin && (
            <TabsContent value="admin" className="space-y-6 animate-enter">
              <HiemsAdminPanel />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
