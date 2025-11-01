import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { useEffect } from "react";

export interface ConversionFunnelMetrics {
  id: string;
  user_id: string;
  period_start: string;
  period_end: string;
  leads_generated: number;
  leads_contacted: number;
  calls_made: number;
  meetings_scheduled: number;
  meetings_held: number;
  deals_closed: number;
  lead_to_contact_rate: number;
  contact_to_call_rate: number;
  call_to_meeting_rate: number;
  meeting_to_deal_rate: number;
  overall_conversion_rate: number;
  total_revenue: number;
  avg_deal_size: number;
}

interface DateRange {
  from: Date;
  to: Date;
}

export function useConversionFunnel(dateRange: DateRange) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: metrics, isLoading } = useQuery({
    queryKey: ["conversion-funnel", user?.id, dateRange],
    queryFn: async () => {
      if (!user?.id) return null;

      // Calculate metrics from actual data
      const [leadsData, callsData, meetingsData] = await Promise.all([
        supabase
          .from("leads")
          .select("*")
          .eq("user_id", user.id)
          .gte("created_at", dateRange.from.toISOString())
          .lte("created_at", dateRange.to.toISOString()),
        
        supabase
          .from("telephony_events")
          .select("*")
          .eq("user_id", user.id)
          .gte("created_at", dateRange.from.toISOString())
          .lte("created_at", dateRange.to.toISOString()),
        
        supabase
          .from("calendar_events")
          .select("*")
          .eq("user_id", user.id)
          .eq("event_type", "meeting")
          .gte("created_at", dateRange.from.toISOString())
          .lte("created_at", dateRange.to.toISOString())
      ]);

      const leads = leadsData.data || [];
      const calls = callsData.data || [];
      const meetings = meetingsData.data || [];

      // Calculate funnel stages
      const leadsGenerated = leads.length;
      const leadsContacted = leads.filter(l => l.contacted_at || l.first_call_at).length;
      const callsMade = calls.filter(c => c.direction === 'outbound').length;
      const meetingsScheduled = meetings.filter(m => m.status === 'scheduled').length;
      const meetingsHeld = meetings.filter(m => m.status === 'completed').length;
      const dealsClosed = leads.filter(l => l.conversion_stage === 'deal_closed').length;

      // Calculate conversion rates
      const leadToContactRate = leadsGenerated > 0 ? (leadsContacted / leadsGenerated) * 100 : 0;
      const contactToCallRate = leadsContacted > 0 ? (callsMade / leadsContacted) * 100 : 0;
      const callToMeetingRate = callsMade > 0 ? (meetingsScheduled / callsMade) * 100 : 0;
      const meetingToDealRate = meetingsHeld > 0 ? (dealsClosed / meetingsHeld) * 100 : 0;
      const overallConversionRate = leadsGenerated > 0 ? (dealsClosed / leadsGenerated) * 100 : 0;

      // Calculate revenue metrics
      const totalRevenue = leads
        .filter(l => l.deal_value)
        .reduce((sum, l) => sum + (l.deal_value || 0), 0);
      const avgDealSize = dealsClosed > 0 ? totalRevenue / dealsClosed : 0;

      return {
        leads_generated: leadsGenerated,
        leads_contacted: leadsContacted,
        calls_made: callsMade,
        meetings_scheduled: meetingsScheduled,
        meetings_held: meetingsHeld,
        deals_closed: dealsClosed,
        lead_to_contact_rate: Number(leadToContactRate.toFixed(2)),
        contact_to_call_rate: Number(contactToCallRate.toFixed(2)),
        call_to_meeting_rate: Number(callToMeetingRate.toFixed(2)),
        meeting_to_deal_rate: Number(meetingToDealRate.toFixed(2)),
        overall_conversion_rate: Number(overallConversionRate.toFixed(2)),
        total_revenue: Number(totalRevenue.toFixed(2)),
        avg_deal_size: Number(avgDealSize.toFixed(2))
      };
    },
    enabled: !!user?.id,
  });

  const updateLeadStage = useMutation({
    mutationFn: async ({
      leadId,
      stage,
      dealValue
    }: {
      leadId: string;
      stage: string;
      dealValue?: number;
    }) => {
      const updates: any = { conversion_stage: stage };

      if (stage === 'contacted') {
        updates.contacted_at = new Date().toISOString();
        updates.first_call_at = new Date().toISOString();
      } else if (stage === 'meeting_scheduled' || stage === 'meeting_held') {
        updates.first_meeting_at = new Date().toISOString();
      } else if (stage === 'deal_closed') {
        updates.deal_closed_at = new Date().toISOString();
        if (dealValue) updates.deal_value = dealValue;
      }

      const { error } = await supabase
        .from("leads")
        .update(updates)
        .eq("id", leadId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversion-funnel"] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead stage uppdaterad");
    },
    onError: (error: any) => {
      toast.error("Kunde inte uppdatera lead: " + error.message);
    },
  });

  // Real-time subscription for all funnel data sources
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('conversion-funnel-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads', filter: `user_id=eq.${user.id}` }, 
        () => queryClient.invalidateQueries({ queryKey: ['conversion-funnel', user.id] })
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'telephony_events', filter: `user_id=eq.${user.id}` }, 
        () => queryClient.invalidateQueries({ queryKey: ['conversion-funnel', user.id] })
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'calendar_events', filter: `user_id=eq.${user.id}` }, 
        () => queryClient.invalidateQueries({ queryKey: ['conversion-funnel', user.id] })
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  return {
    metrics,
    isLoading,
    updateLeadStage: updateLeadStage.mutate,
    isUpdating: updateLeadStage.isPending,
  };
}
