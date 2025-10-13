import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface DashboardSummary {
  totalCalls: number;
  totalBookings: number;
  totalMessages: number;
  avgQualityScore: number;
  totalMinutesUsed: number;
  lastActivity?: Date;
  callsChange: number;
  bookingsChange: number;
  messagesChange: number;
}

export const useDashboardSummary = () => {
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-summary', user?.id],
    queryFn: async (): Promise<DashboardSummary> => {
      if (!user) throw new Error("User not authenticated");

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      // Fetch calls data (Thor)
      const { data: callsData } = await supabase
        .from('calls')
        .select('created_at, score, duration')
        .eq('user_id', user.id);

      // Fetch call history (Krono)
      const { data: callHistoryData } = await supabase
        .from('call_history')
        .select('created_at, duration');

      // Fetch bookings (Krono + Gastro)
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('created_at');

      // Fetch messages
      const { data: messagesData } = await supabase
        .from('messages')
        .select('created_at');

      // Calculate current period (last 30 days)
      const currentCalls = callsData?.filter(c => 
        new Date(c.created_at) >= thirtyDaysAgo
      ) || [];
      
      const currentCallHistory = callHistoryData?.filter(c => 
        new Date(c.created_at) >= thirtyDaysAgo
      ) || [];

      const currentBookings = bookingsData?.filter(b => 
        new Date(b.created_at) >= thirtyDaysAgo
      ) || [];

      const currentMessages = messagesData?.filter(m => 
        new Date(m.created_at) >= thirtyDaysAgo
      ) || [];

      // Calculate previous period (30-60 days ago)
      const previousCalls = callsData?.filter(c => {
        const date = new Date(c.created_at);
        return date >= sixtyDaysAgo && date < thirtyDaysAgo;
      }) || [];

      const previousCallHistory = callHistoryData?.filter(c => {
        const date = new Date(c.created_at);
        return date >= sixtyDaysAgo && date < thirtyDaysAgo;
      }) || [];

      const previousBookings = bookingsData?.filter(b => {
        const date = new Date(b.created_at);
        return date >= sixtyDaysAgo && date < thirtyDaysAgo;
      }) || [];

      const previousMessages = messagesData?.filter(m => {
        const date = new Date(m.created_at);
        return date >= sixtyDaysAgo && date < thirtyDaysAgo;
      }) || [];

      // Calculate changes
      const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100);
      };

      const totalCallsCurrent = currentCalls.length + currentCallHistory.length;
      const totalCallsPrevious = previousCalls.length + previousCallHistory.length;

      // Calculate average quality score
      const scoresWithValues = currentCalls
        .map(c => c.score)
        .filter((score): score is number => score !== null && score !== undefined);
      
      const avgScore = scoresWithValues.length > 0
        ? scoresWithValues.reduce((sum, score) => sum + score, 0) / scoresWithValues.length
        : 0;

      // Calculate total minutes used
      const totalMinutes = [
        ...currentCalls.map(c => Number(c.duration) || 0),
        ...currentCallHistory.map(c => Number(c.duration) || 0)
      ].reduce((sum, duration) => sum + duration, 0);

      // Find last activity
      const allDates = [
        ...currentCalls.map(c => new Date(c.created_at)),
        ...currentCallHistory.map(c => new Date(c.created_at)),
        ...currentBookings.map(b => new Date(b.created_at)),
        ...currentMessages.map(m => new Date(m.created_at))
      ].filter(date => !isNaN(date.getTime()));

      const lastActivity = allDates.length > 0
        ? new Date(Math.max(...allDates.map(d => d.getTime())))
        : undefined;

      return {
        totalCalls: totalCallsCurrent,
        totalBookings: currentBookings.length,
        totalMessages: currentMessages.length,
        avgQualityScore: Math.round(avgScore * 10) / 10,
        totalMinutesUsed: Math.round(totalMinutes),
        lastActivity,
        callsChange: calculateChange(totalCallsCurrent, totalCallsPrevious),
        bookingsChange: calculateChange(currentBookings.length, previousBookings.length),
        messagesChange: calculateChange(currentMessages.length, previousMessages.length),
      };
    },
    enabled: !!user,
  });

  return {
    summary: data,
    loading: isLoading,
    error,
  };
};
