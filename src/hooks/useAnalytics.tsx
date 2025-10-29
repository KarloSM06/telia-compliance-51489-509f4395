import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { format, subDays, eachDayOfInterval } from "date-fns";

export interface AnalyticsData {
  calls: {
    total: number;
    byDay: { date: string; count: number; duration: number }[];
    byWeekday: { day: string; count: number }[];
  };
  bookings: {
    total: number;
    byDay: { date: string; count: number }[];
    byWeekday: { day: string; count: number }[];
  };
  messages: {
    total: number;
    byDay: { date: string; count: number }[];
    byWeekday: { day: string; count: number }[];
  };
  callAnalysis: {
    averageScore: number;
    totalAnalyzed: number;
    scoreDistribution: { range: string; count: number }[];
  };
  telephony: {
    totalCalls: number;
    totalSMS: number;
    totalCost: number;
    totalDuration: number;
    totalEvents: number;
    byProvider: {
      provider: string;
      calls: number;
      sms: number;
      cost: number;
      duration: number;
    }[];
    byDay: { date: string; calls: number; sms: number; cost: number }[];
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

      // Fetch telephony events
      const { data: telephonyEvents, error: telephonyError } = await supabase
        .from("telephony_events")
        .select("*")
        .gte("timestamp", range.from.toISOString())
        .lte("timestamp", range.to.toISOString())
        .order("timestamp", { ascending: true });

      if (telephonyError) console.error("Telephony fetch error:", telephonyError);

      // Process data
      const allDays = eachDayOfInterval({ start: range.from, end: range.to });
      
      // Calls by day with weekday
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

      // Calls by weekday
      const callWeekdayMap = new Map<number, number>();
      [...(calls || []), ...(callHistory || [])].forEach(call => {
        const weekday = new Date(call.created_at).getDay();
        callWeekdayMap.set(weekday, (callWeekdayMap.get(weekday) || 0) + 1);
      });

      const weekdayNames = ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"];
      const callsByWeekday = Array.from({ length: 7 }, (_, i) => ({
        day: weekdayNames[i],
        count: callWeekdayMap.get(i) || 0,
      }));

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

      const bookingsByWeekday = Array.from({ length: 7 }, (_, i) => ({
        day: weekdayNames[i],
        count: weekdayMap.get(i) || 0,
      }));

      // Messages by day and weekday
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

      const messageWeekdayMap = new Map<number, number>();
      (messages || []).forEach(msg => {
        const weekday = new Date(msg.created_at).getDay();
        messageWeekdayMap.set(weekday, (messageWeekdayMap.get(weekday) || 0) + 1);
      });

      const messagesByWeekday = Array.from({ length: 7 }, (_, i) => ({
        day: weekdayNames[i],
        count: messageWeekdayMap.get(i) || 0,
      }));

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

      // Process telephony data
      const telephonyByProvider = (telephonyEvents || []).reduce((acc: any, event: any) => {
        if (!acc[event.provider]) {
          acc[event.provider] = { calls: 0, sms: 0, cost: 0, duration: 0 };
        }
        if (event.event_type === 'call' || event.event_type === 'call.completed') {
          acc[event.provider].calls++;
          acc[event.provider].duration += event.duration_seconds || 0;
        } else if (event.event_type === 'message' || event.event_type?.includes('message')) {
          acc[event.provider].sms++;
        }
        acc[event.provider].cost += parseFloat(event.cost_amount || '0');
        return acc;
      }, {});

      const telephonyByDay = allDays.map(day => {
        const dayStr = format(day, "yyyy-MM-dd");
        const dayEvents = (telephonyEvents || []).filter((e: any) => {
          const eventDate = e.timestamp || e.event_timestamp;
          return eventDate && format(new Date(eventDate), "yyyy-MM-dd") === dayStr;
        });
        return {
          date: format(day, "d MMM"),
          calls: dayEvents.filter((e: any) => e.event_type === 'call' || e.event_type === 'call.completed').length,
          sms: dayEvents.filter((e: any) => e.event_type === 'message' || e.event_type?.includes('message')).length,
          cost: dayEvents.reduce((sum: number, e: any) => sum + parseFloat(e.cost_amount || '0'), 0),
        };
      });

      setData({
        calls: {
          total: (calls?.length || 0) + (callHistory?.length || 0),
          byDay: callsByDay,
          byWeekday: callsByWeekday,
        },
        bookings: {
          total: bookings?.length || 0,
          byDay: bookingsByDay,
          byWeekday: bookingsByWeekday,
        },
        messages: {
          total: messages?.length || 0,
          byDay: messagesByDay,
          byWeekday: messagesByWeekday,
        },
        callAnalysis: {
          averageScore: Math.round(averageScore * 10) / 10,
          totalAnalyzed: analyzedCalls.length,
          scoreDistribution,
        },
        telephony: {
          totalCalls: (telephonyEvents || []).filter((e: any) => e.event_type === 'call' || e.event_type === 'call.completed').length,
          totalSMS: (telephonyEvents || []).filter((e: any) => e.event_type === 'message' || e.event_type?.includes('message')).length,
          totalCost: (telephonyEvents || []).reduce((sum: number, e: any) => sum + parseFloat(e.cost_amount || '0'), 0),
          totalDuration: (telephonyEvents || []).reduce((sum: number, e: any) => sum + (e.duration_seconds || 0), 0),
          totalEvents: (telephonyEvents || []).length,
          byProvider: Object.entries(telephonyByProvider).map(([provider, data]: [string, any]) => ({
            provider,
            ...data,
          })),
          byDay: telephonyByDay,
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
