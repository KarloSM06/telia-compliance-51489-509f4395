import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart as CartIcon, Trash2, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
export interface CartItem {
  productId: string;
  productName: string;
  tier?: string;
  minutes?: number;
  price: number;
  priceId: string;
}
interface ShoppingCartProps {
  items: CartItem[];
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}
export function ShoppingCart({
  items,
  onRemoveItem,
  onClearCart
}: ShoppingCartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  const itemCount = items.length;
  const handleCheckout = () => {
    if (!user) {
      toast.error("Du måste logga in för att genomföra köp");
      navigate("/auth");
      return;
    }
    if (items.length === 0) {
      toast.error("Kundvagnen är tom");
      return;
    }
    navigate("/checkout");
    setIsOpen(false);
  };
  return <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Kundvagn</span>
            {itemCount > 0 && <Button variant="ghost" size="sm" onClick={onClearCart} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Töm
              </Button>}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-4">
          {items.length === 0 ? <div className="text-center py-12">
              <CartIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Din kundvagn är tom</p>
            </div> : <>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {items.map((item, index) => <Card key={`${item.productId}-${index}`} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.productName}</h4>
                        {item.tier && <p className="text-sm text-muted-foreground">
                            Nivå: {item.tier}
                          </p>}
                        {item.minutes && <p className="text-sm text-muted-foreground">
                            Minuter: {item.minutes}
                          </p>}
                        <p className="font-bold mt-2">{item.price.toLocaleString('sv-SE')} kr</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => onRemoveItem(item.productId)} className="text-muted-foreground hover:text-destructive">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>)}
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Totalt:</span>
                  <span>{totalPrice.toLocaleString('sv-SE')} kr</span>
                </div>

                <Button onClick={handleCheckout} className="w-full" size="lg">
                  Gå till kassan
                </Button>
              </div>
            </>}
        </div>
      </SheetContent>
    </Sheet>;
}