import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface EnterpriseContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
}

export function EnterpriseContactModal({ open, onOpenChange, productName }: EnterpriseContactModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          kundnamn: formData.name,
          epost: formData.email,
          telefonnummer: formData.phone,
          bokningstyp: 'enterprise_quote',
          info: `Företag: ${formData.company}\nProdukt: ${productName}\nMeddelande: ${formData.message}`,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Tack för din förfrågan!",
        description: "Vi hör av oss inom 24 timmar för att diskutera dina behov.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: ""
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting enterprise quote:", error);
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte skicka förfrågan. Försök igen.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Begär offert för {productName}</DialogTitle>
          <DialogDescription>
            Fyll i formuläret nedan så kontaktar vi dig för att diskutera era specifika behov och ge er ett skräddarsytt erbjudande.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Namn *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-post *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Företag *</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Berätta om era behov</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Antal användare, specifika önskemål, integrationsbehov..."
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Skickar...
              </>
            ) : (
              "Skicka förfrågan"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
