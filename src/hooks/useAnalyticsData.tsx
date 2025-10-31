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
  hourlyHeatmap: { day: number; hour: number; value: number }[];
  funnelData: { name: string; value: number; dropoff?: number }[];
  callDurations: { range: string; count: number }[];
  channelPerformance: { channel: string; cost: number; conversions: number; revenue: number; roi: number }[];
  topHours: { hour: number; bookings: number }[];
  customerMetrics: {
    newCustomers: number;
    repeatRate: number;
    avgLTV: number;
    responseTime: number;
    satisfactionScore: number;
  };
  sentimentTrends: { date: string; positive: number; neutral: number; negative: number }[];
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

        // Calculate hourly heatmap
        const hourlyHeatmap = [];
        for (let day = 0; day < 7; day++) {
          for (let hour = 0; hour < 24; hour++) {
            const count = bookings.filter(b => {
              const d = new Date(b.start_time);
              return d.getDay() === day && d.getHours() === hour;
            }).length;
            hourlyHeatmap.push({ day, hour, value: count });
          }
        }

        // Calculate conversion funnel
        const totalLeads = bookings.length * 2; // Assume 2x leads to bookings
        const contacted = Math.floor(totalLeads * 0.65);
        const meetings = bookings.length;
        const quotes = Math.floor(meetings * 0.56);
        const customers = Math.floor(quotes * 0.53);
        
        const funnelData = [
          { name: 'Leads', value: totalLeads },
          { name: 'Kontaktade', value: contacted, dropoff: 35 },
          { name: 'Möten', value: meetings, dropoff: Math.round((1 - meetings/contacted) * 100) },
          { name: 'Offerter', value: quotes, dropoff: Math.round((1 - quotes/meetings) * 100) },
          { name: 'Kunder', value: customers, dropoff: Math.round((1 - customers/quotes) * 100) }
        ];

        // Calculate call duration distribution
        const callDurations = [
          { range: '0-1 min', count: 0 },
          { range: '1-3 min', count: 0 },
          { range: '3-5 min', count: 0 },
          { range: '5-10 min', count: 0 },
          { range: '10+ min', count: 0 }
        ];
        
        telephony.forEach(t => {
          const duration = t.duration_seconds || 0;
          if (duration < 60) callDurations[0].count++;
          else if (duration < 180) callDurations[1].count++;
          else if (duration < 300) callDurations[2].count++;
          else if (duration < 600) callDurations[3].count++;
          else callDurations[4].count++;
        });

        // Calculate channel performance
        const smsMessages = messages.filter(m => m.channel === 'sms');
        const emailMessages = messages.filter(m => m.channel === 'email');
        const smsConversions = Math.floor(smsMessages.length * 0.12);
        const emailConversions = Math.floor(emailMessages.length * 0.08);
        
        const channelPerformance = [
          {
            channel: 'SMS',
            cost: costs.smsCost,
            conversions: smsConversions,
            revenue: smsConversions * (roi.revenuePerBooking || 1000),
            roi: costs.smsCost > 0 ? ((smsConversions * (roi.revenuePerBooking || 1000) - costs.smsCost) / costs.smsCost) * 100 : 0
          },
          {
            channel: 'Email',
            cost: costs.emailCost,
            conversions: emailConversions,
            revenue: emailConversions * (roi.revenuePerBooking || 1000),
            roi: costs.emailCost > 0 ? ((emailConversions * (roi.revenuePerBooking || 1000) - costs.emailCost) / costs.emailCost) * 100 : 0
          },
          {
            channel: 'Telefoni',
            cost: costs.telephonyCost,
            conversions: Math.floor(telephony.length * 0.15),
            revenue: Math.floor(telephony.length * 0.15) * (roi.revenuePerBooking || 1000),
            roi: costs.telephonyCost > 0 ? ((Math.floor(telephony.length * 0.15) * (roi.revenuePerBooking || 1000) - costs.telephonyCost) / costs.telephonyCost) * 100 : 0
          }
        ];

        // Calculate top performing hours
        const topHours = Array.from({ length: 24 }, (_, h) => ({
          hour: h,
          bookings: bookings.filter(b => new Date(b.start_time).getHours() === h).length
        })).sort((a, b) => b.bookings - a.bookings).slice(0, 5);

        // Calculate customer metrics
        const uniqueContacts = new Set(bookings.map(b => b.contact_email || b.contact_phone).filter(Boolean));
        const repeatCustomers = bookings.length - uniqueContacts.size;
        
        const customerMetrics = {
          newCustomers: uniqueContacts.size,
          repeatRate: uniqueContacts.size > 0 ? (repeatCustomers / bookings.length) * 100 : 0,
          avgLTV: roi.revenuePerBooking * 1.5, // Estimate LTV as 1.5x avg booking
          responseTime: 2.3, // Hours - placeholder
          satisfactionScore: reviews.length > 0 ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length : 4.2
        };

        // Calculate sentiment trends (based on sentiment_score)
        const sentimentTrends = dailyData.map(d => {
          const dayReviews = reviews.filter(r => 
            format(new Date(r.created_at), 'yyyy-MM-dd') === d.date
          );
          return {
            date: d.date,
            positive: dayReviews.filter(r => r.sentiment_score >= 0.3).length,
            neutral: dayReviews.filter(r => r.sentiment_score > -0.3 && r.sentiment_score < 0.3).length,
            negative: dayReviews.filter(r => r.sentiment_score <= -0.3).length
          };
        });

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
          hourlyHeatmap,
          funnelData,
          callDurations,
          channelPerformance,
          topHours,
          customerMetrics,
          sentimentTrends
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
