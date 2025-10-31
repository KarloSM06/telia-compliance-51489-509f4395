import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface ServicePricing {
  service_name: string;
  avg_price: number;
  min_price: number;
  max_price: number;
  conversion_probability?: number;
}

export interface DocumentUpload {
  file_name: string;
  file_url: string;
  amount: number;
  date: string;
  service_type?: string;
}

export interface BusinessMetrics {
  id?: string;
  user_id?: string;
  annual_revenue?: number;
  currency?: string;
  fiscal_year?: number;
  service_pricing: ServicePricing[];
  uploaded_quotes: DocumentUpload[];
  uploaded_invoices: DocumentUpload[];
  meeting_to_payment_probability: number;
  avg_project_cost?: number;
  hiems_monthly_support_cost?: number;
  integration_cost?: number;
  integration_start_date?: string;
  created_at?: string;
  updated_at?: string;
}

export const useBusinessMetrics = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: metrics, isLoading } = useQuery({
    queryKey: ["business-metrics", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("business_metrics")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      // Return default values if no metrics exist
      if (!data) {
        return {
          service_pricing: [],
          uploaded_quotes: [],
          uploaded_invoices: [],
          meeting_to_payment_probability: 50,
        } as BusinessMetrics;
      }

      // Parse JSON fields
      return {
        ...data,
        service_pricing: (data.service_pricing as unknown as ServicePricing[]) || [],
        uploaded_quotes: (data.uploaded_quotes as unknown as DocumentUpload[]) || [],
        uploaded_invoices: (data.uploaded_invoices as unknown as DocumentUpload[]) || [],
      } as BusinessMetrics;
    },
    enabled: !!user?.id,
  });

  const upsertMutation = useMutation({
    mutationFn: async (metricsData: Partial<BusinessMetrics>) => {
      if (!user?.id) throw new Error("User not authenticated");

      const payload: any = {
        user_id: user.id,
        ...metricsData,
      };

      const { data, error } = await supabase
        .from("business_metrics")
        .upsert(payload, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-metrics"] });
      toast.success("ROI-inställningar sparade");
    },
    onError: (error) => {
      console.error("Error saving business metrics:", error);
      toast.error("Kunde inte spara ROI-inställningar");
    },
  });

  return {
    metrics,
    isLoading,
    updateMetrics: upsertMutation.mutate,
    isUpdating: upsertMutation.isPending,
  };
};
