import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, UserPlus, Mail, Shield, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useOrganizationRole } from "@/hooks/useOrganizationRole";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TeamMember {
  id: string;
  email: string;
  role: string;
  status: string;
  joined_at: string | null;
  invited_at: string;
}

export function TeamSettings() {
  const { user } = useAuth();
  const { organizationId, canManageTeam } = useOrganizationRole();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");

  useEffect(() => {
    if (organizationId) {
      fetchTeamMembers();
    } else {
      setLoading(false);
    }
  }, [organizationId]);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("organization_id", organizationId)
        .order("invited_at", { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("Kunde inte hämta teammedlemmar");
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail || !organizationId) return;

    try {
      const { error } = await supabase.from("team_members").insert({
        organization_id: organizationId,
        email: inviteEmail,
        role: inviteRole,
        invited_by: user?.id,
      });

      if (error) throw error;

      toast.success("Inbjudan skickad!");
      setInviteEmail("");
      setInviteRole("viewer");
      fetchTeamMembers();
    } catch (error) {
      console.error("Error inviting member:", error);
      toast.error("Kunde inte skicka inbjudan");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", memberId);

      if (error) throw error;

      toast.success("Medlem borttagen");
      fetchTeamMembers();
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Kunde inte ta bort medlem");
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "owner":
        return "default";
      case "admin":
        return "secondary";
      case "editor":
        return "outline";
      default:
        return "outline";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "owner":
        return "Ägare";
      case "admin":
        return "Admin";
      case "editor":
        return "Redigerare";
      case "viewer":
        return "Tittare";
      default:
        return role;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge variant="default" className="text-xs">Aktiv</Badge>
    ) : (
      <Badge variant="secondary" className="text-xs">Inbjuden</Badge>
    );
  };

  if (!organizationId) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">Ingen organisation</p>
          <p className="text-sm text-muted-foreground">
            Du behöver vara del av en organisation för att hantera team
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {canManageTeam && (
        <Card className="hover-scale transition-all">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <UserPlus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Bjud in Teammedlem</CardTitle>
                <CardDescription>
                  Lägg till nya medlemmar till din organisation
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="invite-email">E-postadress</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="namn@företag.se"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-role">Roll</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger id="invite-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Redigerare</SelectItem>
                    <SelectItem value="viewer">Tittare</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleInvite} className="mt-4">
              <UserPlus className="h-4 w-4 mr-2" />
              Skicka Inbjudan
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="hover-scale transition-all" style={{ animationDelay: canManageTeam ? '100ms' : '0ms' }}>
        <CardHeader className="animate-scale-in">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Teammedlemmar</CardTitle>
              <CardDescription>
                {members.length} {members.length === 1 ? "medlem" : "medlemmar"} i din organisation
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border rounded-lg animate-scale-in hover-scale transition-all"
                style={{ animationDelay: `${members.indexOf(member) * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted rounded-full">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{member.email}</p>
                      {getStatusBadge(member.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {member.status === "active"
                        ? `Gick med ${new Date(member.joined_at!).toLocaleDateString("sv-SE")}`
                        : `Inbjuden ${new Date(member.invited_at).toLocaleDateString("sv-SE")}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getRoleBadgeVariant(member.role)}>
                    <Shield className="h-3 w-3 mr-1" />
                    {getRoleLabel(member.role)}
                  </Badge>
                  {canManageTeam && member.role !== "owner" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
