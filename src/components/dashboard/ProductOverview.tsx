import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Headphones, ChefHat, UserCheck, TrendingUp, MessageSquare } from "lucide-react";
import { useUserProducts } from "@/hooks/useUserProducts";
import { HiemsAdminBadge } from "./HiemsAdminBadge";

const productIcons: Record<string, any> = {
  krono: Headphones,
  gastro: ChefHat,
  talent: UserCheck,
  lead: TrendingUp,
  thor: MessageSquare,
};

const productNames: Record<string, string> = {
  krono: "AI Receptionist",
  gastro: "Restaurang & Café",
  talent: "AI Rekrytering",
  lead: "AI Prospektering",
  thor: "AI Compliance & Coaching",
};

export function ProductOverview() {
  const { productDetails, loading, isAdmin } = useUserProducts();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (productDetails.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold">Dina AI-Produkter</h2>
        {isAdmin && <HiemsAdminBadge />}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {productDetails.map((product) => {
          const Icon = productIcons[product.product_id] || Headphones;
          const productName = productNames[product.product_id] || product.product_id;

          return (
            <Card key={product.id} className="hover:shadow-lg transition-all group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{productName}</CardTitle>
                    </div>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {product.tier || "Pro"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {product.minutes_purchased && (
                    <p>📞 {product.minutes_purchased} minuter/mån</p>
                  )}
                  <p className="text-xs">
                    Aktiverad: {new Date(product.purchased_at).toLocaleDateString('sv-SE')}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
