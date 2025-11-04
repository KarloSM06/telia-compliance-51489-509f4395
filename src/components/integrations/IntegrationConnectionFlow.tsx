import { Link } from "react-router-dom";
import { Plug, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PremiumCard } from "@/components/ui/premium-card";

export const IntegrationConnectionFlow = () => {
  return (
    <PremiumCard className="p-8">
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Plug className="h-8 w-8 text-primary" />
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-2">Anslut dina tjänster</h3>
          <p className="text-muted-foreground">
            Integrera med telefoni, kalender och andra tjänster i tre enkla steg
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              1
            </div>
            <span>Välj tjänst</span>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              2
            </div>
            <span>Koppla</span>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              3
            </div>
            <span>Klar!</span>
          </div>
        </div>

        <Button asChild size="lg" className="mt-4">
          <Link to="/dashboard/settings?tab=integrationer">
            Kom igång med Integrationer
          </Link>
        </Button>
      </div>
    </PremiumCard>
  );
};
