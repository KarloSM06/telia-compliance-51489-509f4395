import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingUp, Package } from "lucide-react";
import { AdminBadge } from "./AdminBadge";

interface DashboardHeroProps {
  userName?: string;
  activeProducts: number;
  availableProducts: number;
  isAdmin?: boolean;
}

export function DashboardHero({ 
  userName, 
  activeProducts, 
  availableProducts,
  isAdmin 
}: DashboardHeroProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "God morgon";
    if (hour < 18) return "God dag";
    return "God kväll";
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 via-accent/5 to-background border-2">
      <CardContent className="p-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {getGreeting()}{userName && `, ${userName}`}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Din AI-assisterade översikt
              </p>
            </div>
          </div>
          {isAdmin && <AdminBadge />}
        </div>

        <div className="flex flex-wrap gap-6 mt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Package className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeProducts}</p>
              <p className="text-sm text-muted-foreground">Aktiva produkter</p>
            </div>
          </div>

          {availableProducts > 0 && (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <TrendingUp className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{availableProducts}</p>
                <p className="text-sm text-muted-foreground">Nya möjligheter</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
