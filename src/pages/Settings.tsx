import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PremiumHeader } from "@/components/ui/premium-header";
import { User, Shield, Package, Users, ShieldCheck, Settings as SettingsIcon } from "lucide-react";
import { useHiemsAdmin } from "@/hooks/useHiemsAdmin";
import { useOrganizationRole } from "@/hooks/useOrganizationRole";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { ProductsSettings } from "@/components/settings/ProductsSettings";
import { TeamSettings } from "@/components/settings/TeamSettings";
import { HiemsAdminPanel } from "@/components/settings/HiemsAdminPanel";
import { AIProviderSettings } from "@/components/settings/AIProviderSettings";

export default function Settings() {
  const { isHiemsAdmin } = useHiemsAdmin();
  const { organizationId } = useOrganizationRole();
  const [activeTab, setActiveTab] = useState("profile");

  const showTeamTab = organizationId || isHiemsAdmin;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      
      <div className="relative z-10 container mx-auto py-8 px-4 max-w-6xl">
        <PremiumHeader
          icon={<SettingsIcon className="h-8 w-8 text-primary" />}
          title="Inställningar"
          subtitle="Hantera ditt konto, säkerhet och preferenser"
          className="mb-8"
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 lg:inline-flex gap-2 h-auto p-1 bg-muted/50 backdrop-blur-sm animate-slide-in-right">
            <TabsTrigger value="profile" className="gap-2 hover-scale">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 hover-scale">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Säkerhet</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2 hover-scale">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Produkter</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2 hover-scale">
              <SettingsIcon className="h-4 w-4" />
              <span className="hidden sm:inline">AI</span>
            </TabsTrigger>
            {showTeamTab && (
              <TabsTrigger value="team" className="gap-2 hover-scale">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Team</span>
              </TabsTrigger>
            )}
            {isHiemsAdmin && (
              <TabsTrigger value="hiems-admin" className="gap-2 bg-gradient-to-r from-purple-600/10 to-pink-600/10 hover-scale">
                <ShieldCheck className="h-4 w-4 text-purple-600" />
                <span className="hidden sm:inline text-purple-600">Hiems Admin</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="profile" className="space-y-6 animate-enter">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="security" className="space-y-6 animate-enter">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="products" className="space-y-6 animate-enter">
            <ProductsSettings />
          </TabsContent>

          <TabsContent value="ai" className="space-y-6 animate-enter">
            <AIProviderSettings />
          </TabsContent>

          {showTeamTab && (
            <TabsContent value="team" className="space-y-6 animate-enter">
              <TeamSettings />
            </TabsContent>
          )}

          {isHiemsAdmin && (
            <TabsContent value="hiems-admin" className="space-y-6 animate-enter">
              <HiemsAdminPanel />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
