import { useState, useEffect } from "react";
import { PremiumCard, PremiumCardContent, PremiumCardDescription, PremiumCardHeader, PremiumCardTitle } from "@/components/ui/premium-card";
import { PremiumTelephonyStatCard } from "@/components/telephony/PremiumTelephonyStatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Save, Users, DollarSign, TrendingUp, Calendar, UserPlus, Mail, Shield, Trash2, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { useOrganizationRole } from "@/hooks/useOrganizationRole";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ROISettings } from "./ROISettings";

interface TeamMember {
  id: string;
  user_id?: string;
  email: string;
  role: string;
  status: string;
  joined_at: string | null;
  invited_at: string;
}

export function CompanyTeamSection() {
  const { user } = useAuth();
  const { organization, isLoading: orgLoading, createOrganization, updateOrganization, isCreating, isUpdating } = useOrganization();
  const { organizationId, canManageTeam } = useOrganizationRole();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");
  const [formData, setFormData] = useState({
    name: organization?.name || '',
  });

  useEffect(() => {
    if (organization) {
      setFormData({ name: organization.name });
    }
  }, [organization]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (organization) {
      updateOrganization({ name: formData.name });
    } else {
      createOrganization(formData.name);
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

  if (orgLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Company Statistics */}
      {organization && (
        <div className="grid gap-4 md:grid-cols-3">
          <PremiumTelephonyStatCard
            title="Antal Medlemmar"
            value={members.length}
            icon={Users}
            color="text-blue-600"
            subtitle="Aktiva användare"
          />
          <PremiumTelephonyStatCard
            title="Plan"
            value={organization.plan_type.toUpperCase()}
            icon={TrendingUp}
            color="text-purple-600"
            subtitle="Nuvarande abonnemang"
          />
          <PremiumTelephonyStatCard
            title="Medlem Sedan"
            value={new Date(organization.created_at).toLocaleDateString('sv-SE', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
            icon={Calendar}
            color="text-green-600"
            subtitle="Registreringsdatum"
          />
        </div>
      )}

      {/* Company Information Form */}
      <form onSubmit={handleSubmit}>
        <PremiumCard className="hover-scale transition-all">
          <PremiumCardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <PremiumCardTitle>Företagsinformation</PremiumCardTitle>
                <PremiumCardDescription>
                  Grundläggande information om ditt företag
                </PremiumCardDescription>
              </div>
            </div>
          </PremiumCardHeader>
          <PremiumCardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Företagsnamn</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ange företagsnamn"
                  required
                  className="text-lg"
                />
              </div>

              {organization && (
                <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Plan</Label>
                    <div>
                      <Badge variant="secondary" className="text-sm px-3 py-1">
                        {organization.plan_type.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      Max antal medlemmar
                    </Label>
                    <div className="text-2xl font-bold">
                      {organization.max_members}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              disabled={isCreating || isUpdating || !formData.name}
              className="w-full sm:w-auto"
            >
              <Save className="h-4 w-4 mr-2" />
              {organization ? 'Spara ändringar' : 'Skapa företag'}
            </Button>
          </PremiumCardContent>
        </PremiumCard>
      </form>

      {/* ROI Settings */}
      {organization && <ROISettings />}

      {/* Team Management */}
      {organizationId && (
        <>
          {canManageTeam && (
            <PremiumCard className="hover-scale transition-all">
              <PremiumCardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <UserPlus className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <PremiumCardTitle>Bjud in Teammedlem</PremiumCardTitle>
                    <PremiumCardDescription>
                      Lägg till nya medlemmar till din organisation
                    </PremiumCardDescription>
                  </div>
                </div>
              </PremiumCardHeader>
              <PremiumCardContent>
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
              </PremiumCardContent>
            </PremiumCard>
          )}

          {/* Team Members - Visual cards */}
          <PremiumCard className="hover-scale transition-all">
            <PremiumCardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <PremiumCardTitle>Teammedlemmar</PremiumCardTitle>
                  <PremiumCardDescription>
                    {members.length} {members.length === 1 ? "medlem" : "medlemmar"} i din organisation
                  </PremiumCardDescription>
                </div>
              </div>
            </PremiumCardHeader>
            <PremiumCardContent>
              {members.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">Inga teammedlemmar ännu</p>
                  <p className="text-sm text-muted-foreground">
                    Bjud in ditt första teammedlem för att komma igång
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="p-4 text-center hover:shadow-lg transition-all border rounded-lg bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md hover:border-primary/30"
                    >
                      <Avatar className="h-16 w-16 mx-auto mb-2">
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5">
                          <User className="h-6 w-6 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-medium text-sm truncate" title={member.email}>
                        {member.email.split('@')[0]}
                      </p>
                      <p className="text-xs text-muted-foreground truncate" title={member.email}>
                        {member.email}
                      </p>
                      <div className="mt-2 flex flex-col gap-1">
                        <Badge variant={getRoleBadgeVariant(member.role)} className="text-xs">
                          {getRoleLabel(member.role)}
                        </Badge>
                        {getStatusBadge(member.status)}
                      </div>
                      {canManageTeam && member.role !== "owner" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                          className="mt-2 w-full"
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </PremiumCardContent>
          </PremiumCard>
        </>
      )}

      {!organization && !organizationId && (
        <PremiumCard className="border-blue-200 bg-gradient-to-br from-blue-50/50 to-blue-100/30">
          <PremiumCardHeader>
            <PremiumCardTitle className="text-blue-900">Välkommen!</PremiumCardTitle>
            <PremiumCardDescription className="text-blue-700">
              Skapa ditt företag för att komma igång med att hantera bokningar, meddelanden och team.
            </PremiumCardDescription>
          </PremiumCardHeader>
        </PremiumCard>
      )}
    </div>
  );
}
