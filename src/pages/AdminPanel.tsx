import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserStatsCards } from "@/components/admin/UserStatsCards";
import { UserTable } from "@/components/admin/UserTable";
import { UserFilters } from "@/components/admin/UserFilters";
import { UserPermissionsDialog } from "@/components/admin/UserPermissionsDialog";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import hiemsLogoSnowflake from '@/assets/hiems-logo-snowflake.png';

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
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    permissions: 'all'
  });

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
      const { data, error } = await supabase.rpc('get_admin_user_overview');
      
      if (error) throw error;
      
      const usersWithRoles: User[] = (data || []).map((user: any) => ({
        id: user.user_id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        role: user.role,
        permissions_count: Number(user.active_permissions_count),
      }));

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

  // Filter users based on filters
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!user.email.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Role filter
      if (filters.role !== 'all' && user.role !== filters.role) {
        return false;
      }

      // Permissions filter
      if (filters.permissions !== 'all') {
        if (filters.permissions === 'custom' && user.permissions_count === 11) {
          return false;
        }
        if (filters.permissions === 'default' && user.permissions_count !== 11) {
          return false;
        }
      }

      return true;
    });
  }, [users, filters]);

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
  const usersWithCustomPermissions = users.filter((u) => u.permissions_count !== 11).length;

  return (
    <DashboardLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
          {/* Radial gradient overlays */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />
          
          {/* Snowflakes */}
          <div className="absolute -top-32 -right-32 w-[700px] h-[700px] opacity-5 pointer-events-none">
            <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_60s_linear_infinite]" />
          </div>
          <div className="absolute -top-20 -left-20 w-[450px] h-[450px] opacity-[0.03] pointer-events-none">
            <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_40s_linear_infinite_reverse]" />
          </div>
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[350px] h-[350px] opacity-[0.04] pointer-events-none">
            <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_50s_linear_infinite]" />
          </div>
          <div className="absolute top-1/2 right-1/4 w-[200px] h-[200px] opacity-[0.02] pointer-events-none">
            <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_35s_linear_infinite]" />
          </div>
          <div className="absolute top-1/3 left-1/3 w-[180px] h-[180px] opacity-[0.025] pointer-events-none">
            <img src={hiemsLogoSnowflake} alt="" className="w-full h-full object-contain animate-[spin_45s_linear_infinite_reverse]" />
          </div>

          <div className="container mx-auto px-6 lg:px-8 relative z-10">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto text-center space-y-6">
                {/* UPPERCASE label med accent line */}
                <div className="inline-block">
                  <span className="text-sm font-semibold tracking-wider text-primary uppercase">
                    Användarhantering
                  </span>
                  <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50 mt-2" />
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                
                <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                  Hantera användare och konfigurera rättigheter
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Quick Actions Bar */}
        <section className="relative py-8 border-y border-primary/10">
          {/* Gradient accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <div className="container mx-auto px-6 lg:px-8">
            <AnimatedSection delay={100}>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
                    <ShieldCheck className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
                      Admin Access
                    </span>
                  </div>
                  <Badge variant="outline">
                    {filteredUsers.length} av {totalUsers} användare
                  </Badge>
                </div>
                
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Stats Cards */}
        <UserStatsCards
          totalUsers={totalUsers}
          adminCount={adminCount}
          clientCount={clientCount}
          usersWithCustomPermissions={usersWithCustomPermissions}
        />

        {/* Filters */}
        <div className="container mx-auto px-6 lg:px-8 mb-6">
          <UserFilters filters={filters} onFilterChange={setFilters} />
        </div>

        {/* User Table */}
        <UserTable 
          users={filteredUsers}
          onEditPermissions={handleEditPermissions}
          loading={loading}
        />

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
