import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Headphones, ChefHat, UserCheck, TrendingUp, MessageSquare, Lock, ArrowRight } from "lucide-react";
import { useUserProducts } from "@/hooks/useUserProducts";
import { useNavigate } from "react-router-dom";
import { AdminBadge } from "./AdminBadge";
import { ProductStatusBadge } from "./ProductStatusBadge";

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
  const { productDetails, loading, isAdmin, products } = useUserProducts();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // All available products
  const allProducts = [
    { id: 'krono', name: 'AI Receptionist', description: 'Automatisk telefonist som svarar samtal och bokar möten 24/7', price: 'från 1 499 kr/mån' },
    { id: 'gastro', name: 'Restaurang & Café', description: 'Specialiserad AI för restauranger med bordsbokning och kundtjänst', price: 'från 1 799 kr/mån' },
    { id: 'thor', name: 'AI Compliance & Coaching', description: 'Analysera och förbättra samtalen med AI-driven feedback', price: 'från 999 kr/mån' },
    { id: 'talent', name: 'AI Rekrytering', description: 'Automatisera rekryteringsprocessen och hitta rätt talanger', price: 'från 2 499 kr/mån' },
    { id: 'lead', name: 'AI Prospektering', description: 'Generera och kvalificera leads automatiskt', price: 'från 1 999 kr/mån' },
  ];

  const ownedProducts = productDetails;
  const availableProducts = allProducts.filter(p => !products.includes(p.id));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Din Produktportfölj</h2>
          {isAdmin && <AdminBadge />}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Products */}
        {ownedProducts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Dina Aktiva AI-Produkter ({ownedProducts.length})
              </h3>
            </div>
            <div className="space-y-3">
              {ownedProducts.map((product) => {
                const Icon = productIcons[product.product_id] || Headphones;
                const productName = productNames[product.product_id] || product.product_id;

                return (
                  <Card key={product.id} className="hover:shadow-lg transition-all group border-success/20">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-success/10 group-hover:bg-success/20 transition-colors">
                            <Icon className="h-5 w-5 text-success" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{productName}</CardTitle>
                            <Badge variant="secondary" className="capitalize mt-1">
                              {product.tier || "Pro"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <ProductStatusBadge status="active" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        {product.minutes_purchased && (
                          <p className="text-muted-foreground">
                            📞 {product.minutes_purchased} minuter/mån
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Aktiverad: {new Date(product.purchased_at).toLocaleDateString('sv-SE')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Available Products */}
        {availableProducts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Utforska Fler ({availableProducts.length})
              </h3>
            </div>
            <div className="space-y-3">
              {availableProducts.map((product) => {
                const Icon = productIcons[product.id] || Headphones;

                return (
                  <Card key={product.id} className="hover:shadow-lg transition-all group border-muted">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted group-hover:bg-muted/80 transition-colors">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{product.name}</CardTitle>
                          </div>
                        </div>
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <ProductStatusBadge status="locked" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-bold">{product.price}</p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="gap-2"
                            onClick={() => navigate('/dashboard/packages')}
                          >
                            Läs mer
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
