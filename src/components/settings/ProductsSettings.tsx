import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { useUserProducts } from "@/hooks/useUserProducts";
import { availablePackages } from "@/components/dashboard/PackagesData";

export function ProductsSettings() {
  const { productDetails, loading } = useUserProducts();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="hover-scale transition-all">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Mina Produkter</CardTitle>
              <CardDescription>
                Översikt över dina aktiva produkter och prenumerationer
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {productDetails.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">Inga aktiva produkter</p>
              <p className="text-sm text-muted-foreground">
                Besök Dashboard för att utforska våra produkter
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {productDetails.map((product) => {
                const packageInfo = availablePackages.find(
                  (pkg) => pkg.id === product.product_id
                );

                return (
                  <div
                    key={product.id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-all hover-scale animate-scale-in"
                    style={{ animationDelay: `${productDetails.indexOf(product) * 50}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        {packageInfo?.icon && (
                          <div className="h-6 w-6 text-primary">
                            {packageInfo.icon}
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {packageInfo?.name || product.product_id}
                          </h3>
                          {product.status === "active" ? (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Aktiv
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="gap-1">
                              <XCircle className="h-3 w-3" />
                              Inaktiv
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {packageInfo?.description || "Produktbeskrivning"}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Köpt:{" "}
                            {new Date(product.purchased_at).toLocaleDateString(
                              "sv-SE"
                            )}
                          </div>
                          {product.tier && (
                            <Badge variant="outline" className="text-xs">
                              {product.tier}
                            </Badge>
                          )}
                          {product.minutes_purchased && (
                            <span className="text-xs text-muted-foreground">
                              {product.minutes_purchased} minuter
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
