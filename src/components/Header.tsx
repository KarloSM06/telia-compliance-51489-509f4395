import { Button } from "@/components/ui/button";
import { LogOut, Menu, X, Settings, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import hiems_logo from "@/assets/hiems_snowflake_logo.png";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header className={cn(
      "sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border",
      "transition-all duration-300",
      isScrolled ? "shadow-elegant py-2" : "shadow-sm py-4"
    )}>
      <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-16">
        <div className={cn(
          "flex items-center justify-between transition-all duration-300",
          isScrolled ? "h-16" : "h-24"
        )}>
          <div className="flex items-center">
            <button 
              onClick={() => navigate("/")}
              className="flex flex-col group transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center space-x-3">
                <img 
                  src={hiems_logo} 
                  alt="Hiems logo" 
                  className="h-14 w-14 rounded-xl shadow-md transition-all duration-300 group-hover:shadow-glow group-hover:rotate-3" 
                />
                <span className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent transition-all duration-300 group-hover:tracking-wide">
                  Hiems
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground ml-[4.5rem] mt-1">
                Skräddarsydda AI-ekosystem som transformerar ditt företag
              </span>
            </button>
          </div>
          
          {/* Desktop Navigation */}
          {!user && (
            <nav className="hidden lg:flex items-center space-x-10">
              <a href="/" className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
                Hem
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-gold transition-all duration-300 group-hover:w-full" />
              </a>
              <button 
                onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
                className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
              >
                Lösningar
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-gold transition-all duration-300 group-hover:w-full" />
              </button>
              <button 
                onClick={() => document.getElementById('industries')?.scrollIntoView({ behavior: 'smooth' })}
                className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
              >
                Bransch
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-gold transition-all duration-300 group-hover:w-full" />
              </button>
              <button 
                onClick={() => document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' })}
                className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
              >
                Case
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-gold transition-all duration-300 group-hover:w-full" />
              </button>
              <a href="/om-oss" className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group">
                Om oss
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-gold transition-all duration-300 group-hover:w-full" />
              </a>
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
              >
                Kontakt
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-gold transition-all duration-300 group-hover:w-full" />
              </button>
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
              <div className="relative">
                <ShoppingCart 
                  items={items} 
                  onRemoveItem={removeItem} 
                  onClearCart={clearCart}
                />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-gold text-primary text-xs font-bold flex items-center justify-center shadow-button animate-scale-in">
                    {items.length}
                  </span>
                )}
              </div>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-11 w-11 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/60 transition-all duration-300 hover:scale-110">
                      <AvatarFallback className="bg-gradient-gold text-primary font-semibold text-lg">
                        {getInitials(user.email || "")}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">Mitt konto</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/gdpr-settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      Inställningar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleAuthClick} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logga ut
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="sm" onClick={handleAuthClick}>
                  Logga in
                </Button>
              )}
              <Button 
                className="relative overflow-hidden bg-gradient-gold text-primary hover:shadow-glow hover:scale-105 transition-all duration-300 font-semibold before:absolute before:inset-0 before:bg-white/20 before:translate-x-[-100%] before:transition-transform before:duration-500 hover:before:translate-x-[100%]"
                onClick={() => setIsReceptionistOpen(true)}
                size="sm"
              >
                Boka demo
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border shadow-elegant animate-fade-in">
            <div className="mx-auto max-w-[1440px] px-6 py-6">
              <div className="flex flex-col gap-4">
              <ShoppingCart 
                items={items} 
                onRemoveItem={removeItem} 
                onClearCart={clearCart}
              />
              
              {!user && (
                <>
                  <a href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                    Hem
                  </a>
                  <button 
                    onClick={() => {
                      document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' });
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 text-left"
                  >
                    Lösningar
                  </button>
                  <button 
                    onClick={() => {
                      document.getElementById('industries')?.scrollIntoView({ behavior: 'smooth' });
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 text-left"
                  >
                    Bransch
                  </button>
                  <button 
                    onClick={() => {
                      document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' });
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 text-left"
                  >
                    Case
                  </button>
                  <a href="/om-oss" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                    Om oss
                  </a>
                  <button 
                    onClick={() => {
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 text-left"
                  >
                    Kontakt
                  </button>
                </>
              )}
              
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 py-2">
                    <Avatar className="h-11 w-11 ring-2 ring-primary/20">
                      <AvatarFallback className="bg-gradient-gold text-primary font-semibold text-lg">
                        {getInitials(user.email || "")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Mitt konto</span>
                      <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      navigate("/dashboard");
                      setIsMobileMenuOpen(false);
                    }} 
                    className="justify-start w-full"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      navigate("/gdpr-settings");
                      setIsMobileMenuOpen(false);
                    }} 
                    className="justify-start w-full"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Inställningar
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      handleAuthClick();
                      setIsMobileMenuOpen(false);
                    }} 
                    className="justify-start w-full text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logga ut
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" onClick={handleAuthClick} className="justify-start">
                  Logga in
                </Button>
              )}
              
              <Button 
                className="w-full relative overflow-hidden bg-gradient-gold text-primary hover:shadow-glow transition-all duration-300 font-semibold before:absolute before:inset-0 before:bg-white/20 before:translate-x-[-100%] before:transition-transform before:duration-500 hover:before:translate-x-[100%]"
                onClick={() => {
                  setIsReceptionistOpen(true);
                  setIsMobileMenuOpen(false);
                }}
              >
                Boka demo
              </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ReceptionistModal open={isReceptionistOpen} onOpenChange={setIsReceptionistOpen} />
    </header>
  );
};