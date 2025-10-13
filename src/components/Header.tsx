import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, removeItem, clearCart } = useCart();
  const [email, setEmail] = useState("");
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [isReceptionistOpen, setIsReceptionistOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

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
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="mx-auto max-w-[1400px] px-8 lg:px-12">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <img src={hiems_logo} alt="Hiems logo" className="h-14 w-14 rounded-xl shadow-md" />
              <span className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Hiems</span>
            </button>
          </div>
          
          {/* Desktop Navigation */}
          {!user && (
            <nav className="hidden lg:flex items-center space-x-8">
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
          
          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-accent rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <ShoppingCart 
                items={items} 
                onRemoveItem={removeItem} 
                onClearCart={clearCart}
              />
              
              {user ? (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </Button>
                  <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all" onClick={() => navigate("/dashboard")}>
                    <AvatarFallback className="bg-gradient-gold text-primary font-semibold text-lg">
                      {getInitials(user.email || "")}
                    </AvatarFallback>
                  </Avatar>
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
                Prova vår receptionist
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-3">
              <ShoppingCart 
                items={items} 
                onRemoveItem={removeItem} 
                onClearCart={clearCart}
              />
              
              {!user && (
                <>
                  <a href="/om-oss" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2">
                    Om oss
                  </a>
                  <a href="/regelverk" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2">
                    Regelverk
                  </a>
                  <button 
                    onClick={() => setIsNewsletterOpen(true)}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 text-left"
                  >
                    Nyhetsbrev
                  </button>
                </>
              )}
              
              {user ? (
                <>
                  <div className="flex items-center gap-3 py-2">
                    <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                      <AvatarFallback className="bg-gradient-gold text-primary font-semibold">
                        {getInitials(user.email || "")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground truncate">{user.email}</span>
                  </div>
                  <Button variant="ghost" onClick={() => navigate("/dashboard")} className="justify-start">
                    Dashboard
                  </Button>
                  <Button variant="ghost" onClick={handleAuthClick} className="justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logga ut
                  </Button>
                </>
              ) : (
                <Button variant="ghost" onClick={handleAuthClick} className="justify-start">
                  Logga in
                </Button>
              )}
              
              <Button 
                className="bg-gradient-gold text-primary hover:shadow-glow transition-all duration-300 font-semibold w-full"
                onClick={() => {
                  setIsReceptionistOpen(true);
                  setIsMobileMenuOpen(false);
                }}
              >
                Prova vår receptionist
              </Button>
            </div>
          </div>
        )}
      </div>
      <ReceptionistModal open={isReceptionistOpen} onOpenChange={setIsReceptionistOpen} />
    </header>
  );
};