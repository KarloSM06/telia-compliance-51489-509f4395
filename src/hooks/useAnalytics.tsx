import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { format, subDays, eachDayOfInterval } from "date-fns";

export interface AnalyticsData {
  calls: {
    total: number;
    byDay: { date: string; count: number; duration: number }[];
  };
  bookings: {
    total: number;
    byDay: { date: string; count: number }[];
    byWeekday: { day: string; count: number }[];
  };
  messages: {
    total: number;
    byDay: { date: string; count: number }[];
  };
  callAnalysis: {
    averageScore: number;
    totalAnalyzed: number;
    scoreDistribution: { range: string; count: number }[];
  };
}

export const useAnalytics = (dateRange?: { from: Date; to: Date }) => {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Default to last 30 days - use useMemo to prevent infinite loop
  const range = useMemo(() => {
    if (dateRange) {
      return dateRange;
    }
    return {
      from: subDays(new Date(), 30),
      to: new Date(),
    };
  }, [dateRange]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchAnalytics();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, range.from.getTime(), range.to.getTime()]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch calls data
      const { data: calls, error: callsError } = await supabase
        .from("calls")
        .select("*")
        .gte("created_at", range.from.toISOString())
        .lte("created_at", range.to.toISOString())
        .order("created_at", { ascending: true });

      if (callsError) throw callsError;

      // Fetch call history
      const { data: callHistory, error: historyError } = await supabase
        .from("call_history")
        .select("*")
        .gte("created_at", range.from.toISOString())
        .lte("created_at", range.to.toISOString())
        .order("created_at", { ascending: true });

      if (historyError) throw historyError;

      // Fetch bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from("bookings")
        .select("*")
        .gte("created_at", range.from.toISOString())
        .lte("created_at", range.to.toISOString())
        .order("created_at", { ascending: true });

      if (bookingsError) throw bookingsError;

      // Fetch messages
      const { data: messages, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .gte("created_at", range.from.toISOString())
        .lte("created_at", range.to.toISOString())
        .order("created_at", { ascending: true });

      if (messagesError) throw messagesError;

      // Process data
      const allDays = eachDayOfInterval({ start: range.from, end: range.to });
      
      // Calls by day
      const callsByDay = allDays.map(day => {
        const dayStr = format(day, "yyyy-MM-dd");
        const dayCalls = (calls || []).filter(
          call => format(new Date(call.created_at), "yyyy-MM-dd") === dayStr
        );
        const dayHistory = (callHistory || []).filter(
          call => format(new Date(call.created_at), "yyyy-MM-dd") === dayStr
        );
        
        const totalDuration = dayHistory.reduce((sum, call) => {
          const duration = call.duration ? (typeof call.duration === 'number' ? call.duration : parseFloat(call.duration)) : 0;
          return sum + duration;
        }, 0);

        return {
          date: format(day, "d MMM"),
          count: dayCalls.length + dayHistory.length,
          duration: totalDuration,
        };
      });

      // Bookings by day
      const bookingsByDay = allDays.map(day => {
        const dayStr = format(day, "yyyy-MM-dd");
        const dayBookings = (bookings || []).filter(
          booking => format(new Date(booking.created_at), "yyyy-MM-dd") === dayStr
        );
        return {
          date: format(day, "d MMM"),
          count: dayBookings.length,
        };
      });

      // Bookings by weekday
      const weekdayMap = new Map<number, number>();
      (bookings || []).forEach(booking => {
        const weekday = new Date(booking.created_at).getDay();
        weekdayMap.set(weekday, (weekdayMap.get(weekday) || 0) + 1);
      });

      const weekdayNames = ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"];
      const bookingsByWeekday = Array.from({ length: 7 }, (_, i) => ({
        day: weekdayNames[i],
        count: weekdayMap.get(i) || 0,
      }));

      // Messages by day
      const messagesByDay = allDays.map(day => {
        const dayStr = format(day, "yyyy-MM-dd");
        const dayMessages = (messages || []).filter(
          msg => format(new Date(msg.created_at), "yyyy-MM-dd") === dayStr
        );
        return {
          date: format(day, "d MMM"),
          count: dayMessages.length,
        };
      });

      // Call analysis statistics
      const analyzedCalls = (calls || []).filter(call => call.score !== null);
      const averageScore = analyzedCalls.length > 0
        ? analyzedCalls.reduce((sum, call) => sum + (Number(call.score) || 0), 0) / analyzedCalls.length
        : 0;

      // Score distribution
      const scoreRanges = [
        { range: "0-20", min: 0, max: 20 },
        { range: "21-40", min: 21, max: 40 },
        { range: "41-60", min: 41, max: 60 },
        { range: "61-80", min: 61, max: 80 },
        { range: "81-100", min: 81, max: 100 },
      ];

      const scoreDistribution = scoreRanges.map(({ range, min, max }) => ({
        range,
        count: analyzedCalls.filter(
          call => Number(call.score) >= min && Number(call.score) <= max
        ).length,
      }));

      setData({
        calls: {
          total: (calls?.length || 0) + (callHistory?.length || 0),
          byDay: callsByDay,
        },
        bookings: {
          total: bookings?.length || 0,
          byDay: bookingsByDay,
          byWeekday: bookingsByWeekday,
        },
        messages: {
          total: messages?.length || 0,
          byDay: messagesByDay,
        },
        callAnalysis: {
          averageScore: Math.round(averageScore * 10) / 10,
          totalAnalyzed: analyzedCalls.length,
          scoreDistribution,
        },
      });

      setError(null);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (filename: string) => {
    if (!data) return;

    const csvData = [
      ["Datum", "Samtal", "Bokningar", "Meddelanden"],
      ...data.calls.byDay.map((day, index) => [
        day.date,
        day.count,
        data.bookings.byDay[index]?.count || 0,
        data.messages.byDay[index]?.count || 0,
      ]),
    ];

    const csvContent = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return {
    data,
    loading,
    error,
    refetch: fetchAnalytics,
    exportToCSV,
  };
};
