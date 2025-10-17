import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export interface Lead {
  id: string;
  user_id: string;
  organization_id: string | null;
  search_id: string | null;
  company_name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  industry: string | null;
  location: string | null;
  company_size: string | null;
  description: string | null;
  ai_score: number | null;
  ai_reasoning: string | null;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'rejected' | 'lost';
  priority: 'low' | 'medium' | 'high';
  notes: string | null;
  source: 'n8n' | 'manual' | 'imported';
  contacted_at: string | null;
  converted_at: string | null;
  created_at: string;
  updated_at: string;
  lead_type?: 'brf' | 'business';
  organization_type?: string | null;
  apartment_count?: number | null;
  construction_year?: number | null;
  monthly_fee?: number | null;
  employee_count?: number | null;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  user_id: string;
  activity_type: 'email_sent' | 'call_made' | 'meeting_scheduled' | 'note_added' | 'status_changed';
  description: string | null;
  metadata: any;
  created_at: string;
}

export const useLeads = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLeads([]);
      setLoading(false);
      return;
    }

    fetchLeads();

    const channel = supabase
      .channel('leads_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchLeads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchLeads = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Error",
        description: "Failed to load leads",
        variant: "destructive",
      });
    } else {
      setLeads((data as Lead[]) || []);
    }
    setLoading(false);
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    const { error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating lead:', error);
      toast({
        title: "Error",
        description: "Failed to update lead",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Success",
      description: "Lead updated",
    });
    return true;
  };

  const deleteLead = async (id: string) => {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting lead:', error);
      toast({
        title: "Error",
        description: "Failed to delete lead",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Success",
      description: "Lead deleted",
    });
    return true;
  };

  const addActivity = async (leadId: string, activity: {
    activity_type: LeadActivity['activity_type'];
    description?: string;
    metadata?: any;
  }) => {
    if (!user) return false;

    const { error } = await supabase
      .from('lead_activities')
      .insert({
        lead_id: leadId,
        user_id: user.id,
        ...activity,
      });

    if (error) {
      console.error('Error adding activity:', error);
      toast({
        title: "Error",
        description: "Failed to add activity",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const bulkUpdateStatus = async (leadIds: string[], status: Lead['status']) => {
    const { error } = await supabase
      .from('leads')
      .update({ status })
      .in('id', leadIds);

    if (error) {
      console.error('Error bulk updating leads:', error);
      toast({
        title: "Error",
        description: "Failed to update leads",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Success",
      description: `Updated ${leadIds.length} leads`,
    });
    return true;
  };

  const stats = {
    totalLeads: leads.length,
    contacted: leads.filter(l => ['contacted', 'qualified', 'converted'].includes(l.status)).length,
    conversions: leads.filter(l => l.status === 'converted').length,
    newLeads: leads.filter(l => l.status === 'new').length,
  };

  return {
    leads,
    loading,
    stats,
    updateLead,
    deleteLead,
    addActivity,
    bulkUpdateStatus,
    refetch: fetchLeads,
  };
};