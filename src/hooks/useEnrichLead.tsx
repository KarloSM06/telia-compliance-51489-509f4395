import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useEnrichLead = () => {
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichingLeadId, setEnrichingLeadId] = useState<string | null>(null);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });

  const enrichLead = async (leadId: string): Promise<boolean> => {
    setIsEnriching(true);
    setEnrichingLeadId(leadId);

    try {
      const { data, error } = await supabase.functions.invoke('enrich-lead', {
        body: { lead_id: leadId }
      });

      if (error) {
        console.error('Error enriching lead:', error);
        
        if (error.message?.includes('429')) {
          toast({
            title: "För många förfrågningar",
            description: "AI-tjänsten är överbelastad. Försök igen om en stund.",
            variant: "destructive",
          });
        } else if (error.message?.includes('402')) {
          toast({
            title: "AI-krediter slut",
            description: "Lägg till fler AI-krediter för att fortsätta berika leads.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Fel vid AI-berikning",
            description: "Kunde inte berika lead. Försök igen.",
            variant: "destructive",
          });
        }
        return false;
      }

      if (data?.success) {
        const aiScore = data.lead?.ai_score || 0;
        const recommendedProduct = data.recommended_product || '';
        
        toast({
          title: "Lead berikad! ✨",
          description: `AI Score: ${aiScore}/100${recommendedProduct ? ` • Rekommenderad: ${recommendedProduct}` : ''}`,
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Oväntat fel",
        description: "Något gick fel. Försök igen.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsEnriching(false);
      setEnrichingLeadId(null);
    }
  };

  const bulkEnrichLeads = async (leadIds: string[]): Promise<number> => {
    if (leadIds.length === 0) return 0;

    setIsEnriching(true);
    setBulkProgress({ current: 0, total: leadIds.length });
    
    let successCount = 0;

    toast({
      title: "Berikar leads...",
      description: `Bearbetar ${leadIds.length} leads med AI`,
    });

    for (let i = 0; i < leadIds.length; i++) {
      const leadId = leadIds[i];
      setBulkProgress({ current: i + 1, total: leadIds.length });
      
      try {
        const { data, error } = await supabase.functions.invoke('enrich-lead', {
          body: { lead_id: leadId }
        });

        if (!error && data?.success) {
          successCount++;
        }
        
        // Small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Error enriching lead:', leadId, error);
      }
    }

    setIsEnriching(false);
    setBulkProgress({ current: 0, total: 0 });

    if (successCount > 0) {
      toast({
        title: "Bulk-berikning klar! ✨",
        description: `${successCount} av ${leadIds.length} leads berikade`,
      });
    } else {
      toast({
        title: "Inga leads berikade",
        description: "Kontrollera att du har AI-krediter kvar",
        variant: "destructive",
      });
    }

    return successCount;
  };

  return {
    enrichLead,
    bulkEnrichLeads,
    isEnriching,
    enrichingLeadId,
    bulkProgress,
  };
};