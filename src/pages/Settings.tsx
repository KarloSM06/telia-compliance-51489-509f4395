import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Package, Users, Code, Bell, Puzzle, CreditCard, ShieldCheck } from "lucide-react";
import { useHiemsAdmin } from "@/hooks/useHiemsAdmin";
import { useOrganizationRole } from "@/hooks/useOrganizationRole";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";

export default function Settings() {
  const { isHiemsAdmin } = useHiemsAdmin();
  const { isOrgAdmin, organizationId } = useOrganizationRole();
  const [activeTab, setActiveTab] = useState("profile");

  // Show Team tab only for Enterprise customers or Hiems admins
  const showTeamTab = organizationId || isHiemsAdmin;

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Inställningar</h1>
        <p className="text-muted-foreground">
          Hantera ditt konto, säkerhet och preferenser
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-2 h-auto p-1">
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
          <div className="text-center py-12 text-muted-foreground">
            Produktinställningar kommer snart...
          </div>
        </TabsContent>

        {showTeamTab && (
          <TabsContent value="team" className="space-y-6">
            <div className="text-center py-12 text-muted-foreground">
              Team management kommer snart...
            </div>
          </TabsContent>
        )}

        {isHiemsAdmin && (
          <TabsContent value="hiems-admin" className="space-y-6">
            <div className="text-center py-12 text-muted-foreground">
              Hiems Admin Panel kommer snart...
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
