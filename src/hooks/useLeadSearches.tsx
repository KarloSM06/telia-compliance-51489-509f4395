import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export interface LeadSearch {
  id: string;
  user_id: string;
  organization_id: string | null;
  search_name: string;
  industry: string[] | null;
  location: string[] | null;
  company_size: string | null;
  revenue_range: string | null;
  keywords: string[] | null;
  status: 'active' | 'paused' | 'completed';
  leads_target: number;
  leads_generated: number;
  created_at: string;
  updated_at: string;
  last_run_at: string | null;
}

export interface CreateLeadSearchData {
  search_name: string;
  industry?: string[];
  location?: string[];
  company_size?: string;
  revenue_range?: string;
  keywords?: string[];
  leads_target?: number;
}

const N8N_WEBHOOK_URL = "https://n8n.srv1053222.hstgr.cloud/webhook-test/007abc28-2188-4bd0-989c-b086b935e25e";

export const useLeadSearches = () => {
  const { user } = useAuth();
  const [searches, setSearches] = useState<LeadSearch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSearches([]);
      setLoading(false);
      return;
    }

    fetchSearches();

    const channel = supabase
      .channel('lead_searches_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lead_searches',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchSearches();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchSearches = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('lead_searches')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching lead searches:', error);
      toast({
        title: "Error",
        description: "Failed to load lead searches",
        variant: "destructive",
      });
    } else {
      setSearches((data as LeadSearch[]) || []);
    }
    setLoading(false);
  };

  const createSearch = async (data: CreateLeadSearchData) => {
    if (!user) return null;

    const { data: newSearch, error } = await supabase
      .from('lead_searches')
      .insert({
        user_id: user.id,
        ...data,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating lead search:', error);
      toast({
        title: "Error",
        description: "Failed to create lead search",
        variant: "destructive",
      });
      return null;
    }

    // Trigger n8n workflow
    try {
      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          search_id: newSearch.id,
          user_id: user.id,
          criteria: data,
        }),
      });

      toast({
        title: "Success",
        description: "Lead search created and processing started",
      });
    } catch (error) {
      console.error('Error triggering n8n:', error);
      toast({
        title: "Warning",
        description: "Search created but automation failed to start",
        variant: "destructive",
      });
    }

    return newSearch;
  };

  const updateSearch = async (id: string, updates: Partial<LeadSearch>) => {
    const { error } = await supabase
      .from('lead_searches')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating lead search:', error);
      toast({
        title: "Error",
        description: "Failed to update lead search",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Success",
      description: "Lead search updated",
    });
    return true;
  };

  const deleteSearch = async (id: string) => {
    const { error } = await supabase
      .from('lead_searches')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting lead search:', error);
      toast({
        title: "Error",
        description: "Failed to delete lead search",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Success",
      description: "Lead search deleted",
    });
    return true;
  };

  const pauseSearch = (id: string) => updateSearch(id, { status: 'paused' });
  const resumeSearch = (id: string) => updateSearch(id, { status: 'active' });

  return {
    searches,
    loading,
    createSearch,
    updateSearch,
    deleteSearch,
    pauseSearch,
    resumeSearch,
    refetch: fetchSearches,
  };
};