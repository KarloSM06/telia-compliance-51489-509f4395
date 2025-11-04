import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RoleBadge } from "./RoleBadge";

interface UserPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userEmail: string;
  userRole: 'admin' | 'client';
  onSuccess: () => void;
}

interface DefaultRoute {
  route_key: string;
  route_path: string;
  route_title: string;
  route_group: string;
  display_order: number;
  enabled_by_default: boolean;
}

interface UserPermission {
  route_key: string;
  enabled: boolean;
}

export function UserPermissionsDialog({
  open,
  onOpenChange,
  userId,
  userEmail,
  userRole,
  onSuccess,
}: UserPermissionsDialogProps) {
  const [defaultRoutes, setDefaultRoutes] = useState<DefaultRoute[]>([]);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, userId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all default routes
      const { data: routes, error: routesError } = await supabase
        .from('default_sidebar_routes')
        .select('*')
        .order('display_order');

      if (routesError) throw routesError;

      // Fetch user's current permissions
      const { data: userPerms, error: permsError } = await supabase
        .from('sidebar_permissions')
        .select('route_key, enabled')
        .eq('user_id', userId);

      if (permsError) throw permsError;

      setDefaultRoutes(routes || []);

      // Build permissions object
      const permsMap: Record<string, boolean> = {};
      routes?.forEach((route) => {
        const userPerm = userPerms?.find((p) => p.route_key === route.route_key);
        permsMap[route.route_key] = userPerm ? userPerm.enabled : route.enabled_by_default;
      });

      setPermissions(permsMap);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast.error('Kunde inte hämta användarens rättigheter');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePermission = (routeKey: string) => {
    setPermissions((prev) => ({
      ...prev,
      [routeKey]: !prev[routeKey],
    }));
  };

  const handleToggleGroup = (group: string, enabled: boolean) => {
    const groupRoutes = defaultRoutes.filter((r) => r.route_group === group);
    const newPermissions = { ...permissions };
    groupRoutes.forEach((route) => {
      newPermissions[route.route_key] = enabled;
    });
    setPermissions(newPermissions);
  };

  const handleResetToDefault = () => {
    const defaultPerms: Record<string, boolean> = {};
    defaultRoutes.forEach((route) => {
      defaultPerms[route.route_key] = route.enabled_by_default;
    });
    setPermissions(defaultPerms);
    toast.info('Återställt till standardinställningar');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Delete all existing permissions for this user
      await supabase
        .from('sidebar_permissions')
        .delete()
        .eq('user_id', userId);

      // Insert new permissions
      const permissionsToInsert = Object.entries(permissions).map(([route_key, enabled]) => ({
        user_id: userId,
        route_key,
        enabled,
      }));

      const { error } = await supabase
        .from('sidebar_permissions')
        .insert(permissionsToInsert);

      if (error) throw error;

      toast.success('Rättigheter uppdaterade');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast.error('Kunde inte spara rättigheter');
    } finally {
      setSaving(false);
    }
  };

  const groupedRoutes = {
    overview: defaultRoutes.filter((r) => r.route_group === 'overview' && r.route_key !== 'admin_panel'),
    business: defaultRoutes.filter((r) => r.route_group === 'business'),
    communication: defaultRoutes.filter((r) => r.route_group === 'communication'),
    system: defaultRoutes.filter((r) => r.route_group === 'system'),
  };

  const groupTitles = {
    overview: 'Översikt',
    business: 'Affärsverktyg',
    communication: 'Kommunikation',
    system: 'System',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Redigera rättigheter för {userEmail}
            <RoleBadge role={userRole} />
          </DialogTitle>
          <DialogDescription>
            Välj vilka sidor användaren ska ha tillgång till i sidopanelen.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedRoutes).map(([groupKey, routes]) => {
                if (routes.length === 0) return null;

                const groupTitle = groupTitles[groupKey as keyof typeof groupTitles];
                const allEnabled = routes.every((r) => permissions[r.route_key]);
                const someEnabled = routes.some((r) => permissions[r.route_key]);

                return (
                  <div key={groupKey} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm">{groupTitle}</h3>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleGroup(groupKey, true)}
                          disabled={allEnabled}
                        >
                          Aktivera alla
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleGroup(groupKey, false)}
                          disabled={!someEnabled}
                        >
                          Avaktivera alla
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 pl-4">
                      {routes.map((route) => (
                        <div key={route.route_key} className="flex items-center space-x-2">
                          <Checkbox
                            id={route.route_key}
                            checked={permissions[route.route_key]}
                            onCheckedChange={() => handleTogglePermission(route.route_key)}
                          />
                          <Label
                            htmlFor={route.route_key}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {route.route_title}
                          </Label>
                        </div>
                      ))}
                    </div>

                    <Separator />
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleResetToDefault}>
            Återställ till standard
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Avbryt
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Sparar...' : 'Spara'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
