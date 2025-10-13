import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, ShoppingBag } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Checkout() {
  const { user } = useAuth();
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error("Du måste vara inloggad för att slutföra köp");
      navigate("/auth");
    }

    if (items.length === 0) {
      toast.error("Din kundvagn är tom");
      navigate("/");
    }
  }, [user, items, navigate]);

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  const handlePayment = async () => {
    if (!user || items.length === 0) return;

    setIsProcessing(true);

    try {
      for (const item of items) {
        const { data, error } = await supabase.functions.invoke('create-payment-session', {
          body: {
            priceId: item.priceId,
            productId: item.productId,
            tier: item.tier,
            minutes: item.minutes,
            quantity: 1,
          },
        });

        if (error) throw error;

        if (data?.url) {
          window.open(data.url, '_blank');
        }
      }

      toast.success("Betalningsfönster öppnade! Slutför ditt köp där.");
      clearCart();
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || "Något gick fel vid betalningen");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <ShoppingBag className="h-8 w-8" />
            <h1 className="text-4xl font-bold">Kassa</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Din beställning</h2>
              {items.map((item, index) => (
                <Card key={`${item.productId}-${index}`} className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">{item.productName}</h3>
                    {item.tier && (
                      <p className="text-sm text-muted-foreground">
                        Nivå: {item.tier}
                      </p>
                    )}
                    {item.minutes && (
                      <p className="text-sm text-muted-foreground">
                        Minuter: {item.minutes}
                      </p>
                    )}
                    <p className="font-bold">{item.price.toLocaleString('sv-SE')} kr</p>
                  </div>
                </Card>
              ))}
            </div>

            <div>
              <Card className="p-6 sticky top-4">
                <h2 className="text-2xl font-semibold mb-6">Sammanfattning</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span>Antal produkter:</span>
                    <span>{items.length}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-4">
                    <span>Totalt:</span>
                    <span>{totalPrice.toLocaleString('sv-SE')} kr</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handlePayment} 
                    disabled={isProcessing}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Bearbetar...
                      </>
                    ) : (
                      "Betala med Stripe"
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => navigate("/")}
                    className="w-full"
                  >
                    Tillbaka till produkter
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Säker betalning via Stripe
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
