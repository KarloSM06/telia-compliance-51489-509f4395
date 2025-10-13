import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { availablePackages } from "./PackagesData";
import { Badge } from "@/components/ui/badge";

export function EmptyDashboard() {
  const navigate = useNavigate();
  
  const topPackages = availablePackages.slice(0, 3);

  const onboardingSteps = [
    { title: "Välj ditt första AI-paket", description: "Börja med det som passar ditt företag bäst", icon: ShoppingBag },
    { title: "Konfigurera inställningar", description: "Anpassa AI:n efter dina behov", icon: CheckCircle },
    { title: "Börja använda AI", description: "Se resultaten direkt i din dashboard", icon: Sparkles },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Onboarding Card */}
      <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-background border-2">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl">Välkommen till Hiems AI Platform!</CardTitle>
          <CardDescription className="text-base mt-3 max-w-2xl mx-auto">
            Kom igång på 3 enkla steg och börja automatisera ditt företag med AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Onboarding Steps */}
          <div className="grid md:grid-cols-3 gap-4">
            {onboardingSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div 
                  key={index}
                  className="flex flex-col items-center text-center p-4 rounded-lg bg-card border hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="outline" className="mb-2">Steg {index + 1}</Badge>
                  <h4 className="font-semibold mb-1">{step.title}</h4>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="text-center pt-4">
            <Button 
              onClick={() => navigate('/dashboard/packages')}
              size="lg"
              className="gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              Kom igång
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Product */}
      <Card className="border-2 border-primary/30 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-primary text-white">Rekommenderat för dig</Badge>
          </div>
          <CardTitle>Thor - AI Compliance & Coaching</CardTitle>
          <CardDescription>
            Vår mest populära produkt. Analysera samtal automatiskt och få AI-driven feedback för att förbättra kvaliteten.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => navigate('/dashboard/packages')}
            className="w-full gap-2"
          >
            Läs mer om Thor
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Top 3 Packages */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Utforska alla AI-paket</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {topPackages.map((pkg) => (
            <Card 
              key={pkg.id} 
              className="hover:shadow-lg transition-all cursor-pointer hover:border-primary/50" 
              onClick={() => navigate('/dashboard/packages')}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${pkg.color} flex items-center justify-center mb-3`}>
                  {pkg.icon}
                </div>
                <CardTitle className="text-lg">{pkg.name}</CardTitle>
                <CardDescription className="line-clamp-2">{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-2xl font-bold">{pkg.price}</p>
                  <Button variant="outline" className="w-full gap-2">
                    Läs mer
                    <ArrowRight className="h-4 w-4" />
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
