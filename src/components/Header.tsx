import { Button } from "@/components/ui/button";
import { LogOut, Menu, X, Settings, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import hiems_logo from "@/assets/hiems_snowflake_logo.png";
import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ReceptionistModal } from "@/components/ReceptionistModal";
import { ConsultationModal } from "@/components/ConsultationModal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart } from "@/components/cart/ShoppingCart";
import { useCart } from "@/hooks/useCart";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
export const Header = () => {
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    items,
    removeItem,
    clearCart
  } = useCart();
  const [email, setEmail] = useState("");
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [isReceptionistOpen, setIsReceptionistOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowStickyCTA(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
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
      description: "Du kommer snart få vårt nyhetsbrev."
    });
    setEmail("");
    setIsNewsletterOpen(false);
  };
  return <header className={cn(
      "sticky top-0 z-50 transition-all duration-500",
      "bg-background/60 backdrop-blur-2xl",
      "border-b border-border/50",
      isScrolled 
        ? "shadow-elegant py-3" 
        : "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] py-5"
    )}>
      <div className="mx-auto max-w-[1440px] px-6 md:px-8 lg:px-16">
        <div className={cn(
          "flex items-center justify-between transition-all duration-500",
          isScrolled ? "h-14" : "h-20"
        )}>
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => navigate("/")} 
              className="flex items-center gap-4 group transition-all duration-500 hover:scale-[1.03]"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-2xl" />
                <img 
                  src={hiems_logo} 
                  alt="Hiems logo" 
                  className={cn(
                    "rounded-2xl shadow-card transition-all duration-500",
                    "group-hover:shadow-glow group-hover:rotate-6",
                    isScrolled ? "h-11 w-11" : "h-14 w-14"
                  )} 
                />
              </div>
              <div className="flex flex-col items-start">
                <span className={cn(
                  "font-bold bg-gradient-primary bg-clip-text text-transparent",
                  "transition-all duration-500 group-hover:tracking-wider",
                  isScrolled ? "text-2xl" : "text-3xl"
                )}>
                  Hiems
                </span>
                <span className={cn(
                  "hidden xl:block text-muted-foreground font-medium transition-all duration-500",
                  isScrolled ? "text-[9px] -mt-0.5" : "text-[10px] -mt-1"
                )}>
                  Skräddarsydda AI-ekosystem
                </span>
              </div>
            </button>
          </div>
          
          {/* Desktop Navigation */}
          {!user && (
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { label: 'Hem', action: () => navigate("/") },
                { label: 'Lösningar', action: () => scrollToSection('paket') },
                { label: 'Bransch', action: () => scrollToSection('branscher') },
                { label: 'Case', action: () => scrollToSection('case') },
                { label: 'Om oss', href: '/om-oss' },
                { label: 'Kontakt', action: () => scrollToSection('kontakt') },
              ].map((item, idx) => (
                item.href ? (
                  <a
                    key={idx}
                    href={item.href}
                    className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 group"
                  >
                    <span className="relative z-10">{item.label}</span>
                    <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-10 rounded-lg transition-all duration-300 scale-90 group-hover:scale-100" />
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-gold group-hover:w-1/2 transition-all duration-300" />
                  </a>
                ) : (
                  <button
                    key={idx}
                    onClick={item.action}
                    className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 group"
                  >
                    <span className="relative z-10">{item.label}</span>
                    <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-10 rounded-lg transition-all duration-300 scale-90 group-hover:scale-100" />
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-gold group-hover:w-1/2 transition-all duration-300" />
                  </button>
                )
              ))}
            </nav>
          )}
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="lg:hidden p-2.5 hover:bg-accent/10 rounded-xl transition-all duration-300 hover:scale-110 group"
              aria-label="Toggle menu"
            >
              <div className="relative">
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
                ) : (
                  <Menu className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                )}
              </div>
            </button>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Shopping Cart */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300 rounded-full" />
                <ShoppingCart items={items} onRemoveItem={removeItem} onClearCart={clearCart} />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-gold text-primary text-xs font-bold flex items-center justify-center shadow-button animate-scale-in">
                    {items.length}
                  </span>
                )}
              </div>
              
              {/* User Menu / Login */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative group">
                      <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-full" />
                      <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-primary/10 hover:ring-secondary/60 transition-all duration-500 hover:scale-110 relative z-10">
                        <AvatarFallback className="bg-gradient-gold text-primary font-bold text-base">
                          {getInitials(user.email || "")}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 bg-background/95 backdrop-blur-xl border-border/50">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1.5 py-2">
                        <p className="text-sm font-semibold">Mitt konto</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem 
                      onClick={() => navigate("/dashboard")}
                      className="cursor-pointer py-3 focus:bg-accent/10"
                    >
                      <LayoutDashboard className="mr-3 h-4 w-4" />
                      <span className="font-medium">Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate("/gdpr-settings")}
                      className="cursor-pointer py-3 focus:bg-accent/10"
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      <span className="font-medium">Inställningar</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem 
                      onClick={handleAuthClick} 
                      className="cursor-pointer py-3 text-destructive focus:bg-destructive/10 focus:text-destructive"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <span className="font-medium">Logga ut</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleAuthClick}
                  className="hover:bg-accent/10 transition-all duration-300 hover:scale-105 font-medium"
                >
                  Logga in
                </Button>
              )}
              
              {/* CTA Button */}
              <Button 
                className={cn(
                  "relative overflow-hidden bg-gradient-gold text-primary font-bold",
                  "shadow-button hover:shadow-glow",
                  "transition-all duration-500 hover:scale-105",
                  "before:absolute before:inset-0 before:bg-white/30",
                  "before:translate-x-[-100%] before:skew-x-12",
                  "before:transition-transform before:duration-700",
                  "hover:before:translate-x-[100%]",
                  isScrolled ? "text-xs px-4 py-2 h-9" : "text-sm px-6 py-2.5 h-10"
                )}
                onClick={() => setIsConsultationModalOpen(true)}
              >
                <span className="relative z-10">Boka demo</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-background/80 backdrop-blur-2xl border-b border-border/50 shadow-elegant animate-fade-in overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <div className="mx-auto max-w-[1440px] px-6 py-8 relative z-10">
              <div className="flex flex-col gap-6">
                {/* Shopping Cart */}
                <div className="pb-4 border-b border-border/30">
                  <ShoppingCart items={items} onRemoveItem={removeItem} onClearCart={clearCart} />
                </div>
                
                {/* Navigation Links */}
                {!user && (
                  <nav className="flex flex-col gap-2">
                    {[
                      { label: 'Hem', action: () => navigate("/") },
                      { label: 'Lösningar', action: () => scrollToSection('paket') },
                      { label: 'Bransch', action: () => scrollToSection('branscher') },
                      { label: 'Case', action: () => scrollToSection('case') },
                      { label: 'Om oss', href: '/om-oss' },
                      { label: 'Kontakt', action: () => scrollToSection('kontakt') },
                    ].map((item, idx) => (
                      item.href ? (
                        <a
                          key={idx}
                          href={item.href}
                          className="relative px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 rounded-xl hover:bg-accent/10 group"
                        >
                          <span className="relative z-10">{item.label}</span>
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-gradient-gold group-hover:h-1/2 transition-all duration-300 rounded-r-full" />
                        </a>
                      ) : (
                        <button
                          key={idx}
                          onClick={() => {
                            item.action?.();
                            setIsMobileMenuOpen(false);
                          }}
                          className="relative px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 rounded-xl hover:bg-accent/10 text-left group"
                        >
                          <span className="relative z-10">{item.label}</span>
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-gradient-gold group-hover:h-1/2 transition-all duration-300 rounded-r-full" />
                        </button>
                      )
                    ))}
                  </nav>
                )}
                
                {/* User Menu */}
                {user ? (
                  <div className="space-y-4 pt-4 border-t border-border/30">
                    <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-gradient-to-r from-primary/5 to-transparent">
                      <Avatar className="h-12 w-12 ring-2 ring-secondary/30">
                        <AvatarFallback className="bg-gradient-gold text-primary font-bold text-lg">
                          {getInitials(user.email || "")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">Mitt konto</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {user.email}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          navigate("/dashboard");
                          setIsMobileMenuOpen(false);
                        }} 
                        className="justify-start w-full hover:bg-accent/10 py-6 font-medium"
                      >
                        <LayoutDashboard className="mr-3 h-5 w-5" />
                        Dashboard
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          navigate("/gdpr-settings");
                          setIsMobileMenuOpen(false);
                        }} 
                        className="justify-start w-full hover:bg-accent/10 py-6 font-medium"
                      >
                        <Settings className="mr-3 h-5 w-5" />
                        Inställningar
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          handleAuthClick();
                          setIsMobileMenuOpen(false);
                        }} 
                        className="justify-start w-full text-destructive hover:bg-destructive/10 py-6 font-medium"
                      >
                        <LogOut className="mr-3 h-5 w-5" />
                        Logga ut
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-border/30">
                    <Button 
                      variant="ghost" 
                      onClick={handleAuthClick} 
                      className="justify-start w-full hover:bg-accent/10 py-6 font-medium"
                    >
                      Logga in
                    </Button>
                  </div>
                )}
                
                {/* CTA Button */}
                <Button 
                  className="w-full relative overflow-hidden bg-gradient-gold text-primary shadow-button hover:shadow-glow transition-all duration-500 font-bold py-6 before:absolute before:inset-0 before:bg-white/30 before:translate-x-[-100%] before:skew-x-12 before:transition-transform before:duration-700 hover:before:translate-x-[100%] hover:scale-[1.02]" 
                  onClick={() => {
                    setIsConsultationModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <span className="relative z-10">Boka demo</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ReceptionistModal open={isReceptionistOpen} onOpenChange={setIsReceptionistOpen} />
      <ConsultationModal open={isConsultationModalOpen} onOpenChange={setIsConsultationModalOpen} />
      
      {/* Sticky CTA Button */}
      {showStickyCTA && <div className="fixed bottom-8 right-8 z-50 animate-fade-in">
          
        </div>}
    </header>;
};