import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useEnrichLead = () => {
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichingLeadId, setEnrichingLeadId] = useState<string | null>(null);

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

  return {
    enrichLead,
    isEnriching,
    enrichingLeadId,
  };
};