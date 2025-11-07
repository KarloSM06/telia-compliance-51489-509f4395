import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DemoBookingProps {
  children: React.ReactNode;
}

export const DemoBooking = ({ children }: DemoBookingProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const plans = [
    { name: "Starter", price: "699 kr", description: "1-5 agenter" },
    { name: "Business", price: "599 kr", description: "6-20 agenter" },
    { name: "Enterprise", price: "499 kr", description: "21+ agenter" }
  ];

  const currentPlan = plans.find(plan => plan.name === selectedPlan);

  const handleSubmit = async () => {
    // Validation
    if (!company || !email || !phone) {
      toast({
        title: "Fält saknas",
        description: "Vänligen fyll i företag, e-post och telefonnummer",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('ai_consultations')
        .insert({
          company_name: company,
          contact_person: '',
          email: email,
          phone: phone,
          business_description: selectedPlan 
            ? `Demo-bokning för ${selectedPlan}\n\n${message || 'Inget meddelande angett'}`
            : message || 'Demo-bokning utan vald plan',
        });

      if (error) throw error;

      toast({
        title: "Tack för din bokning!",
        description: "Vi kontaktar dig inom 24 timmar för att boka en demo.",
      });

      // Reset form
      setCompany("");
      setEmail("");
      setPhone("");
      setMessage("");
      setSelectedPlan("");
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte skicka din bokning. Försök igen.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Boka Demo - Få Offert</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Plan Selection */}
          <div className="space-y-3">
            <Label htmlFor="plan">Välj plan</Label>
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Välj vilken plan du är intresserad av" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                {plans.map((plan) => (
                  <SelectItem key={plan.name} value={plan.name} className="hover:bg-accent">
                    <div className="flex flex-col">
                      <span className="font-medium">{plan.name}</span>
                      <span className="text-sm text-muted-foreground">{plan.price}/agent/månad • {plan.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Plan Display */}
          {currentPlan && (
            <div className="rounded-lg bg-gradient-primary p-4 text-white text-center">
              <h3 className="text-lg font-semibold">{currentPlan.name}</h3>
              <div className="text-2xl font-bold">{currentPlan.price}</div>
              <div className="text-sm opacity-90">per agent/månad • {currentPlan.description}</div>
            </div>
          )}

          {/* Contact Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Företag *</Label>
              <Input 
                id="company" 
                placeholder="Ditt företagsnamn" 
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-post *</Label>
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
                placeholder="070-123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Meddelande</Label>
              <Textarea 
                id="message" 
                placeholder="Berätta om era behov och hur många agenter ni har..."
                className="min-h-[80px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>

          {/* Features Preview */}
          <div className="space-y-2">
            <h4 className="font-medium">Vad ingår:</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              {[
                "AI-baserad kvalitetsgranskning",
                "Avancerad AI-modeller för optimal precision",
                "Compliance mot regler och riktlinjer",
                "Fullständig dashboard med totalscore 0-100%",
                "Veckovis sammanfattning"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <Button 
            className="w-full" 
            size="lg"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {isLoading ? "Skickar..." : "Boka demo & få offert"}
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            Vi kontaktar dig inom 24 timmar för att boka en demo
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};