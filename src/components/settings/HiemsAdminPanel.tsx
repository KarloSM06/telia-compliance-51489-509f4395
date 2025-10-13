import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Users, Database, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminStats {
  totalUsers: number;
  totalOrganizations: number;
  totalProducts: number;
  activeSubscriptions: number;
}

export function HiemsAdminPanel() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalOrganizations: 0,
    totalProducts: 0,
    activeSubscriptions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      // Fetch total users from profiles
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Fetch total organizations
      const { count: orgsCount } = await supabase
        .from("organizations")
        .select("*", { count: "exact", head: true });

      // Fetch total products
      const { count: productsCount } = await supabase
        .from("user_products")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

      // Fetch active subscriptions
      const { count: subsCount } = await supabase
        .from("subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

      setStats({
        totalUsers: usersCount || 0,
        totalOrganizations: orgsCount || 0,
        totalProducts: productsCount || 0,
        activeSubscriptions: subsCount || 0,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      toast.error("Kunde inte hämta admin-statistik");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-purple-900">Hiems Admin Panel</CardTitle>
              <CardDescription className="text-purple-700">
                Systemövergripande administration och statistik
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 bg-white rounded-lg border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  <p className="text-sm text-muted-foreground">Totala Användare</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Database className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalOrganizations}</p>
                  <p className="text-sm text-muted-foreground">Organisationer</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Activity className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalProducts}</p>
                  <p className="text-sm text-muted-foreground">Aktiva Produkter</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ShieldCheck className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activeSubscriptions}</p>
                  <p className="text-sm text-muted-foreground">Prenumerationer</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admin-privilegier</CardTitle>
          <CardDescription>
            Som Hiems Admin har du fullständig tillgång till systemet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
              <Badge variant="default">✓</Badge>
              <span className="text-sm">Full åtkomst till alla användare och organisationer</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
              <Badge variant="default">✓</Badge>
              <span className="text-sm">Alla produkter tillgängliga utan kostnad</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
              <Badge variant="default">✓</Badge>
              <span className="text-sm">Systemövergripande konfiguration och hantering</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-accent/50 rounded-lg">
              <Badge variant="default">✓</Badge>
              <span className="text-sm">Fullständig granskningslogg över systemhändelser</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
