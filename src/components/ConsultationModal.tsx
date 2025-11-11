import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ConsultationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConsultationModal({ open, onOpenChange }: ConsultationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Form fields
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const validateForm = () => {
    if (!companyName || !contactPerson || !email || !phone) {
      toast({
        title: "Fyll i alla obligatoriska fält",
        description: "Företagsnamn, kontaktperson, e-post och telefon krävs.",
        variant: "destructive",
      });
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Ogiltig e-postadress",
        description: "Ange en giltig e-postadress.",
        variant: "destructive",
      });
      return false;
    }

    // Validate Swedish phone format (basic)
    const phoneRegex = /^[\d\s\-+()]+$/;
    if (!phoneRegex.test(phone)) {
      toast({
        title: "Ogiltigt telefonnummer",
        description: "Ange ett giltigt telefonnummer.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Förenklad data - endast det som faktiskt används
      const bookingData = {
        company_name: companyName,
        contact_person: contactPerson,
        email,
        phone,
        message: message || null,
      };

      const { error } = await supabase
        .from('booking_requests')
        .insert(bookingData);

      if (error) {
        console.error("Booking submission error:", error);
        throw error;
      }

      toast({
        title: "Tack för din förfrågan!",
        description: "Vi återkommer inom 24 timmar.",
      });
      
      // Reset form
      setCompanyName("");
      setContactPerson("");
      setEmail("");
      setPhone("");
      setMessage("");
      
      onOpenChange(false);
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte skicka formuläret. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-normal text-gray-900">
            Boka ett möte
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Fyll i formuläret så kontaktar vi dig inom 24 timmar
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="company">Företagsnamn *</Label>
            <Input
              id="company"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ditt företag AB"
              autoComplete="organization"
              inputMode="text"
              enterKeyHint="next"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Kontaktperson & roll *</Label>
            <Input
              id="contact"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="Anna Andersson, VD"
              autoComplete="name"
              inputMode="text"
              enterKeyHint="next"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-post *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="anna@foretag.se"
              autoComplete="email"
              inputMode="email"
              enterKeyHint="next"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon *</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="070-123 45 67"
              autoComplete="tel"
              inputMode="tel"
              enterKeyHint="next"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Beskriv era behov (valfritt)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Berätta kort om vad ni behöver hjälp med..."
              rows={4}
              enterKeyHint="done"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gray-900 hover:bg-gray-800 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
