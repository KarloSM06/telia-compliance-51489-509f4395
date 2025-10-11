import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { normalizePhoneNumber, isValidPhoneNumber } from "@/lib/phoneUtils";
import { FileText, CheckCircle2, Loader2 } from "lucide-react";

interface QuoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QuoteModal = ({ open, onOpenChange }: QuoteModalProps) => {
  const [step, setStep] = useState<'conversation' | 'form'>('conversation');
  const [summary, setSummary] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState<boolean | null>(null);
  const { toast } = useToast();

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    if (value.length > 3) {
      setIsPhoneValid(isValidPhoneNumber(value));
    } else {
      setIsPhoneValid(null);
    }
  };

  const startConversation = () => {
    // TODO: Initialize ElevenLabs conversation here
    // For now, skip to form
    setSummary("Jag är intresserad av att implementera en AI-lösning för mitt företag.");
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const normalized = normalizePhoneNumber(phoneNumber);
    if (!normalized) {
      toast({
        title: "Ogiltigt telefonnummer",
        description: "Vänligen ange ett giltigt telefonnummer",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('offers')
        .insert([{ 
          summary,
          email: email || null,
          phone_number: normalized 
        }]);

      if (error) throw error;

      toast({
        title: "Tack för din förfrågan!",
        description: "Vi återkommer till dig inom kort med en offert.",
      });
      
      setSummary("");
      setEmail("");
      setPhoneNumber("");
      setIsPhoneValid(null);
      setStep('conversation');
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving offer:', error);
      toast({
        title: "Ett fel uppstod",
        description: "Vänligen försök igen senare",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Få offert
          </DialogTitle>
          <DialogDescription>
            {step === 'conversation' 
              ? "Berätta om dina behov så hjälper vi dig med en skräddarsydd offert."
              : "Granska och komplettera informationen nedan."}
          </DialogDescription>
        </DialogHeader>

        {step === 'conversation' ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Klicka på knappen nedan för att starta ett samtal med vår AI-assistent som guidar dig genom offertprocessen.
            </p>
            <Button onClick={startConversation} className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin opacity-0" />
              Starta samtal
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Sammanfattning</label>
              <Textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Beskriv dina behov..."
                className="min-h-[100px]"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">E-post (valfritt)</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="din@email.se"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Telefonnummer</label>
              <div className="relative">
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="070-123 45 67"
                  className="pr-10"
                  required
                />
                {isPhoneValid && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                )}
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || !isPhoneValid}
            >
              {isLoading ? "Skickar..." : "Skicka förfrågan"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
