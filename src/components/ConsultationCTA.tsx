import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Calendar, CheckCircle } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";

export const ConsultationCTA = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyName || !contactPerson || !email || !phone) {
      toast({
        title: "Fyll i alla obligatoriska fält",
        description: "Alla fält utom meddelande är obligatoriska.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('ai_consultations')
        .insert({
          company_name: companyName,
          contact_person: contactPerson,
          email,
          phone,
          business_description: message || "Ingen beskrivning angiven",
        });

      if (error) throw error;

      toast({
        title: "Tack för din förfrågan!",
        description: "Vi kontaktar dig inom kort för att boka in konsultationen.",
      });
      
      // Reset form
      setCompanyName("");
      setContactPerson("");
      setEmail("");
      setPhone("");
      setMessage("");
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
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <AnimatedSection className="text-center mb-12 lg:mb-16">
          <div className="inline-block mb-6">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Boka ett kostnadsfritt konsultmöte
            </h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-transparent mx-auto rounded-full shadow-lg shadow-primary/50 mt-4" />
          </div>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto font-light">
            Låt oss hjälpa dig att transformera din verksamhet med AI och automation. Fyll i formuläret så kontaktar vi dig inom kort.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <div className="max-w-2xl mx-auto bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 lg:p-12 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-base">
                  Företagsnamn *
                </Label>
                <Input
                  id="company"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Ditt företag AB"
                  className="text-base h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact" className="text-base">
                  Kontaktperson & roll *
                </Label>
                <Input
                  id="contact"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="Anna Andersson, VD"
                  className="text-base h-12"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base">
                    E-post *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="anna@foretag.se"
                    className="text-base h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base">
                    Telefon *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="070-123 45 67"
                    className="text-base h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-base">
                  Meddelande (valfritt)
                </Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Berätta gärna lite om er verksamhet och vad ni är intresserade av..."
                  rows={5}
                  className="text-base"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full bg-gradient-gold text-primary font-bold shadow-button hover:shadow-glow transition-all duration-300 hover:scale-105 text-lg py-6 group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Skickar...
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5 mr-2" />
                    Skicka förfrågan
                    <CheckCircle className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
