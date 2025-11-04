import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RoleBadge } from "./RoleBadge";
import { Settings, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import hiemsLogoSnowflake from '@/assets/hiems-logo-snowflake.png';

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

  const groupStyles = {
    overview: "border-blue-500/20 bg-blue-500/5",
    business: "border-purple-500/20 bg-purple-500/5",
    communication: "border-green-500/20 bg-green-500/5",
    system: "border-orange-500/20 bg-orange-500/5"
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-w-3xl max-h-[85vh]",
        "border border-primary/20",
        "bg-gradient-to-br from-card/95 via-card/90 to-card/85",
        "backdrop-blur-xl"
      )}>
        {/* Snowflake background */}
        <div className="absolute -top-8 -right-8 w-32 h-32 opacity-[0.02] pointer-events-none">
          <img 
            src={hiemsLogoSnowflake} 
            alt="" 
            className="w-full h-full object-contain animate-[spin_60s_linear_infinite]"
          />
        </div>

        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={cn(
              "rounded-xl p-3",
              "bg-gradient-to-br from-primary/20 to-primary/5",
              "border border-primary/20"
            )}>
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold">
                Redigera Rättigheter
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <span>{userEmail}</span>
                <RoleBadge role={userRole} />
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[450px] pr-4 mt-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary" />
                <img 
                  src={hiemsLogoSnowflake} 
                  alt="" 
                  className="absolute inset-0 m-auto h-6 w-6 opacity-30 animate-pulse" 
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedRoutes).map(([groupKey, routes]) => {
                if (routes.length === 0) return null;

                const groupTitle = groupTitles[groupKey as keyof typeof groupTitles];
                const allEnabled = routes.every((r) => permissions[r.route_key]);
                const someEnabled = routes.some((r) => permissions[r.route_key]);
                const enabledCount = routes.filter((r) => permissions[r.route_key]).length;

                return (
                  <Card key={groupKey} className={cn(
                    "border-2 transition-all duration-300",
                    groupStyles[groupKey as keyof typeof groupStyles]
                  )}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{groupTitle}</CardTitle>
                          <Badge variant="outline" className="font-mono text-xs">
                            {enabledCount}/{routes.length}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleGroup(groupKey, true)}
                            disabled={allEnabled}
                            className="h-8 text-xs"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Alla
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleGroup(groupKey, false)}
                            disabled={!someEnabled}
                            className="h-8 text-xs"
                          >
                            Inga
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-2">
                      {routes.map((route) => (
                        <div 
                          key={route.route_key} 
                          className={cn(
                            "flex items-center space-x-3 p-2 rounded-lg transition-colors",
                            permissions[route.route_key] 
                              ? "bg-primary/5 border border-primary/10" 
                              : "hover:bg-muted/50"
                          )}
                        >
                          <Checkbox
                            id={route.route_key}
                            checked={permissions[route.route_key]}
                            onCheckedChange={() => handleTogglePermission(route.route_key)}
                          />
                          <Label
                            htmlFor={route.route_key}
                            className="text-sm font-normal cursor-pointer flex-1"
                          >
                            {route.route_title}
                          </Label>
                          {permissions[route.route_key] && (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <Separator className="my-4" />

        <div className="flex justify-between pt-2">
          <Button 
            variant="outline" 
            onClick={handleResetToDefault}
            className="hover:bg-primary/5 transition-colors"
          >
            Återställ till standard
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="hover:bg-primary/5 transition-colors"
            >
              Avbryt
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="min-w-[100px]"
            >
              {saving ? 'Sparar...' : 'Spara'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
