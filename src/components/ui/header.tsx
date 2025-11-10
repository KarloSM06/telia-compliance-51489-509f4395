import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Menu, MoveRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ConsultationModal } from "@/components/ConsultationModal";
import { cn } from "@/lib/utils";
import hiems_logo from "@/assets/hiems_snowflake_logo.png";

function Header1() {
  const navigate = useNavigate();
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
    } else {
      // Om sektionen inte finns på aktuell sida -> navigera till startsidan med hash
      navigate(`/#${id}`);
    }
  };

  const navigationItems = [{
    title: "Hem",
    href: "/",
    description: ""
  }, {
    title: "Tjänster",
    description: "Våra AI-lösningar och teknologier",
    items: [{
      title: "AI Receptionist",
      href: "/tjanster/ai-receptionist"
    }, {
      title: "AI Modeller (LLM)",
      href: "/tjanster/ai-modeller"
    }, {
      title: "AI Röstsystem",
      href: "/tjanster/ai-rostsystem"
    }, {
      title: "Automatisering",
      href: "/tjanster/automatisering"
    }, {
      title: "CRM & Analytics",
      href: "/tjanster/crm-analytics"
    }, {
      title: "Offert & Faktura",
      href: "/tjanster/offert-faktura"
    }, {
      title: "Prompt Engineering",
      href: "/tjanster/prompt-engineering"
    }, {
      title: "RAG Agenter",
      href: "/tjanster/rag-agenter"
    }, {
      title: "Totala Ekosystem",
      href: "/tjanster/ekosystem"
    }]
  }, {
    title: "Lösningar",
    description: "Våra skräddarsydda AI-system och paket",
    action: () => scrollToSection('paket'),
    items: [{
      title: "AI-Paket",
      action: () => scrollToSection('paket')
    }, {
      title: "Branschlösningar",
      action: () => scrollToSection('branscher')
    }]
  }, {
    title: "Företag",
    description: "Mer om Hiems och vårt arbete",
    items: [{
      title: "Om oss",
      href: "/about"
    }, {
      title: "Kontakt",
      action: () => scrollToSection('kontakt')
    }]
  }];

  const [isOpen, setOpen] = useState(false);
  
  return <>
    <header className="w-full z-40 fixed top-0 left-0 transition-all duration-500">
      <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center">
        <div className="justify-start items-center gap-2 lg:flex hidden flex-row">
          {navigationItems.map(item => item.href ? 
            <Link key={item.title} to={item.href}>
              <Button variant="outline" className="hover:bg-gradient-gold hover:text-primary hover:border-primary/20 transition-all duration-300 font-medium rounded-xl">
                {item.title}
              </Button>
            </Link> : item.action ? 
            <Button key={item.title} variant="outline" onClick={item.action} className="hover:bg-gradient-gold hover:text-primary hover:border-primary/20 transition-all duration-300 font-medium rounded-xl">
              {item.title}
            </Button> : 
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
                        <Button size="sm" className="mt-10 bg-gradient-gold text-primary hover:shadow-glow transition-all duration-300 rounded-xl" onClick={() => setIsConsultationModalOpen(true)}>
                          Boka demo
                        </Button>
                      </div>
                      <div className="flex flex-col text-sm h-full justify-end gap-1">
                        {item.items?.map(subItem => subItem.href ? 
                          <Link key={subItem.title} to={subItem.href}>
                            <Button variant="ghost" className="w-full justify-between hover:bg-muted rounded-xl">
                              <span>{subItem.title}</span>
                              <MoveRight className="w-4 h-4 text-muted-foreground" />
                            </Button>
                          </Link> : 
                          <Button key={subItem.title} variant="ghost" onClick={subItem.action} className="w-full justify-between hover:bg-muted rounded-xl">
                            <span>{subItem.title}</span>
                            <MoveRight className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </div>
        
        {/* Logo */}
        <div className="flex lg:justify-center">
          <button onClick={() => navigate("/")} className="flex items-center gap-3 group transition-all duration-500 hover:scale-[1.03]">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-2xl" />
              <img src={hiems_logo} alt="Hiems logo" className={cn("rounded-2xl shadow-card transition-all duration-500", "group-hover:shadow-glow group-hover:rotate-6", scrollY > 20 ? "h-10 w-10" : "h-12 w-12")} />
            </div>
            <span className={cn("font-bold bg-gradient-primary bg-clip-text text-transparent", "transition-all duration-500 group-hover:tracking-wider", scrollY > 20 ? "text-xl" : "text-2xl")}>
              Hiems
            </span>
          </button>
        </div>
        
        {/* Right side actions */}
        <div className="flex justify-end w-full gap-4">
          <Button className={cn("hidden md:inline relative overflow-hidden bg-gradient-gold text-primary font-bold", "shadow-button hover:shadow-glow", "transition-all duration-500 hover:scale-105", "before:absolute before:inset-0 before:bg-white/30", "before:translate-x-[-100%] before:skew-x-12", "before:transition-transform before:duration-700", "hover:before:translate-x-[100%]")} onClick={() => setIsConsultationModalOpen(true)}>
            <span className="relative z-10">Boka demo</span>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex w-12 shrink lg:hidden items-end justify-end">
          <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          {isOpen && 
            <div className="absolute top-20 border-t flex flex-col w-full right-0 bg-background/95 backdrop-blur-2xl shadow-lg py-4 container gap-8 animate-fade-in">
              {navigationItems.map(item => 
                <div key={item.title}>
                  <div className="flex flex-col gap-2">
                    {item.href ? 
                      <Link to={item.href} onClick={() => setOpen(false)} className="flex justify-between items-center hover:bg-accent/10 p-2 rounded transition-all duration-300">
                        <span className="text-lg font-medium">{item.title}</span>
                        <MoveRight className="w-4 h-4 stroke-1 text-muted-foreground" />
                      </Link> : item.action ? 
                      <button onClick={() => {
                        item.action();
                        setOpen(false);
                      }} className="flex justify-between items-center hover:bg-accent/10 p-2 rounded transition-all duration-300 text-left">
                        <span className="text-lg font-medium">{item.title}</span>
                        <MoveRight className="w-4 h-4 stroke-1 text-muted-foreground" />
                      </button> : 
                      <p className="text-lg font-medium p-2">{item.title}</p>
                    }
                    {item.items && item.items.map(subItem => subItem.href ? 
                      <Link key={subItem.title} to={subItem.href} onClick={() => setOpen(false)} className="flex justify-between items-center hover:bg-accent/10 p-2 rounded transition-all duration-300 pl-4">
                        <span className="text-muted-foreground">
                          {subItem.title}
                        </span>
                        <MoveRight className="w-4 h-4 stroke-1" />
                      </Link> : 
                      <button key={subItem.title} onClick={() => {
                        subItem.action?.();
                        setOpen(false);
                      }} className="flex justify-between items-center hover:bg-accent/10 p-2 rounded transition-all duration-300 pl-4 text-left">
                        <span className="text-muted-foreground">
                          {subItem.title}
                        </span>
                        <MoveRight className="w-4 h-4 stroke-1" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* CTA Button - Mobile */}
              <Button className="w-full relative overflow-hidden bg-gradient-gold text-primary shadow-button hover:shadow-glow transition-all duration-500 font-bold py-6 before:absolute before:inset-0 before:bg-white/30 before:translate-x-[-100%] before:skew-x-12 before:transition-transform before:duration-700 hover:before:translate-x-[100%] hover:scale-[1.02]" onClick={() => {
                setIsConsultationModalOpen(true);
                setOpen(false);
              }}>
                <span className="relative z-10">Boka demo</span>
              </Button>
            </div>
          }
        </div>
      </div>
    </header>
    
    <ConsultationModal open={isConsultationModalOpen} onOpenChange={setIsConsultationModalOpen} />
  </>;
}

export { Header1 };
