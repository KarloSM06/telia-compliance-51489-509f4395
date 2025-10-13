import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { availablePackages } from "./PackagesData";

export function EmptyDashboard() {
  const navigate = useNavigate();
  
  // Show top 3 most popular packages
  const topPackages = availablePackages.slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="border-2 border-dashed">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Välkommen till din Dashboard!</CardTitle>
          <CardDescription className="text-base mt-2">
            För att komma igång behöver du köpa minst ett AI-paket. 
            Välj det paket som passar dina behov bäst.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button 
            onClick={() => navigate('/dashboard-packages')}
            size="lg"
            className="gap-2"
          >
            <ShoppingBag className="h-5 w-5" />
            Utforska våra AI-paket
          </Button>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold mb-4">Populära paket</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {topPackages.map((pkg) => (
            <Card key={pkg.id} className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/dashboard-packages')}>
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${pkg.color} flex items-center justify-center mb-3`}>
                  {pkg.icon}
                </div>
                <CardTitle className="text-lg">{pkg.name}</CardTitle>
                <CardDescription className="line-clamp-2">{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">{pkg.price}</p>
                  <Button variant="outline" className="w-full">
                    Läs mer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
