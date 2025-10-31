import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Package, Users, ShieldCheck, DollarSign } from "lucide-react";
import { useHiemsAdmin } from "@/hooks/useHiemsAdmin";
import { useOrganizationRole } from "@/hooks/useOrganizationRole";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { ProductsSettings } from "@/components/settings/ProductsSettings";
import { TeamSettings } from "@/components/settings/TeamSettings";
import { HiemsAdminPanel } from "@/components/settings/HiemsAdminPanel";
import { ROISettings } from "@/components/settings/ROISettings";
import { PremiumHeader } from "@/components/premium/PremiumHeader";

export default function Settings() {
  const { isHiemsAdmin } = useHiemsAdmin();
  const { isOrgAdmin, organizationId } = useOrganizationRole();
  const [activeTab, setActiveTab] = useState("profile");

  const showTeamTab = organizationId || isHiemsAdmin;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Bakgrundsgradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
      
      <div className="relative z-10 container mx-auto py-8 px-4 max-w-6xl">
        <PremiumHeader
          title="Inställningar"
          subtitle="Hantera ditt konto, säkerhet och preferenser"
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 lg:grid-cols-5 gap-2 h-auto p-1">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profil</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Säkerhet</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Produkter</span>
            </TabsTrigger>
            <TabsTrigger value="roi" className="gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">ROI</span>
            </TabsTrigger>
            {showTeamTab && (
              <TabsTrigger value="team" className="gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Team</span>
              </TabsTrigger>
            )}
            {isHiemsAdmin && (
              <TabsTrigger value="hiems-admin" className="gap-2 bg-gradient-to-r from-purple-600/10 to-pink-600/10">
                <ShieldCheck className="h-4 w-4 text-purple-600" />
                <span className="hidden sm:inline text-purple-600">Hiems Admin</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <ProductsSettings />
          </TabsContent>

          <TabsContent value="roi" className="space-y-6">
            <ROISettings />
          </TabsContent>

          {showTeamTab && (
            <TabsContent value="team" className="space-y-6">
              <TeamSettings />
            </TabsContent>
          )}

          {isHiemsAdmin && (
            <TabsContent value="hiems-admin" className="space-y-6">
              <HiemsAdminPanel />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
