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

interface TierPackageCardProps {
  package: PackageData;
}

export function TierPackageCard({ package: pkg }: TierPackageCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'pro' | 'business' | 'enterprise'>('pro');
  const [selectedMinutes, setSelectedMinutes] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const { hasProduct } = useUserProducts();
  const { toast } = useToast();
  
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

  const handlePurchase = async () => {
    if (selectedTier === 'enterprise') {
      toast({
        title: "Kontakta oss för offert",
        description: "Vi hör av oss inom kort för att diskutera era behov."
      });
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

      const tier = pkg.tiers?.find(t => t.name === selectedTier);
      if (!tier?.stripePriceId) {
        toast({
          title: "Pris-ID saknas",
          description: "Kontakta support för detta paket.",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-payment-session', {
        body: {
          priceId: tier.stripePriceId,
          productId: pkg.id,
          tier: selectedTier,
          minutes: pkg.hasMinutes ? selectedMinutes : undefined,
          quantity: 1
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Purchase error:', error);
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
    <Card className={`relative ${userOwnsPackage ? 'border-2 border-primary' : ''} hover:shadow-lg transition-all`}>
      {userOwnsPackage && (
        <Badge className="absolute top-4 right-4 bg-primary">
          Äger
        </Badge>
      )}
      
      {pkg.isPopular && !userOwnsPackage && (
        <Badge className="absolute top-4 right-4 bg-gradient-gold">
          Populär
        </Badge>
      )}

      <CardHeader>
        <div className={`w-12 h-12 rounded-lg ${pkg.color} flex items-center justify-center mb-3`}>
          {pkg.icon}
        </div>
        <CardTitle className="text-xl">{pkg.name}</CardTitle>
        <CardDescription>{pkg.description}</CardDescription>
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
        <div className="py-4 border-t border-b">
          <p className="text-3xl font-bold">
            {typeof currentPrice === 'number' ? `${currentPrice} kr` : currentPrice}
            {typeof currentPrice === 'number' && <span className="text-sm font-normal text-muted-foreground">/mån</span>}
          </p>
        </div>

        {/* Features Preview */}
        <div className="space-y-2">
          {pkg.tiers?.find(t => t.name === selectedTier)?.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
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
        <Button
          onClick={handlePurchase}
          disabled={userOwnsPackage || isLoading}
          className="w-full"
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
      </CardContent>
    </Card>
  );
}
