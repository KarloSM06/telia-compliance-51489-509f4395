import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHiemsAdmin } from '@/hooks/useHiemsAdmin';
import { useAuth } from '@/hooks/useAuth';
import { useAdminMetrics } from '@/hooks/useAdminMetrics';
import { useAdminChartData } from '@/hooks/useAdminChartData';
import { Badge } from '@/components/ui/badge';
import { UserStatsCards } from '@/components/admin/UserStatsCards';
import { UserFilters } from '@/components/admin/UserFilters';
import { UserTable } from '@/components/admin/UserTable';
import { UserPermissionsDialog } from '@/components/admin/UserPermissionsDialog';
import { UserGrowthChart } from '@/components/admin/charts/UserGrowthChart';
import { RoleDistributionChart } from '@/components/admin/charts/RoleDistributionChart';
import { ActivityHeatmapChart } from '@/components/admin/charts/ActivityHeatmapChart';
import { PermissionsAnalysisChart } from '@/components/admin/charts/PermissionsAnalysisChart';
import { UserLifecycleChart } from '@/components/admin/charts/UserLifecycleChart';
import { LoginActivityTrendChart } from '@/components/admin/charts/LoginActivityTrendChart';
import { toast } from 'sonner';
import { ShieldCheck, BarChart3, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
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
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isHiemsAdmin, loading: adminLoading } = useHiemsAdmin();
  
  const { metrics, isLoading, refetch } = useAdminMetrics();
  const chartData = useAdminChartData(metrics.users);
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    permissions: 'all',
  });

  // Convert metrics.users to the User format expected by components
  const users: User[] = useMemo(() => {
    return metrics.users.map(u => ({
      id: u.user_id,
      email: u.email,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
      role: u.role,
      permissions_count: u.active_permissions_count,
    }));
  }, [metrics.users]);

  const handleEditPermissions = (user: User) => {
    setSelectedUser(user);
    setPermissionsDialogOpen(true);
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Data uppdaterad');
  };

  const handleExport = () => {
    const csvContent = [
      ['Email', 'Roll', 'Rättigheter', 'Senast Inloggad', 'Skapad'].join(','),
      ...filteredUsers.map((user) =>
        [
          user.email,
          user.role,
          user.permissions_count,
          user.last_sign_in_at || 'Aldrig',
          user.created_at,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `användare-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Export klar');
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
        if (filters.permissions === 'custom' && user.permissions_count === 0) {
          return false;
        }
        if (filters.permissions === 'default' && user.permissions_count !== 0) {
          return false;
        }
      }

      return true;
    });
  }, [users, filters]);

  // Show loading while checking admin status
  if (adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Redirect if not admin
  if (!isHiemsAdmin) {
    toast.error('Åtkomst nekad', {
      description: 'Du har inte behörighet att se denna sida.',
    });
    navigate('/dashboard');
    return null;
  }

  return (
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
                  {filteredUsers.length} av {metrics.totalUsers} användare
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleRefresh} variant="outline" size="sm">
                  Uppdatera
                </Button>
                <Button onClick={handleExport} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportera
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats Cards */}
      <UserStatsCards
        totalUsers={metrics.totalUsers}
        adminCount={metrics.adminCount}
        clientCount={metrics.clientCount}
        usersWithCustomPermissions={metrics.customPermissions}
        activeUsers={metrics.activeUsers}
        newUsersThisWeek={metrics.newUsersThisWeek}
        activeUsersTrend={metrics.activeUsersTrend}
        newUsersTrend={metrics.newUsersTrend}
      />

      {/* Statistics & Analysis Section */}
      <section className="relative py-12 bg-gradient-to-b from-background via-primary/2 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,hsl(var(--primary)/0.08),transparent_50%)]" />
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Statistik & Analys</h2>
          </div>
          
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mb-6">
            <UserGrowthChart data={chartData.userGrowth} />
            <RoleDistributionChart data={chartData.roleDistribution} />
          </div>
          
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mb-6">
            <LoginActivityTrendChart data={chartData.loginActivity} />
            <PermissionsAnalysisChart data={chartData.permissionsAnalysis} />
          </div>
          
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mb-6">
            <UserLifecycleChart data={chartData.lifecycle} />
            <ActivityHeatmapChart data={chartData.activityHeatmap} />
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="container mx-auto px-6 lg:px-8 mb-8">
        <UserFilters filters={filters} onFilterChange={setFilters} />
      </section>

      {/* Users Table */}
      <section className="container mx-auto px-6 lg:px-8 pb-16">
        <UserTable 
          users={filteredUsers} 
          onEditPermissions={handleEditPermissions}
          loading={isLoading}
        />
      </section>

      {selectedUser && (
        <UserPermissionsDialog
          open={permissionsDialogOpen}
          onOpenChange={setPermissionsDialogOpen}
          userId={selectedUser.id}
          userEmail={selectedUser.email}
          userRole={selectedUser.role}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}
