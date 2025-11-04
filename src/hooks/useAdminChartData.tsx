import { useMemo } from 'react';
import { format, subDays, eachDayOfInterval } from 'date-fns';

interface User {
  user_id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  role: 'admin' | 'client';
  active_permissions_count: number;
}

export interface AdminChartData {
  userGrowth: Array<{
    date: string;
    newUsers: number;
    cumulative: number;
    admins: number;
    clients: number;
  }>;
  roleDistribution: Array<{
    date: string;
    admins: number;
    clients: number;
  }>;
  activityHeatmap: Array<{
    day: string;
    hour: number;
    value: number;
  }>;
  permissionsAnalysis: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  lifecycle: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  loginActivity: Array<{
    date: string;
    activeUsers: number;
    movingAverage: number;
  }>;
}

export const useAdminChartData = (users: User[]): AdminChartData => {
  return useMemo(() => {
    if (!users || users.length === 0) {
      return {
        userGrowth: [],
        roleDistribution: [],
        activityHeatmap: [],
        permissionsAnalysis: [],
        lifecycle: [],
        loginActivity: [],
      };
    }

    const now = new Date();
    const last30Days = subDays(now, 30);
    const dateRange = eachDayOfInterval({ start: last30Days, end: now });

    // 1. User Growth Chart
    const usersByDate = users.reduce((acc, user) => {
      const date = format(new Date(user.created_at), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = { total: 0, admins: 0, clients: 0 };
      }
      acc[date].total++;
      if (user.role === 'admin') acc[date].admins++;
      if (user.role === 'client') acc[date].clients++;
      return acc;
    }, {} as Record<string, { total: number; admins: number; clients: number }>);

    let cumulative = 0;
    const userGrowth = dateRange.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayData = usersByDate[dateStr] || { total: 0, admins: 0, clients: 0 };
      cumulative += dayData.total;
      
      return {
        date: format(date, 'MMM dd'),
        newUsers: dayData.total,
        cumulative,
        admins: dayData.admins,
        clients: dayData.clients,
      };
    });

    // 2. Role Distribution Over Time
    const roleDistribution = dateRange.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const usersUntilDate = users.filter(u => new Date(u.created_at) <= date);
      
      return {
        date: format(date, 'MMM dd'),
        admins: usersUntilDate.filter(u => u.role === 'admin').length,
        clients: usersUntilDate.filter(u => u.role === 'client').length,
      };
    });

    // 3. Activity Heatmap (day of week x hour)
    const days = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'];
    const activityHeatmap: Array<{ day: string; hour: number; value: number }> = [];
    
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const count = users.filter(u => {
          if (!u.last_sign_in_at) return false;
          const date = new Date(u.last_sign_in_at);
          return date.getDay() === day && date.getHours() === hour;
        }).length;
        
        activityHeatmap.push({
          day: days[day],
          hour,
          value: count,
        });
      }
    }

    // 4. Permissions Analysis
    const withCustomPerms = users.filter(u => u.active_permissions_count > 0).length;
    const withDefaultPerms = users.length - withCustomPerms;
    
    const permissionsAnalysis = [
      {
        name: 'Standard rättigheter',
        value: withDefaultPerms,
        percentage: (withDefaultPerms / users.length) * 100,
      },
      {
        name: 'Anpassade rättigheter',
        value: withCustomPerms,
        percentage: (withCustomPerms / users.length) * 100,
      },
    ];

    // 5. User Lifecycle
    const last7DaysLifecycle = subDays(now, 7);
    const last30DaysLifecycle = subDays(now, 30);
    
    const newUsers = users.filter(u => new Date(u.created_at) >= last7DaysLifecycle).length;
    const activeUsers = users.filter(u => {
      if (!u.last_sign_in_at) return false;
      return new Date(u.last_sign_in_at) >= last30DaysLifecycle;
    }).length;
    const inactiveUsers = users.filter(u => {
      if (!u.last_sign_in_at) return true;
      return new Date(u.last_sign_in_at) < last30DaysLifecycle;
    }).length;
    
    const lifecycle = [
      { name: 'Nya (7 dagar)', value: newUsers, color: 'hsl(var(--chart-1))' },
      { name: 'Aktiva (30 dagar)', value: activeUsers, color: 'hsl(var(--chart-2))' },
      { name: 'Inaktiva', value: inactiveUsers, color: 'hsl(var(--chart-3))' },
    ];

    // 6. Login Activity Trend
    const loginActivity = dateRange.map((date, index) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const activeOnDate = users.filter(u => {
        if (!u.last_sign_in_at) return false;
        const loginDate = format(new Date(u.last_sign_in_at), 'yyyy-MM-dd');
        return loginDate === dateStr;
      }).length;
      
      // Calculate 7-day moving average
      const windowStart = Math.max(0, index - 6);
      const windowDates = dateRange.slice(windowStart, index + 1);
      const movingAverage = windowDates.reduce((sum, d) => {
        const dStr = format(d, 'yyyy-MM-dd');
        const count = users.filter(u => {
          if (!u.last_sign_in_at) return false;
          return format(new Date(u.last_sign_in_at), 'yyyy-MM-dd') === dStr;
        }).length;
        return sum + count;
      }, 0) / windowDates.length;
      
      return {
        date: format(date, 'MMM dd'),
        activeUsers: activeOnDate,
        movingAverage: Math.round(movingAverage * 10) / 10,
      };
    });

    return {
      userGrowth,
      roleDistribution,
      activityHeatmap,
      permissionsAnalysis,
      lifecycle,
      loginActivity,
    };
  }, [users]);
};
