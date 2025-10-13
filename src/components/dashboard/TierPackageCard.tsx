import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { PackageData } from "./PackagesData";
import { useUserProducts } from "@/hooks/useUserProducts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart as CartIcon } from "lucide-react";
import { EnterpriseContactModal } from "@/components/EnterpriseContactModal";

interface TierPackageCardProps {
  package: PackageData;
}

export function TierPackageCard({ package: pkg }: TierPackageCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'pro' | 'business' | 'enterprise'>('pro');
  const [selectedMinutes, setSelectedMinutes] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnterpriseModalOpen, setIsEnterpriseModalOpen] = useState(false);
  const { hasProduct } = useUserProducts();
  const { toast } = useToast();
  const { addItem } = useCart();
  
  const userOwnsPackage = hasProduct(pkg.id);
  const minuteOptions = pkg.hasMinutes ? [100, 250, 500, 1000] : [];

  const getCurrentPrice = () => {
    if (!pkg.tiers) return null;
    
    const tier = pkg.tiers.find(t => t.name === selectedTier);
    if (!tier) return null;

    if (pkg.hasMinutes && pkg.minutePricing && selectedMinutes) {
      const pricing = pkg.minutePricing[selectedMinutes];
      if (pricing) {
        return selectedTier === 'enterprise' ? pricing.enterprise : pricing[selectedTier];
      }
    }

    return tier.price;
  };

  const getCurrentPriceId = () => {
    // För paket med minut-baserad prissättning (Krono & Gastro)
    if (pkg.stripePriceIds && pkg.hasMinutes) {
      const tierPrices = pkg.stripePriceIds[selectedTier];
      if (tierPrices && selectedMinutes) {
        return tierPrices[selectedMinutes];
      }
    }
    
    // För paket med tier-baserad prissättning (Talent, Lead, Thor)
    if (pkg.tiers) {
      const tier = pkg.tiers.find(t => t.name === selectedTier);
      return tier?.stripePriceId;
    }
    
    return null;
  };

  const handlePurchase = async () => {
    if (selectedTier === 'enterprise') {
      setIsEnterpriseModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Logga in",
          description: "Du måste vara inloggad för att köpa paket.",
          variant: "destructive"
        });
        return;
      }

      const priceId = getCurrentPriceId();
      
      if (!priceId) {
        console.error('[CHECKOUT] No price ID found', { 
          packageId: pkg.id, 
          tier: selectedTier, 
          minutes: selectedMinutes,
          hasStripePriceIds: !!pkg.stripePriceIds,
          hasTiers: !!pkg.tiers
        });
        toast({
          title: "Pris-ID saknas",
          description: "Kontakta support för detta paket.",
          variant: "destructive"
        });
        return;
      }

      console.log('[CHECKOUT] Starting checkout', {
        packageId: pkg.id,
        tier: selectedTier,
        minutes: pkg.hasMinutes ? selectedMinutes : undefined,
        priceId
      });

      const { data, error } = await supabase.functions.invoke('create-payment-session', {
        body: {
          priceId,
          productId: pkg.id,
          tier: selectedTier,
          minutes: pkg.hasMinutes ? selectedMinutes : undefined,
          quantity: 1
        }
      });

      if (error) {
        console.error('[CHECKOUT] Error from edge function:', error);
        throw error;
      }

      if (data?.url) {
        console.log('[CHECKOUT] Redirecting to:', data.url);
        window.open(data.url, '_blank');
      } else {
        console.error('[CHECKOUT] No URL returned:', data);
        throw new Error('Ingen checkout-URL returnerades');
      }
    } catch (error) {
      console.error('[CHECKOUT] Purchase error:', error);
      toast({
        title: "Ett fel uppstod",
        description: "Kunde inte starta köpprocessen. Försök igen.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentPrice = getCurrentPrice();

  return (
    <>
      <EnterpriseContactModal 
        open={isEnterpriseModalOpen} 
        onOpenChange={setIsEnterpriseModalOpen}
        productName={pkg.fullName}
      />
      
      <Card className={`group relative overflow-hidden border-2 border-transparent bg-gradient-to-br ${pkg.gradientFrom} ${pkg.gradientTo} backdrop-blur-sm hover:border-primary/30 hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl h-full flex flex-col`}>
        {/* Badges */}
        {userOwnsPackage && (
          <Badge className="absolute top-4 right-4 bg-primary z-10">
            Äger
          </Badge>
        )}
        
        {pkg.badge && !userOwnsPackage && (
          <Badge className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-primary z-10">
            {pkg.badge}
          </Badge>
        )}

      <CardHeader className="space-y-3">
        <div className={`w-14 h-14 rounded-xl ${pkg.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}>
          {pkg.icon}
        </div>
        <CardTitle className="text-2xl font-display">{pkg.name}</CardTitle>
        <p className="text-sm text-muted-foreground leading-relaxed">{pkg.tagline}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tier Selection */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Välj nivå:</p>
          <div className="flex gap-2">
            {pkg.tiers?.map((tier) => (
              <Button
                key={tier.name}
                variant={selectedTier === tier.name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTier(tier.name)}
                className="flex-1 capitalize"
              >
                {tier.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Minute Slider for Krono & Gastro */}
        {pkg.hasMinutes && selectedTier !== 'enterprise' && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Antal minuter: {selectedMinutes}</p>
            <Slider
              value={[minuteOptions.indexOf(selectedMinutes)]}
              onValueChange={(value) => setSelectedMinutes(minuteOptions[value[0]])}
              max={minuteOptions.length - 1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              {minuteOptions.map((min) => (
                <span key={min}>{min}</span>
              ))}
            </div>
          </div>
        )}

        {/* Current Price */}
        <div className="py-6 border-t border-b">
          <p className="text-sm text-muted-foreground mb-1">Pris</p>
          <p className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {typeof currentPrice === 'number' ? `${currentPrice.toLocaleString('sv-SE')} kr` : currentPrice}
          </p>
          {typeof currentPrice === 'number' && <span className="text-sm font-normal text-muted-foreground">per månad</span>}
        </div>

        {/* Features Preview - Use topFeatures */}
        <div className="space-y-3 flex-1">
          <p className="text-sm font-medium text-muted-foreground">Inkluderar:</p>
          {pkg.topFeatures.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="mt-0.5">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
              </div>
              <span className="text-sm leading-relaxed">{feature}</span>
            </div>
          ))}
        </div>

        {/* Expand/Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full"
        >
          {isExpanded ? (
            <>
              Visa mindre <ChevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Visa alla funktioner <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        {/* Expanded Features */}
        {isExpanded && (
          <div className="space-y-2 pt-2 border-t">
            {pkg.tiers?.find(t => t.name === selectedTier)?.features.slice(3).map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        )}

        {/* Purchase Button */}
        <div className="flex gap-2">
          <Button
            onClick={() => {
              const price = getCurrentPrice();
              const priceId = getCurrentPriceId();
              
              if (typeof price !== 'number' || !priceId) {
                toast({
                  title: "Fel",
                  description: "Kunde inte hitta prisinformation",
                  variant: "destructive"
                });
                return;
              }

              addItem({
                productId: pkg.id,
                productName: pkg.name,
                tier: selectedTier,
                minutes: pkg.hasMinutes ? selectedMinutes : undefined,
                price,
                priceId
              });

              toast({
                title: "Tillagd i kundvagn",
                description: `${pkg.name} (${selectedTier}) har lagts till i kundvagnen`
              });
            }}
            disabled={userOwnsPackage}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            <CartIcon className="mr-2 h-4 w-4" />
            Lägg i kundvagn
          </Button>
          
          <Button
            onClick={handlePurchase}
            disabled={userOwnsPackage || isLoading}
            className="flex-1"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Laddar...
              </>
            ) : userOwnsPackage ? (
              "Äger redan"
            ) : (
              "Köp nu"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
    </>
  );
}
