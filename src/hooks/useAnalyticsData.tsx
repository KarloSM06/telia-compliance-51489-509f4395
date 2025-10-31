import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { useBusinessMetrics } from "./useBusinessMetrics";
import { supabase } from "@/integrations/supabase/client";
import { 
  calculateBookingRevenue, 
  calculateOperationalCosts, 
  calculateROI,
  calculateTrends,
  calculateCumulativeROI,
  type BookingRevenue,
  type OperationalCosts,
  type ROIMetrics,
  type TrendMetrics,
  type CumulativeROIMetrics
} from "@/lib/roiCalculations";
import { format, startOfDay, endOfDay, subDays, differenceInDays } from "date-fns";

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
  trends: TrendMetrics | null;
  cumulativeROI: CumulativeROIMetrics | null;
  previousPeriod?: {
    roi: ROIMetrics;
    costs: OperationalCosts;
    bookings: number;
  };
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
      
      // Calculate previous period for trend comparison
      const periodLength = differenceInDays(to, from);
      const previousFrom = subDays(from, periodLength);
      const previousTo = from;
      const previousFromStr = startOfDay(previousFrom).toISOString();
      const previousToStr = endOfDay(previousTo).toISOString();

      try {
        // First fetch active telephony integrations
        const { data: integrations } = await supabase
          .from('integrations')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .or('capabilities.cs.{voice},capabilities.cs.{sms}');

        const integrationIds = integrations?.map(i => i.id) || [];

        // Fetch current period and previous period data in parallel
        const [
          bookingsRes, 
          messagesRes, 
          telephonyRes, 
          reviewsRes,
          prevBookingsRes,
          prevMessagesRes,
          prevTelephonyRes
        ] = await Promise.all([
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
            .lte("created_at", toStr),
          
          // Previous period data
          supabase
            .from("calendar_events")
            .select("*")
            .eq("user_id", user.id)
            .gte("start_time", previousFromStr)
            .lte("start_time", previousToStr),
          
          supabase
            .from("message_logs")
            .select("*")
            .eq("user_id", user.id)
            .gte("created_at", previousFromStr)
            .lte("created_at", previousToStr),
          
          integrationIds.length > 0
            ? supabase
                .from("telephony_events")
                .select("*")
                .in('integration_id', integrationIds)
                .gte("event_timestamp", previousFromStr)
                .lte("event_timestamp", previousToStr)
            : Promise.resolve({ data: [] })
        ]);

        const bookings = bookingsRes.data || [];
        const messages = messagesRes.data || [];
        const telephonyRaw = telephonyRes.data || [];
        const reviews = reviewsRes.data || [];
        
        const prevBookings = prevBookingsRes.data || [];
        const prevMessages = prevMessagesRes.data || [];
        const prevTelephonyRaw = prevTelephonyRes.data || [];

        // Filter to only parent events (same logic as /telephony page)
        const telephony = telephonyRaw.filter(e => 
          !e.parent_event_id && (e.provider_layer === 'agent' || ['vapi', 'retell'].includes(e.provider))
        );
        
        const prevTelephony = prevTelephonyRaw.filter(e => 
          !e.parent_event_id && (e.provider_layer === 'agent' || ['vapi', 'retell'].includes(e.provider))
        );

        // Calculate current period ROI
        const bookingRevenues = bookings.map(b => 
          calculateBookingRevenue(b, businessMetrics)
        );
        
        const costs = calculateOperationalCosts(telephony, messages, businessMetrics, { from, to });
        const roi = calculateROI(bookingRevenues, costs);
        
        // Calculate previous period ROI
        const prevBookingRevenues = prevBookings.map(b => 
          calculateBookingRevenue(b, businessMetrics)
        );
        
        const prevCosts = calculateOperationalCosts(prevTelephony, prevMessages, businessMetrics, { 
          from: previousFrom, 
          to: previousTo 
        });
        const prevROI = calculateROI(prevBookingRevenues, prevCosts);
        
        // Calculate trends
        const trends = calculateTrends(
          { ...roi, bookingCount: bookings.length },
          { ...prevROI, bookingCount: prevBookings.length }
        );
        
        // Calculate cumulative ROI if integration cost exists
        let cumulativeROI: CumulativeROIMetrics | null = null;
        if (businessMetrics.integration_cost && businessMetrics.integration_start_date) {
          // Need to fetch all data from integration start date to today for cumulative calculation
          const integrationStartStr = startOfDay(new Date(businessMetrics.integration_start_date)).toISOString();
          const todayStr = endOfDay(new Date()).toISOString();
          
          const [allBookingsRes, allMessagesRes, allTelephonyRes] = await Promise.all([
            supabase
              .from("calendar_events")
              .select("*")
              .eq("user_id", user.id)
              .gte("start_time", integrationStartStr)
              .lte("start_time", todayStr)
              .order("start_time", { ascending: true }),
            
            supabase
              .from("message_logs")
              .select("*")
              .eq("user_id", user.id)
              .gte("created_at", integrationStartStr)
              .lte("created_at", todayStr),
            
            integrationIds.length > 0
              ? supabase
                  .from("telephony_events")
                  .select("*")
                  .in('integration_id', integrationIds)
                  .gte("event_timestamp", integrationStartStr)
                  .lte("event_timestamp", todayStr)
              : Promise.resolve({ data: [] })
          ]);
          
          const allBookings = allBookingsRes.data || [];
          const allMessages = allMessagesRes.data || [];
          const allTelephonyRaw = allTelephonyRes.data || [];
          const allTelephony = allTelephonyRaw.filter(e => 
            !e.parent_event_id && (e.provider_layer === 'agent' || ['vapi', 'retell'].includes(e.provider))
          );
          
          // Build daily cumulative data
          const dailyMapCumulative = new Map();
          
          allBookings.forEach(b => {
            const day = format(new Date(b.start_time), 'yyyy-MM-dd');
            if (!dailyMapCumulative.has(day)) {
              dailyMapCumulative.set(day, { date: day, revenue: 0, costs: 0 });
            }
            const dayData = dailyMapCumulative.get(day);
            const revenue = calculateBookingRevenue(b, businessMetrics);
            dayData.revenue += revenue.estimatedRevenue;
          });
          
          allMessages.forEach(m => {
            const day = format(new Date(m.created_at), 'yyyy-MM-dd');
            if (!dailyMapCumulative.has(day)) {
              dailyMapCumulative.set(day, { date: day, revenue: 0, costs: 0 });
            }
            const dayData = dailyMapCumulative.get(day);
            const metadata = m.metadata as any;
            const costSEK = metadata?.cost_sek || (parseFloat(String(m.cost || 0)) * USD_TO_SEK);
            dayData.costs += costSEK;
          });
          
          allTelephony.forEach(t => {
            const day = format(new Date(t.event_timestamp), 'yyyy-MM-dd');
            if (!dailyMapCumulative.has(day)) {
              dailyMapCumulative.set(day, { date: day, revenue: 0, costs: 0 });
            }
            const dayData = dailyMapCumulative.get(day);
            const costSEK = t.aggregate_cost_amount || (parseFloat(String(t.cost_amount || 0)) * USD_TO_SEK);
            dayData.costs += costSEK;
          });
          
          const cumulativeDailyData = Array.from(dailyMapCumulative.values()).sort((a, b) => 
            a.date.localeCompare(b.date)
          );
          
          cumulativeROI = calculateCumulativeROI(
            cumulativeDailyData,
            businessMetrics.integration_cost,
            new Date(businessMetrics.integration_start_date)
          );
        }

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
          trends,
          cumulativeROI,
          previousPeriod: {
            roi: prevROI,
            costs: prevCosts,
            bookings: prevBookings.length
          }
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
