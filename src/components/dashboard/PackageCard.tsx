import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, Info, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUserProducts } from "@/hooks/useUserProducts";

export interface PackageData {
  id: string;
  name: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  icon: React.ReactNode;
  color: string;
  detailedDescription: string;
  stripePriceId: string;
  price: number;
}

interface PackageCardProps {
  package: PackageData;
}

export function PackageCard({ package: pkg }: PackageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { hasProduct } = useUserProducts();
  
  const isOwned = hasProduct(pkg.id);

  const handlePurchase = async () => {
    try {
      setIsLoading(true);
      
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData?.session) {
        toast.error("Du måste vara inloggad för att köpa");
        return;
      }

      const { data, error } = await supabase.functions.invoke("create-payment-session", {
        body: { 
          priceId: pkg.stripePriceId,
          productId: pkg.id
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        toast.success("Omdirigerar till Stripe Checkout...");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Något gick fel. Försök igen.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-elegant hover:scale-105 ${
        isHovered ? "border-primary" : ""
      } ${isOwned ? "border-2 border-success" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isOwned && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-success text-success-foreground flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Äger
          </Badge>
        </div>
      )}
      {!isOwned && pkg.isPopular && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-gradient-gold text-primary font-semibold">
            Populär
          </Badge>
        </div>
      )}

      <CardHeader>
        <div className={`p-3 rounded-lg ${pkg.color} w-fit mb-3`}>
          {pkg.icon}
        </div>
        <CardTitle className="text-xl">{pkg.name}</CardTitle>
        <CardDescription>{pkg.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          {pkg.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-foreground">{pkg.price} kr</span>
            <span className="text-sm text-muted-foreground">/månad</span>
          </div>
        </div>

        {isOwned ? (
          <Button 
            disabled
            variant="outline"
            className="w-full mb-2"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Äger redan
          </Button>
        ) : (
          <Button 
            onClick={handlePurchase} 
            disabled={isLoading}
            className="w-full mb-2"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isLoading ? "Laddar..." : "Köp nu"}
          </Button>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full group">
              <Info className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Läs mer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-3">
                <div className={`p-2 rounded-lg ${pkg.color}`}>
                  {pkg.icon}
                </div>
                {pkg.name}
              </DialogTitle>
              <DialogDescription className="text-base mt-4">
                {pkg.detailedDescription}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6">
              <h4 className="font-semibold mb-3">Funktioner:</h4>
              <div className="grid gap-3">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
