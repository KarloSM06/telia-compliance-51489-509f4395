import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, MoveRight, X, ShoppingCart as CartIcon, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart } from "@/components/cart/ShoppingCart";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConsultationModal } from "@/components/ConsultationModal";
import { cn } from "@/lib/utils";
import hiems_logo from "@/assets/hiems_snowflake_logo.png";

function Header1() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { items, removeItem, clearCart } = useCart();
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  const navigationItems = [
    {
      title: "Hem",
      href: "/",
      description: "",
    },
    {
      title: "Lösningar",
      description: "Våra skräddarsydda AI-system och paket",
      action: () => scrollToSection('paket'),
      items: [
        {
          title: "AI-Paket",
          action: () => scrollToSection('paket'),
        },
        {
          title: "Branschlösningar",
          action: () => scrollToSection('branscher'),
        },
        {
          title: "Case Studies",
          action: () => scrollToSection('case'),
        },
      ],
    },
    {
      title: "Företag",
      description: "Mer om Hiems och vårt arbete",
      items: [
        {
          title: "Om oss",
          href: "/about",
        },
        {
          title: "Kontakt",
          action: () => scrollToSection('kontakt'),
        },
      ],
    },
  ];

  const [isOpen, setOpen] = useState(false);
  
  return (
    <>
    <header className="w-full z-40 fixed top-0 left-0 transition-all duration-500">
        <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center">
          <div className="justify-start items-center gap-2 lg:flex hidden flex-row">
            {navigationItems.map((item) => (
              item.href ? (
                <Link key={item.title} to={item.href}>
                  <Button 
                    variant="outline" 
                    className="hover:bg-gradient-gold hover:text-primary hover:border-primary/20 transition-all duration-300 font-medium rounded-xl"
                  >
                    {item.title}
                  </Button>
                </Link>
              ) : item.action ? (
                <Button 
                  key={item.title}
                  variant="outline" 
                  onClick={item.action}
                  className="hover:bg-gradient-gold hover:text-primary hover:border-primary/20 transition-all duration-300 font-medium rounded-xl"
                >
                  {item.title}
                </Button>
              ) : (
                <NavigationMenu key={item.title}>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="font-medium text-sm hover:bg-gradient-gold hover:text-primary transition-all duration-300 rounded-xl border border-input">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="!w-[450px] p-4">
                        <div className="flex flex-col lg:grid grid-cols-2 gap-4">
                          <div className="flex flex-col h-full justify-between">
                            <div className="flex flex-col">
                              <p className="text-base font-semibold">{item.title}</p>
                              <p className="text-muted-foreground text-sm mt-1">
                                {item.description}
                              </p>
                            </div>
                            <Button 
                              size="sm" 
                              className="mt-10 bg-gradient-gold text-primary hover:shadow-glow transition-all duration-300 rounded-xl"
                              onClick={() => setIsConsultationModalOpen(true)}
                            >
                              Boka demo
                            </Button>
                          </div>
                          <div className="flex flex-col text-sm h-full justify-end gap-1">
                            {item.items?.map((subItem) => (
                              subItem.href ? (
                                <Link
                                  key={subItem.title}
                                  to={subItem.href}
                                >
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-between hover:bg-muted rounded-xl"
                                  >
                                    <span>{subItem.title}</span>
                                    <MoveRight className="w-4 h-4 text-muted-foreground" />
                                  </Button>
                                </Link>
                              ) : (
                                <Button
                                  key={subItem.title}
                                  variant="ghost"
                                  onClick={subItem.action}
                                  className="w-full justify-between hover:bg-muted rounded-xl"
                                >
                                  <span>{subItem.title}</span>
                                  <MoveRight className="w-4 h-4 text-muted-foreground" />
                                </Button>
                              )
                            ))}
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              )
            ))}
          </div>
          
          {/* Logo */}
          <div className="flex lg:justify-center">
            <button 
              onClick={() => navigate("/")} 
              className="flex items-center gap-3 group transition-all duration-500 hover:scale-[1.03]"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-2xl" />
                <img 
                  src={hiems_logo} 
                  alt="Hiems logo" 
                  className={cn(
                    "rounded-2xl shadow-card transition-all duration-500",
                    "group-hover:shadow-glow group-hover:rotate-6",
                    scrollY > 20 ? "h-10 w-10" : "h-12 w-12"
                  )}
                />
              </div>
              <span className={cn(
                "font-bold bg-gradient-primary bg-clip-text text-transparent",
                "transition-all duration-500 group-hover:tracking-wider",
                scrollY > 20 ? "text-xl" : "text-2xl"
              )}>
                Hiems
              </span>
            </button>
          </div>
          
          {/* Right side actions */}
          <div className="flex justify-end w-full gap-4">
            {/* Shopping Cart - Desktop */}
            <div className="hidden md:flex relative group">
              <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300 rounded-full" />
              <ShoppingCart items={items} onRemoveItem={removeItem} onClearCart={clearCart} />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-gold text-primary text-xs font-bold flex items-center justify-center shadow-button animate-scale-in">
                  {items.length}
                </span>
              )}
            </div>

            {/* User Menu / Login - Desktop */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative group hidden md:block">
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
                  <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer py-3 focus:bg-accent/10">
                    <LayoutDashboard className="mr-3 h-4 w-4" />
                    <span className="font-medium">Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/gdpr-settings")} className="cursor-pointer py-3 focus:bg-accent/10">
                    <Settings className="mr-3 h-4 w-4" />
                    <span className="font-medium">Inställningar</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem onClick={handleAuthClick} className="cursor-pointer py-3 text-destructive focus:bg-destructive/10 focus:text-destructive">
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-medium">Logga ut</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAuthClick}
                className="hidden md:inline rounded-xl hover:bg-gradient-gold hover:text-primary hover:border-primary/20 transition-all duration-300 hover:scale-105 font-medium"
              >
                Logga in
              </Button>
            )}
            
            <div className="border-r hidden md:inline"></div>
            
            {/* CTA Button */}
            <Button 
              className={cn(
                "hidden md:inline relative overflow-hidden bg-gradient-gold text-primary font-bold",
                "shadow-button hover:shadow-glow",
                "transition-all duration-500 hover:scale-105",
                "before:absolute before:inset-0 before:bg-white/30",
                "before:translate-x-[-100%] before:skew-x-12",
                "before:transition-transform before:duration-700",
                "hover:before:translate-x-[100%]"
              )}
              onClick={() => setIsConsultationModalOpen(true)}
            >
              <span className="relative z-10">Boka demo</span>
            </Button>
          </div>
          {/* Mobile menu toggle */}
          <div className="flex w-12 shrink lg:hidden items-end justify-end">
            <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            {isOpen && (
              <div className="absolute top-20 border-t flex flex-col w-full right-0 bg-background/95 backdrop-blur-2xl shadow-lg py-4 container gap-8 animate-fade-in">
                {/* Shopping Cart - Mobile */}
                <div className="pb-4 border-b border-border/30">
                  <ShoppingCart items={items} onRemoveItem={removeItem} onClearCart={clearCart} />
                </div>

                {navigationItems.map((item) => (
                  <div key={item.title}>
                    <div className="flex flex-col gap-2">
                      {item.href ? (
                        <Link
                          to={item.href}
                          onClick={() => setOpen(false)}
                          className="flex justify-between items-center hover:bg-accent/10 p-2 rounded transition-all duration-300"
                        >
                          <span className="text-lg font-medium">{item.title}</span>
                          <MoveRight className="w-4 h-4 stroke-1 text-muted-foreground" />
                        </Link>
                      ) : item.action ? (
                        <button
                          onClick={() => {
                            item.action();
                            setOpen(false);
                          }}
                          className="flex justify-between items-center hover:bg-accent/10 p-2 rounded transition-all duration-300 text-left"
                        >
                          <span className="text-lg font-medium">{item.title}</span>
                          <MoveRight className="w-4 h-4 stroke-1 text-muted-foreground" />
                        </button>
                      ) : (
                        <p className="text-lg font-medium p-2">{item.title}</p>
                      )}
                      {item.items &&
                        item.items.map((subItem) => (
                          subItem.href ? (
                            <Link
                              key={subItem.title}
                              to={subItem.href}
                              onClick={() => setOpen(false)}
                              className="flex justify-between items-center hover:bg-accent/10 p-2 rounded transition-all duration-300 pl-4"
                            >
                              <span className="text-muted-foreground">
                                {subItem.title}
                              </span>
                              <MoveRight className="w-4 h-4 stroke-1" />
                            </Link>
                          ) : (
                            <button
                              key={subItem.title}
                              onClick={() => {
                                subItem.action?.();
                                setOpen(false);
                              }}
                              className="flex justify-between items-center hover:bg-accent/10 p-2 rounded transition-all duration-300 pl-4 text-left"
                            >
                              <span className="text-muted-foreground">
                                {subItem.title}
                              </span>
                              <MoveRight className="w-4 h-4 stroke-1" />
                            </button>
                          )
                        ))}
                    </div>
                  </div>
                ))}

                {/* User Menu - Mobile */}
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
                          setOpen(false);
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
                          setOpen(false);
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
                          setOpen(false);
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
                      onClick={() => {
                        handleAuthClick();
                        setOpen(false);
                      }} 
                      className="justify-start w-full hover:bg-accent/10 py-6 font-medium"
                    >
                      Logga in
                    </Button>
                  </div>
                )}

                {/* CTA Button - Mobile */}
                <Button 
                  className="w-full relative overflow-hidden bg-gradient-gold text-primary shadow-button hover:shadow-glow transition-all duration-500 font-bold py-6 before:absolute before:inset-0 before:bg-white/30 before:translate-x-[-100%] before:skew-x-12 before:transition-transform before:duration-700 hover:before:translate-x-[100%] hover:scale-[1.02]" 
                  onClick={() => {
                    setIsConsultationModalOpen(true);
                    setOpen(false);
                  }}
                >
                  <span className="relative z-10">Boka demo</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <ConsultationModal 
        open={isConsultationModalOpen} 
        onOpenChange={setIsConsultationModalOpen} 
      />
    </>
  );
}

export { Header1 };
