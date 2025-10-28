import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Key, Smartphone, Activity, Database } from "lucide-react";
import { GDPRDashboard } from "@/components/GDPRDashboard";

export function SecuritySettings() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="hover-scale transition-all">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Key className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Autentisering</CardTitle>
              <CardDescription>
                Hantera lösenord och tvåfaktorsautentisering
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium">Lösenord</p>
              <p className="text-sm text-muted-foreground">
                Senast ändrat för 30 dagar sedan
              </p>
            </div>
            <Button variant="outline">Ändra Lösenord</Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Tvåfaktorsautentisering (2FA)</p>
                <p className="text-sm text-muted-foreground">
                  Status: ❌ Ej aktiverad
                </p>
              </div>
            </div>
            <Button variant="outline">Aktivera 2FA</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="hover-scale transition-all" style={{ animationDelay: '100ms' }}>
        <CardHeader className="animate-scale-in">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Aktiva Sessioner</CardTitle>
              <CardDescription>
                Enheter som är inloggade på ditt konto
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5">
            <div>
              <p className="font-medium">🖥️ Chrome på Windows</p>
              <p className="text-sm text-muted-foreground">
                Stockholm, Sverige · Aktiv nu
              </p>
            </div>
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
              Nuvarande session
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="hover-scale transition-all" style={{ animationDelay: '200ms' }}>
        <CardHeader className="animate-scale-in">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Dataskydd & GDPR</CardTitle>
              <CardDescription>
                Hantera dina data och integritetsinställningar
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p className="mb-4">GDPR-inställningar kommer att integreras här</p>
            <p className="text-sm">
              För tillfället, besök{" "}
              <a href="/gdpr" className="text-primary hover:underline">
                GDPR-sidan
              </a>{" "}
              för att hantera dina data.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
