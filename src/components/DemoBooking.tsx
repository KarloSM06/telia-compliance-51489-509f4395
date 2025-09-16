import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Users, Calendar } from "lucide-react";

interface DemoBookingProps {
  children: React.ReactNode;
}

export const DemoBooking = ({ children }: DemoBookingProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [agents, setAgents] = useState(1);

  const totalPrice = agents * 499;

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
          {/* Pricing Display */}
          <div className="rounded-lg bg-gradient-primary p-6 text-white text-center">
            <h3 className="text-lg font-semibold mb-2">Kvalitetskontroll AI</h3>
            <div className="text-3xl font-bold">499 kr</div>
            <div className="text-sm opacity-90">per agent/månad</div>
          </div>

          {/* Agent Selection */}
          <div className="space-y-3">
            <Label htmlFor="agents" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Antal agenter
            </Label>
            <Input
              id="agents"
              type="number"
              min="1"
              value={agents}
              onChange={(e) => setAgents(Math.max(1, parseInt(e.target.value) || 1))}
              className="text-center"
            />
          </div>

          {/* Total Calculation */}
          <div className="rounded-lg border p-4 bg-secondary/50">
            <div className="flex justify-between items-center text-sm mb-2">
              <span>{agents} agent{agents > 1 ? 'er' : ''} × 499 kr</span>
              <span>{totalPrice.toLocaleString('sv-SE')} kr/månad</span>
            </div>
            <div className="text-xs text-muted-foreground">
              + moms
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <h4 className="font-medium">Ingår i paketet:</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              {[
                "AI-baserad kvalitetsgranskning",
                "Automatisk regelkontroll",
                "Detaljerade analysrapporter",
                "24/7 övervakning",
                "Dashboard med insikter"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Företag</Label>
              <Input id="company" placeholder="Ditt företagsnamn" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-post</Label>
              <Input id="email" type="email" placeholder="din@epost.se" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input id="phone" placeholder="070-123 45 67" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Meddelande (valfritt)</Label>
              <Textarea 
                id="message" 
                placeholder="Berätta om era behov..."
                className="min-h-[80px]"
              />
            </div>
          </div>

          <Button className="w-full" size="lg">
            <Calendar className="mr-2 h-4 w-4" />
            Boka demo & få offert
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            Vi kontaktar dig inom 24 timmar för att boka en demo
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};