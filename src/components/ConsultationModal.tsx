import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Check } from "lucide-react";

interface ConsultationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConsultationModal({ open, onOpenChange }: ConsultationModalProps) {
  const [discountCode, setDiscountCode] = useState("");
  const [isValidCode, setIsValidCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { toast } = useToast();

  const PRICE = 2000;
  const finalPrice = isValidCode ? 0 : PRICE;

  const validateDiscountCode = (code: string) => {
    if (code.toUpperCase() === "DRIVAEGET") {
      setIsValidCode(true);
      toast({
        title: "Rabattkod godkänd!",
        description: "Konsultationen är nu kostnadsfri.",
      });
    } else if (code) {
      setIsValidCode(false);
      toast({
        title: "Ogiltig rabattkod",
        description: "Vänligen kontrollera koden och försök igen.",
        variant: "destructive",
      });
    }
  };

  const handleBooking = async () => {
    if (!email || !phoneNumber) {
      toast({
        title: "Fyll i alla fält",
        description: "E-post och telefonnummer krävs för att boka.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Save booking to database
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          epost: email,
          telefonnummer: phoneNumber,
          bokningstyp: 'konsultation',
          status: finalPrice === 0 ? 'bekräftad' : 'väntande_betalning',
          info: `AI Konsultation - ${finalPrice === 0 ? 'Gratis med rabattkod' : `${finalPrice} kr`}`,
        });

      if (bookingError) throw bookingError;

      if (finalPrice === 0) {
        // Free consultation - just show confirmation
        toast({
          title: "Bokning mottagen!",
          description: "Vi kontaktar dig inom kort för att boka in konsultationen.",
        });
        onOpenChange(false);
      } else {
        // Paid consultation - create Stripe checkout for one-time payment
        const { data, error } = await supabase.functions.invoke("create-payment-session", {
          body: {
            priceId: "price_REPLACE_WITH_CONSULTATION_PRICE_ID",
            productId: "consultation",
            quantity: 1,
          },
        });

        if (error) throw error;
        if (data?.url) {
          window.open(data.url, '_blank');
        }
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte genomföra bokningen. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur-sm border-white/10">
        <DialogHeader>
          <DialogTitle className="text-3xl font-display font-bold bg-gradient-gold bg-clip-text text-transparent">
            AI Konsultation
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <p className="text-lg leading-relaxed text-foreground/90">
              Vi genomför en grundlig analys av er verksamhet för att identifiera möjligheter där AI och automationslösningar kan:
            </p>
            <ul className="space-y-2 text-foreground/80">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Effektivisera era affärsprocesser och minska manuellt arbete</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Förbättra kundupplevelsen genom intelligent automatisering</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Öka lönsamheten genom datadriven beslutsfattning</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span>Skapa konkurrensfördelar med skräddarsydda AI-lösningar</span>
              </li>
            </ul>
            <p className="text-sm text-foreground/70 italic">
              Efter konsultationen får ni en detaljerad rapport med konkreta rekommendationer och en färdplan för implementation.
            </p>
          </div>

          <div className="space-y-4 p-4 bg-accent/5 rounded-lg border border-accent/20">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Pris:</span>
              <span className={`text-2xl font-bold ${isValidCode ? 'line-through text-foreground/40' : 'text-accent'}`}>
                {PRICE} kr
              </span>
            </div>
            
            {isValidCode && (
              <div className="flex items-center justify-between animate-fade-in">
                <span className="text-lg font-semibold">Med rabattkod:</span>
                <span className="text-2xl font-bold text-green-500">Kostnadsfritt!</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="discount-code">Rabattkod (valfritt)</Label>
              <div className="flex gap-2">
                <Input
                  id="discount-code"
                  placeholder="Ange rabattkod"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                  className="flex-1"
                />
                <Button
                  onClick={() => validateDiscountCode(discountCode)}
                  variant="outline"
                  disabled={!discountCode}
                >
                  Använd
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-postadress *</Label>
              <Input
                id="email"
                type="email"
                placeholder="din@epost.se"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefonnummer *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="070-123 45 67"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
          </div>

          <Button
            onClick={handleBooking}
            disabled={isLoading}
            className="w-full bg-gradient-gold hover:shadow-glow transition-all duration-300 text-lg py-6"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Bearbetar...
              </>
            ) : (
              <>Boka konsultation{finalPrice > 0 && ` - ${finalPrice} kr`}</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
