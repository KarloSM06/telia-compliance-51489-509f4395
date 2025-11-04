import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TranscriptViewerProps {
  callId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TranscriptViewer = ({ callId, open, onOpenChange }: TranscriptViewerProps) => {
  const { data: decryptedData, isLoading } = useQuery({
    queryKey: ['decrypt-call', callId],
    queryFn: async () => {
      if (!callId) return null;
      
      const { data, error } = await supabase.functions.invoke('decrypt-data', {
        body: { 
          callId,
          fields: ['transcript', 'analysis', 'agent_name', 'customer_name', 'customer_phone']
        }
      });

      if (error) throw error;
      return data;
    },
    enabled: !!callId && open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Samtalsutskrift</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4">
              {decryptedData?.agent_name && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Agent:</h3>
                  <p>{decryptedData.agent_name}</p>
                </div>
              )}

              {decryptedData?.customer_name && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Kund:</h3>
                  <p>{decryptedData.customer_name}</p>
                </div>
              )}

              {decryptedData?.customer_phone && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Telefon:</h3>
                  <p>{decryptedData.customer_phone}</p>
                </div>
              )}

              {decryptedData?.transcript && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2">Utskrift:</h3>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="whitespace-pre-wrap">{decryptedData.transcript}</p>
                  </div>
                </div>
              )}

              {decryptedData?.analysis && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2">Analys:</h3>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm">
                      {JSON.stringify(decryptedData.analysis, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {!decryptedData?.transcript && !isLoading && (
                <p className="text-center text-muted-foreground py-8">
                  Ingen utskrift tillgänglig
                </p>
              )}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};
