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

export default function Settings() {
  const { isHiemsAdmin } = useHiemsAdmin();
  const { isOrgAdmin, organizationId } = useOrganizationRole();
  const [activeTab, setActiveTab] = useState("profile");

  // Show Team tab only for Enterprise customers or Hiems admins
  const showTeamTab = organizationId || isHiemsAdmin;

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl animate-fade-in">
      <div className="mb-8 animate-scale-in">
        <h1 className="text-3xl font-bold mb-2">Inställningar</h1>
        <p className="text-muted-foreground">
          Hantera ditt konto, säkerhet och preferenser
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-5 gap-2 h-auto p-1 animate-slide-in-right">
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
          <TabsTrigger value="roi" className="gap-2 hover-scale">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">ROI</span>
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

        <TabsContent value="roi" className="space-y-6 animate-enter">
          <ROISettings />
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
  );
}
