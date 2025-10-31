import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { useBusinessMetrics } from "./useBusinessMetrics";
import { supabase } from "@/integrations/supabase/client";
import { 
  calculateBookingRevenue, 
  calculateOperationalCosts, 
  calculateROI,
  calculateBreakEven,
  projectROI,
  type BookingRevenue,
  type OperationalCosts,
  type ROIMetrics,
  type BreakEvenMetrics,
  type ProjectionMetrics
} from "@/lib/roiCalculations";
import { format, startOfDay, endOfDay, subDays } from "date-fns";

const USD_TO_SEK = 10.5;

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
  breakEven: BreakEvenMetrics;
  projection12: ProjectionMetrics;
  projection24: ProjectionMetrics;
  projection36: ProjectionMetrics;
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
        // First fetch active telephony integrations
        const { data: integrations } = await supabase
          .from('integrations')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .or('capabilities.cs.{voice},capabilities.cs.{sms}');

        const integrationIds = integrations?.map(i => i.id) || [];

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
          
          integrationIds.length > 0
            ? supabase
                .from("telephony_events")
                .select("*")
                .in('integration_id', integrationIds)
                .gte("event_timestamp", fromStr)
                .lte("event_timestamp", toStr)
            : Promise.resolve({ data: [] }),
          
          supabase
            .from("reviews")
            .select("*")
            .eq("user_id", user.id)
            .gte("created_at", fromStr)
            .lte("created_at", toStr)
        ]);

        const bookings = bookingsRes.data || [];
        const messages = messagesRes.data || [];
        const telephonyRaw = telephonyRes.data || [];
        const reviews = reviewsRes.data || [];

        // Filter to only parent events (same logic as /telephony page)
        const telephony = telephonyRaw.filter(e => 
          !e.parent_event_id && (e.provider_layer === 'agent' || ['vapi', 'retell'].includes(e.provider))
        );

        // Calculate ROI
        const bookingRevenues = bookings.map(b => 
          calculateBookingRevenue(b, businessMetrics)
        );
        
        const costs = calculateOperationalCosts(telephony, messages, businessMetrics, { from, to });
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
          // Use cost_sek from metadata if available, otherwise convert USD to SEK
          const metadata = m.metadata as any;
          const costSEK = metadata?.cost_sek || (parseFloat(String(m.cost || 0)) * USD_TO_SEK);
          dayData.costs += costSEK;
        });

        telephony.forEach(t => {
          const day = format(new Date(t.event_timestamp), 'yyyy-MM-dd');
          if (!dailyMap.has(day)) {
            dailyMap.set(day, { date: day, bookings: 0, revenue: 0, costs: 0 });
          }
          const dayData = dailyMap.get(day);
          // Use aggregate_cost_amount (SEK) if available, otherwise convert cost_amount (USD) to SEK
          const costSEK = t.aggregate_cost_amount || (parseFloat(String(t.cost_amount || 0)) * USD_TO_SEK);
          dayData.costs += costSEK;
        });

        const dailyData = Array.from(dailyMap.values()).map(d => ({
          ...d,
          profit: d.revenue - d.costs,
          roi: d.costs > 0 ? ((d.revenue - d.costs) / d.costs) * 100 : 0
        }));

        // Calculate break-even and projections
        const historicalDays = Math.max(1, Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)));
        const historicalRevenue = roi.totalRevenue;
        
        const breakEven = calculateBreakEven(businessMetrics, historicalRevenue, historicalDays);
        const projection12 = projectROI(12, businessMetrics, historicalRevenue, historicalDays);
        const projection24 = projectROI(24, businessMetrics, historicalRevenue, historicalDays);
        const projection36 = projectROI(36, businessMetrics, historicalRevenue, historicalDays);

        setData({
          bookings,
          messages,
          telephony,
          reviews,
          bookingRevenues,
          costs,
          roi,
          dailyData,
          weeklyData: [],
          breakEven,
          projection12,
          projection24,
          projection36
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
