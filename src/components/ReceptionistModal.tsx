import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { normalizePhoneNumber, isValidPhoneNumber } from "@/lib/phoneUtils";
import { Phone, CheckCircle2 } from "lucide-react";

interface ReceptionistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReceptionistModal = ({ open, onOpenChange }: ReceptionistModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const { toast } = useToast();

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    if (value.length > 3) {
      setIsValid(isValidPhoneNumber(value));
    } else {
      setIsValid(null);
    }
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
        .from('phone_numbers')
        .insert([{ phone_number: normalized }]);

      if (error) throw error;

      toast({
        title: "Tack!",
        description: "Vi kontaktar dig snart för att boka ett samtal med vår AI-receptionist.",
      });
      
      setPhoneNumber("");
      setIsValid(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving phone number:', error);
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Prova vår AI-receptionist
          </DialogTitle>
          <DialogDescription>
            Ange ditt telefonnummer så ringer vår AI-receptionist upp dig för en kostnadsfri demo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type="tel"
              placeholder="070-123 45 67"
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className="pr-10"
            />
            {isValid && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
            )}
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || !isValid}
          >
            {isLoading ? "Sparar..." : "Boka demo"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
