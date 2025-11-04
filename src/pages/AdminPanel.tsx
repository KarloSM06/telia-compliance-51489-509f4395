import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserStatsCards } from "@/components/admin/UserStatsCards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RoleBadge } from "@/components/admin/RoleBadge";
import { UserPermissionsDialog } from "@/components/admin/UserPermissionsDialog";
import { Settings } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  role: 'admin' | 'client';
  permissions_count: number;
}

export default function AdminPanel() {
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      toast.error("Du har inte behörighet att se denna sida");
      navigate("/dashboard");
    }
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      // Fetch all users from auth.users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

      if (authError) throw authError;

      // Fetch roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Fetch permission counts
      const { data: permCounts, error: permError } = await supabase
        .from('sidebar_permissions')
        .select('user_id, enabled');

      if (permError) throw permError;

      // Combine data
      const usersWithRoles: User[] = authUsers.users.map((user) => {
        const userRole = rolesData?.find((r) => r.user_id === user.id);
        const permissions = permCounts?.filter((p) => p.user_id === user.id && p.enabled) || [];

        return {
          id: user.id,
          email: user.email || '',
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          role: (userRole?.role as 'admin' | 'client') || 'client',
          permissions_count: permissions.length,
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Kunde inte hämta användare');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPermissions = (user: User) => {
    setSelectedUser(user);
    setPermissionsDialogOpen(true);
  };

  if (roleLoading || !isAdmin) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Laddar...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const clientCount = users.filter((u) => u.role === 'client').length;
  const usersWithCustomPermissions = users.filter((u) => u.permissions_count > 0).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Hantera användare och deras behörigheter</p>
        </div>

        <UserStatsCards
          totalUsers={totalUsers}
          adminCount={adminCount}
          clientCount={clientCount}
          usersWithCustomPermissions={usersWithCustomPermissions}
        />

        <Card>
          <CardHeader>
            <CardTitle>Användare</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Roll</TableHead>
                    <TableHead>Aktiva rättigheter</TableHead>
                    <TableHead>Senast inloggad</TableHead>
                    <TableHead className="text-right">Åtgärder</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>
                        <RoleBadge role={user.role} />
                      </TableCell>
                      <TableCell>{user.permissions_count} rättigheter</TableCell>
                      <TableCell>
                        {user.last_sign_in_at
                          ? format(new Date(user.last_sign_in_at), 'PPp', { locale: sv })
                          : 'Aldrig'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPermissions(user)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Redigera rättigheter
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {selectedUser && (
          <UserPermissionsDialog
            open={permissionsDialogOpen}
            onOpenChange={setPermissionsDialogOpen}
            userId={selectedUser.id}
            userEmail={selectedUser.email}
            userRole={selectedUser.role}
            onSuccess={fetchUsers}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
