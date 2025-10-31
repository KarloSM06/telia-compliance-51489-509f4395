import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { useBusinessMetrics } from "./useBusinessMetrics";
import { supabase } from "@/integrations/supabase/client";
import { 
  calculateBookingRevenue, 
  calculateOperationalCosts, 
  calculateROI,
  type BookingRevenue,
  type OperationalCosts,
  type ROIMetrics 
} from "@/lib/roiCalculations";
import { format, startOfDay, endOfDay, subDays } from "date-fns";

export interface AnalyticsData {
  bookings: any[];
  messages: any[];
  telephony: any[];
  reviews: any[];
  bookingRevenues: BookingRevenue[];
  costs: OperationalCosts;
  roi: ROIMetrics;
  dailyData: any[];
  weeklyData: any[];
}

export const useAnalyticsData = (dateRange?: { from: Date; to: Date }) => {
  const { user } = useAuth();
  const { metrics: businessMetrics } = useBusinessMetrics();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id || !businessMetrics) {
      setLoading(false);
      return;
    }

    const fetchAllData = async () => {
      setLoading(true);
      
      const from = dateRange?.from || subDays(new Date(), 30);
      const to = dateRange?.to || new Date();
      
      const fromStr = startOfDay(from).toISOString();
      const toStr = endOfDay(to).toISOString();

      try {
        // Fetch all data in parallel
        const [bookingsRes, messagesRes, telephonyRes, reviewsRes] = await Promise.all([
          supabase
            .from("calendar_events")
            .select("*")
            .eq("user_id", user.id)
            .gte("start_time", fromStr)
            .lte("start_time", toStr)
            .order("start_time", { ascending: true }),
          
          supabase
            .from("message_logs")
            .select("*")
            .eq("user_id", user.id)
            .gte("created_at", fromStr)
            .lte("created_at", toStr),
          
          supabase
            .from("telephony_events")
            .select("*")
            .eq("user_id", user.id)
            .gte("event_timestamp", fromStr)
            .lte("event_timestamp", toStr),
          
          supabase
            .from("reviews")
            .select("*")
            .eq("user_id", user.id)
            .gte("created_at", fromStr)
            .lte("created_at", toStr)
        ]);

        const bookings = bookingsRes.data || [];
        const messages = messagesRes.data || [];
        const telephony = telephonyRes.data || [];
        const reviews = reviewsRes.data || [];

        // Calculate ROI
        const bookingRevenues = bookings.map(b => 
          calculateBookingRevenue(b, businessMetrics)
        );
        
        const costs = calculateOperationalCosts(telephony, messages);
        const roi = calculateROI(bookingRevenues, costs);

        // Aggregate daily data
        const dailyMap = new Map();
        
        bookings.forEach(b => {
          const day = format(new Date(b.start_time), 'yyyy-MM-dd');
          if (!dailyMap.has(day)) {
            dailyMap.set(day, { date: day, bookings: 0, revenue: 0, costs: 0 });
          }
          const dayData = dailyMap.get(day);
          dayData.bookings += 1;
          const revenue = bookingRevenues.find(br => br.bookingId === b.id);
          if (revenue) dayData.revenue += revenue.estimatedRevenue;
        });

        messages.forEach(m => {
          const day = format(new Date(m.created_at), 'yyyy-MM-dd');
          if (!dailyMap.has(day)) {
            dailyMap.set(day, { date: day, bookings: 0, revenue: 0, costs: 0 });
          }
          const dayData = dailyMap.get(day);
          dayData.costs += parseFloat(String(m.cost || 0));
        });

        telephony.forEach(t => {
          const day = format(new Date(t.event_timestamp), 'yyyy-MM-dd');
          if (!dailyMap.has(day)) {
            dailyMap.set(day, { date: day, bookings: 0, revenue: 0, costs: 0 });
          }
          const dayData = dailyMap.get(day);
          dayData.costs += parseFloat(String(t.cost_amount || 0));
        });

        const dailyData = Array.from(dailyMap.values()).map(d => ({
          ...d,
          profit: d.revenue - d.costs,
          roi: d.costs > 0 ? ((d.revenue - d.costs) / d.costs) * 100 : 0
        }));

        setData({
          bookings,
          messages,
          telephony,
          reviews,
          bookingRevenues,
          costs,
          roi,
          dailyData,
          weeklyData: [] // TODO: Implement weekly aggregation if needed
        });
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user?.id, businessMetrics, dateRange]);

  return { data, loading };
};
