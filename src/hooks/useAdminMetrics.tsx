import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { queryKeys } from '@/lib/queryKeys';

interface User {
  user_id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  role: 'admin' | 'client';
  active_permissions_count: number;
}

export const useAdminMetrics = (dateRange?: { from: Date; to: Date }) => {
  const queryClient = useQueryClient();
  
  const { data: metrics, isLoading, refetch } = useQuery({
    queryKey: queryKeys.admin.metrics(dateRange),
    staleTime: 30000, // 30 seconds
    queryFn: async () => {
      // Fetch all users with their roles and permissions
      const { data: users, error } = await supabase.rpc('get_admin_user_overview');
      
      if (error) throw error;

      const typedUsers = users as User[];
      
      // Filter by date range if provided
      let filteredUsers = typedUsers;
      if (dateRange) {
        filteredUsers = typedUsers.filter(user => {
          const createdAt = new Date(user.created_at);
          return createdAt >= dateRange.from && createdAt <= dateRange.to;
        });
      }

      // Calculate current date boundaries
      const now = new Date();
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      // Calculate statistics
      const totalUsers = typedUsers.length;
      const adminCount = typedUsers.filter(u => u.role === 'admin').length;
      const clientCount = typedUsers.filter(u => u.role === 'client').length;
      const customPermissions = typedUsers.filter(u => u.active_permissions_count > 0).length;

      // Activity metrics
      const activeUsers = typedUsers.filter(u => {
        if (!u.last_sign_in_at) return false;
        const lastSignIn = new Date(u.last_sign_in_at);
        return lastSignIn >= last30Days;
      }).length;

      // New users metrics
      const newUsersThisWeek = typedUsers.filter(u => {
        const createdAt = new Date(u.created_at);
        return createdAt >= last7Days;
      }).length;

      const newUsersThisMonth = typedUsers.filter(u => {
        const createdAt = new Date(u.created_at);
        return createdAt >= thisMonthStart;
      }).length;

      const newUsersLastMonth = typedUsers.filter(u => {
        const createdAt = new Date(u.created_at);
        return createdAt >= lastMonth && createdAt < thisMonthStart;
      }).length;

      // Calculate trends
      const newUsersTrend = newUsersLastMonth > 0
        ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100
        : 0;

      const activeUsersTrend = totalUsers > 0
        ? ((activeUsers / totalUsers) * 100) - 50 // Compare to 50% baseline
        : 0;

      // Group users by date for chart data
      const usersByDate = typedUsers.reduce((acc, user) => {
        const date = new Date(user.created_at).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { total: 0, admins: 0, clients: 0 };
        }
        acc[date].total++;
        if (user.role === 'admin') acc[date].admins++;
        if (user.role === 'client') acc[date].clients++;
        return acc;
      }, {} as Record<string, { total: number; admins: number; clients: number }>);

      // Activity by day of week and hour
      const activityByTime = typedUsers.reduce((acc, user) => {
        if (!user.last_sign_in_at) return acc;
        const date = new Date(user.last_sign_in_at);
        const dayOfWeek = date.getDay();
        const hour = date.getHours();
        
        if (!acc[dayOfWeek]) acc[dayOfWeek] = {};
        acc[dayOfWeek][hour] = (acc[dayOfWeek][hour] || 0) + 1;
        
        return acc;
      }, {} as Record<number, Record<number, number>>);

      return {
        users: typedUsers,
        totalUsers,
        adminCount,
        clientCount,
        customPermissions,
        activeUsers,
        newUsersThisWeek,
        newUsersThisMonth,
        newUsersTrend,
        activeUsersTrend,
        usersByDate,
        activityByTime,
      };
    },
  });

  // Real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('admin_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_roles',
        },
        () => {
          console.log('🔔 User roles updated');
          refetch();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sidebar_permissions',
        },
        () => {
          console.log('🔔 Permissions updated');
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return {
    metrics: metrics || {
      users: [],
      totalUsers: 0,
      adminCount: 0,
      clientCount: 0,
      customPermissions: 0,
      activeUsers: 0,
      newUsersThisWeek: 0,
      newUsersThisMonth: 0,
      newUsersTrend: 0,
      activeUsersTrend: 0,
      usersByDate: {},
      activityByTime: {},
    },
    isLoading,
    refetch,
  };
};
