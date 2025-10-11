import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { normalizePhoneNumber } from "@/lib/phoneUtils";

interface ReceptionistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReceptionistModal = ({ open, onOpenChange }: ReceptionistModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      toast({
        title: "Telefonnummer saknas",
        description: "Vänligen ange ett telefonnummer",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const normalizedPhone = normalizePhoneNumber(phoneNumber);
      
      const { error } = await supabase
        .from('phone_numbers')
        .insert({ phone_number: normalizedPhone });

      if (error) throw error;

      toast({
        title: "Tack!",
        description: `Vi ringer upp dig inom kort på ${normalizedPhone}`,
      });
      
      setPhoneNumber("");
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving phone number:', error);
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte spara ditt telefonnummer. Vänligen försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-accent" />
            Prova vår receptionist
          </DialogTitle>
          <DialogDescription>
            Ange ditt telefonnummer så ringer vår AI-receptionist Krono upp dig direkt för att demonstrera hur den kan hjälpa ditt företag.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Telefonnummer</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="070-123 45 67"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Numret konverteras automatiskt till internationellt format (+46...)
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sparar..." : "Ring mig"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
