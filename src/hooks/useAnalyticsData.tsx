import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { useBusinessMetrics } from "./useBusinessMetrics";
import { useOpenRouterActivitySEK } from "./useOpenRouterActivitySEK";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  calculateBookingRevenue, 
  calculateOperationalCosts, 
  calculateROI,
  calculateBreakEven,
  projectROI,
  calculateServiceROI,
  type BookingRevenue,
  type OperationalCosts,
  type ROIMetrics,
  type BreakEvenMetrics,
  type ProjectionMetrics,
  type ServiceMetrics
} from "@/lib/roiCalculations";
import { format, startOfDay, endOfDay, subDays } from "date-fns";
import { USD_TO_SEK } from "@/lib/constants";
import { calculateAICost } from "@/lib/aiCostCalculator";

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
  serviceMetrics: ServiceMetrics[];
  lastUpdated?: Date; // Track when data was last updated
}

export const useAnalyticsData = (dateRange?: { from: Date; to: Date }) => {
  const { user } = useAuth();
  const { metrics: businessMetrics } = useBusinessMetrics();
  const { data: openrouterData } = useOpenRouterActivitySEK(dateRange, true);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id || !businessMetrics) {
      setLoading(false);
      return;
    }

    const fetchAllData = async () => {
      console.log('📊 Fetching analytics data...');
      setLoading(true);
      
      const from = dateRange?.from || subDays(new Date(), 30);
      const desiredTo = dateRange?.to || new Date();
      
      // Always include today if selected range ends in the past
      const now = new Date();
      const effectiveTo = desiredTo < now ? now : desiredTo;
      
      const fromStr = startOfDay(from).toISOString();
      const toStr = endOfDay(effectiveTo).toISOString();
      
      console.log('📅 Period used:', { 
        from: format(from, 'yyyy-MM-dd'), 
        to: format(effectiveTo, 'yyyy-MM-dd'),
        autoAdjusted: desiredTo < now
      });

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
        const [bookingsRes, messagesRes, telephonyRes, reviewsRes, aiUsageRes] = await Promise.all([
          // Fetch calendar events without server-side date filter to avoid TEXT vs timestamptz issues
          supabase
            .from("calendar_events")
            .select("*")
            .eq("user_id", user.id)
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
          
          supabase
            .from("ai_usage_logs")
            .select("*")
            .eq("user_id", user.id)
            .gte("created_at", fromStr)
            .lte("created_at", toStr)
        ]);

        const rawBookings = bookingsRes.data || [];
        const messages = messagesRes.data || [];
        const telephonyRaw = telephonyRes.data || [];
        const reviews = reviewsRes.data || [];
        const aiUsage = aiUsageRes.data || [];

        // Filter bookings client-side with proper date parsing
        const fromDate = startOfDay(from);
        const toDate = endOfDay(effectiveTo);
        
        const bookings = rawBookings.filter(b => {
          const startTime = Date.parse(b.start_time);
          if (Number.isNaN(startTime)) {
            console.warn('⚠️ Invalid start_time for booking:', b.id, b.start_time);
            return false;
          }
          const eventDate = new Date(b.start_time);
          return eventDate >= fromDate && eventDate <= toDate;
        });

        const invalidCount = rawBookings.length - bookings.length;
        if (invalidCount > 0) {
          toast.warning(`${invalidCount} möten ignorerades pga ogiltigt datum (start_time)`, {
            description: "Kontrollera kalendern för felaktiga datum"
          });
        }

        console.log(`📅 Found ${bookings.length} bookings in period (${invalidCount} invalid):`, { 
          from: format(fromDate, 'yyyy-MM-dd'), 
          to: format(toDate, 'yyyy-MM-dd') 
        });
        console.log('📋 Bookings:', bookings.map(b => ({ 
          title: b.title, 
          start: b.start_time, 
          service_type: b.service_type 
        })));

        // Filter to only parent events (same logic as /telephony page)
        const telephony = telephonyRaw.filter(e => 
          !e.parent_event_id && (e.provider_layer === 'agent' || ['vapi', 'retell'].includes(e.provider))
        );

        // Calculate ROI
        const bookingRevenues = bookings.map(b => 
          calculateBookingRevenue(b, businessMetrics)
        );

        console.log('💰 Booking revenues:', bookingRevenues.map(br => ({
          id: br.bookingId,
          revenue: br.estimatedRevenue,
          reasoning: br.reasoning
        })));
        
        // Calculate total OpenRouter cost from actual API data (already in SEK)
        const openRouterCostSEK = openrouterData?.activity?.reduce(
          (sum, item) => sum + (item.usage || 0), 
          0
        ) || 0;
        
        const costs = calculateOperationalCosts(telephony, messages, aiUsage, businessMetrics, { from, to: effectiveTo }, openRouterCostSEK);
        const roi = calculateROI(bookingRevenues, costs);

        console.log('📈 ROI Metrics:', {
          totalRevenue: roi.totalRevenue,
          totalCosts: roi.totalCosts,
          netProfit: roi.netProfit,
          roi: roi.roi
        });

        // Show toast notification when data updates
        const unmatchedCount = bookingRevenues.filter(br => br.confidence < 70).length;
        if (unmatchedCount > 0) {
          toast.warning(`${unmatchedCount} bokningar matchades med låg säkerhet`, {
            description: "Kontrollera ROI-inställningar för bättre precision"
          });
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

        telephony
          .filter(t => t.provider === 'vapi')
          .forEach(t => {
            const day = format(new Date(t.event_timestamp), 'yyyy-MM-dd');
            if (!dailyMap.has(day)) {
              dailyMap.set(day, { date: day, bookings: 0, revenue: 0, costs: 0 });
            }
            const dayData = dailyMap.get(day);
            const costSEK = (parseFloat(String(t.aggregate_cost_amount || 0)) * USD_TO_SEK);
            dayData.costs += costSEK;
          });

        // Add AI usage costs to daily map (exclude OpenRouter - we use actual API data)
        aiUsage
          .filter(ai => ai.provider !== 'openrouter')
          .forEach(ai => {
            const day = format(new Date(ai.created_at), 'yyyy-MM-dd');
            if (!dailyMap.has(day)) {
              dailyMap.set(day, { date: day, bookings: 0, revenue: 0, costs: 0 });
            }
            const dayData = dailyMap.get(day);
            // cost_usd is often 0 in DB, calculate from tokens as fallback
            const costUSD = ai.cost_usd || calculateAICost({
              model: ai.model,
              prompt_tokens: ai.prompt_tokens || 0,
              completion_tokens: ai.completion_tokens || 0,
            });
            dayData.costs += Number(costUSD) * USD_TO_SEK;
          });

        // Add actual OpenRouter costs per day from API
        openrouterData?.activity?.forEach(item => {
          const day = item.date;
          if (!dailyMap.has(day)) {
            dailyMap.set(day, { date: day, bookings: 0, revenue: 0, costs: 0 });
          }
          const dayData = dailyMap.get(day);
          dayData.costs += item.usage; // Already in SEK
        });

        const dailyData = Array.from(dailyMap.values()).map(d => ({
          ...d,
          profit: d.revenue - d.costs,
          roi: d.costs > 0 ? ((d.revenue - d.costs) / d.costs) * 100 : 0
        }));

        // Calculate break-even and projections
        const historicalDays = Math.max(1, Math.ceil((effectiveTo.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)));
        const historicalRevenue = roi.totalRevenue;
        
        const breakEven = calculateBreakEven(businessMetrics, historicalRevenue, historicalDays);
        const projection12 = projectROI(12, businessMetrics, historicalRevenue, historicalDays);
        const projection24 = projectROI(24, businessMetrics, historicalRevenue, historicalDays);
        const projection36 = projectROI(36, businessMetrics, historicalRevenue, historicalDays);

        // Calculate service-specific ROI
        const serviceMetrics = calculateServiceROI(bookings, costs, businessMetrics);

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
          projection36,
          serviceMetrics,
          lastUpdated: new Date()
        });
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    // Set up real-time subscription for calendar_events changes with debouncing
    let debounceTimer: NodeJS.Timeout;
    
    const subscription = supabase
      .channel('analytics_calendar_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calendar_events',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('🔄 Calendar event changed, refreshing analytics in 500ms...', payload);
          
          // Debounce: wait 500ms before refetching
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            fetchAllData();
          }, 500);
        }
      )
      .subscribe();

    return () => {
      clearTimeout(debounceTimer);
      subscription.unsubscribe();
    };
  }, [user?.id, businessMetrics, dateRange]); // Removed openrouterData to prevent infinite loops

  return { data, loading };
};
