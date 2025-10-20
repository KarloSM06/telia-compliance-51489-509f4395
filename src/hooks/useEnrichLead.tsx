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
      // Send webhook immediately when enrichment is triggered
      const webhookUrl = 'https://n8n.srv1053222.hstgr.cloud/webhook-test/007abc28-2188-4bd0-989c-b086b935e25e';
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'lead.enrichment_started',
            timestamp: new Date().toISOString(),
            lead_id: leadId,
            triggered_by: 'manual',
          }),
        });
        console.log('Webhook triggered for lead:', leadId);
      } catch (webhookError) {
        console.error('Webhook failed (continuing anyway):', webhookError);
      }

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
      
      // Send webhook for each lead in bulk operation
      const webhookUrl = 'https://n8n.srv1053222.hstgr.cloud/webhook-test/007abc28-2188-4bd0-989c-b086b935e25e';
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'lead.enrichment_started',
            timestamp: new Date().toISOString(),
            lead_id: leadId,
            triggered_by: 'bulk',
          }),
        });
      } catch (webhookError) {
        console.error('Webhook failed for lead:', leadId, webhookError);
      }
      
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