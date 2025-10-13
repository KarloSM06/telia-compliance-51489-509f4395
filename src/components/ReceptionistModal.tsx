import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { normalizePhoneNumber } from "@/lib/phoneUtils";
import { z } from "zod";

interface ReceptionistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReceptionistModal = ({ open, onOpenChange }: ReceptionistModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const phoneSchema = z.object({
    phone: z.string().trim()
      .min(8, "Telefonnummer måste vara minst 8 siffror")
      .max(15, "Telefonnummer får vara max 15 siffror")
      .regex(/^[\d\s\-\+\(\)]+$/, "Ogiltigt telefonnummer format"),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      phoneSchema.parse({ phone: phoneNumber });
      
      const normalizedPhone = normalizePhoneNumber(phoneNumber);
      
      if (!normalizedPhone) {
        toast({
          title: "Ogiltigt telefonnummer",
          description: "Vänligen ange ett giltigt telefonnummer",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

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
      if (error instanceof z.ZodError) {
        toast({
          title: "Valideringsfel",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Ett fel uppstod",
          description: "Kunde inte spara ditt telefonnummer. Vänligen försök igen.",
          variant: "destructive",
        });
      }
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
