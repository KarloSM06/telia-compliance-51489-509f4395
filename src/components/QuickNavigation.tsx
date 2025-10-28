import { Zap, Package, MessageSquare, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { smoothScrollToElement } from "@/lib/smoothScroll";
export const QuickNavigation = () => {
  const scrollToSection = (id: string) => {
    smoothScrollToElement(id, { offset: 80 });
  };
  return <div className="fixed bottom-8 right-8 z-50 hidden lg:flex flex-col gap-3">
      <Button onClick={() => scrollToSection('products')} size="icon" className="rounded-full shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-110 bg-primary hover:bg-primary/90" title="Se produkter">
        <Package className="h-5 w-5" />
      </Button>
      
      <Button onClick={() => scrollToSection('contact')} size="icon" className="rounded-full shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-110 bg-secondary hover:bg-secondary/90" title="Kontakta oss">
        <Phone className="h-5 w-5" />
      </Button>
    </div>;
};