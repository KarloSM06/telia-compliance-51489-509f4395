import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import hiems_logo from "@/assets/hiems_logo.png";
import { useState } from "react";
import { ReceptionistModal } from "@/components/ReceptionistModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart } from "@/components/cart/ShoppingCart";
import { useCart } from "@/hooks/useCart";

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, removeItem, clearCart } = useCart();
  const [email, setEmail] = useState("");
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [isReceptionistOpen, setIsReceptionistOpen] = useState(false);

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      navigate("/auth");
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Tack för din anmälan!",
      description: "Du kommer snart få vårt nyhetsbrev.",
    });
    setEmail("");
    setIsNewsletterOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate("/")}
              className="flex items-center space-x-1 hover:opacity-80 transition-opacity"
            >
              <img src={hiems_logo} alt="Hiems logo" className="h-12 w-12 rounded-lg" />
              <span className="text-2xl font-bold text-foreground">Hiems</span>
            </button>
          </div>
          
          {!user && (
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/om-oss" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Om oss
              </a>
              <a href="/regelverk" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Regelverk
              </a>
              <Dialog open={isNewsletterOpen} onOpenChange={setIsNewsletterOpen}>
                <DialogTrigger asChild>
                  <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Nyhetsbrev
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Gå med i Hiems nyhetsbrev – helt gratis!</DialogTitle>
                    <DialogDescription>
                      Få de senaste tipsen, insikterna och verktygen inom AI-driven automation direkt i din inkorg – utan kostnad. Lär dig hur du kan effektivisera ditt företag, spara tid och öka lönsamheten.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newsletter-email">Ange din e-postadress och börja prenumerera helt gratis idag!</Label>
                      <Input
                        id="newsletter-email"
                        type="email"
                        placeholder="E-postadress"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Gå med gratis
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </nav>
          )}
          
          <div className="flex items-center gap-3">
            <ShoppingCart 
              items={items} 
              onRemoveItem={removeItem} 
              onClearCart={clearCart}
            />
            
            {user ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="hidden md:flex">
                  Dashboard
                </Button>
                <span className="text-sm text-muted-foreground hidden lg:inline-block max-w-[150px] truncate">
                  {user.email}
                </span>
                <Button variant="ghost" size="sm" onClick={handleAuthClick}>
                  <LogOut className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Logga ut</span>
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" onClick={handleAuthClick}>
                Logga in
              </Button>
            )}
            <Button 
              className="bg-gradient-gold text-primary hover:shadow-glow hover:scale-105 transition-all duration-300 font-semibold"
              onClick={() => setIsReceptionistOpen(true)}
              size="sm"
            >
              <span className="hidden sm:inline">Prova vår receptionist</span>
              <span className="sm:hidden">Prova</span>
            </Button>
          </div>
        </div>
      </div>
      <ReceptionistModal open={isReceptionistOpen} onOpenChange={setIsReceptionistOpen} />
    </header>
  );
};