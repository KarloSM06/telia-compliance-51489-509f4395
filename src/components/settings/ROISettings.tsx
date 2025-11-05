import { useState } from "react";
import { PremiumCard, PremiumCardContent, PremiumCardDescription, PremiumCardHeader, PremiumCardTitle } from "@/components/ui/premium-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Upload, FileText, DollarSign, Package, Save, Server, Brain, Sparkles, ExternalLink } from "lucide-react";
import { useBusinessMetrics, ServicePricing } from "@/hooks/useBusinessMetrics";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export function ROISettings() {
  const { metrics, updateMetrics, isLoading } = useBusinessMetrics();
  
  const [annualRevenue, setAnnualRevenue] = useState(metrics?.annual_revenue || 0);
  const [avgProjectCost, setAvgProjectCost] = useState(metrics?.avg_project_cost || 0);
  const [meetingProbability, setMeetingProbability] = useState(
    metrics?.meeting_to_payment_probability || 50
  );
  const [hiemsSupportCost, setHiemsSupportCost] = useState(
    metrics?.hiems_monthly_support_cost || 0
  );
  const [integrationCost, setIntegrationCost] = useState(
    metrics?.integration_cost || 0
  );
  const [integrationStartDate, setIntegrationStartDate] = useState(
    metrics?.integration_start_date || ""
  );
  const [services, setServices] = useState<ServicePricing[]>(
    metrics?.service_pricing || []
  );

  const handleSave = () => {
    updateMetrics({
      annual_revenue: annualRevenue,
      avg_project_cost: avgProjectCost,
      meeting_to_payment_probability: meetingProbability,
      service_pricing: services,
      hiems_monthly_support_cost: hiemsSupportCost,
      integration_cost: integrationCost,
      integration_start_date: integrationStartDate || null,
    });
  };

  const addService = () => {
    setServices([
      ...services,
      {
        service_name: "",
        avg_price: 0,
        min_price: 0,
        max_price: 0,
      },
    ]);
  };

  const updateService = (index: number, field: keyof ServicePricing, value: any) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Conversion Rate - Primary Setting */}
      <PremiumCard className="animate-scale-in border-primary/50">
        <PremiumCardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <PremiumCardTitle>Konverteringsgrad</PremiumCardTitle>
              <PremiumCardDescription>
                Hur stor andel av bokade möten blir betalande kunder?
              </PremiumCardDescription>
            </div>
          </div>
        </PremiumCardHeader>
        <PremiumCardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">
                Möte → Betalning
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-primary">
                  {meetingProbability}%
                </span>
              </div>
            </div>
            
            <Slider
              value={[meetingProbability]}
              onValueChange={(value) => setMeetingProbability(value[0])}
              max={100}
              step={5}
              className="w-full"
            />
            
            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
              <div className="text-left">0%</div>
              <div className="text-center">50%</div>
              <div className="text-right">100%</div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">💡 Vad betyder detta?</p>
            <p className="text-xs text-muted-foreground">
              Detta påverkar direkt hur ROI beräknas från dina bokningar. 
              Om du har {meetingProbability}% konvertering betyder det att av 100 bokade möten 
              blir {meetingProbability} betalande kunder.
            </p>
          </div>
        </PremiumCardContent>
      </PremiumCard>

      {/* Business Information */}
      <PremiumCard className="animate-scale-in" style={{ animationDelay: '50ms' }}>
        <PremiumCardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <PremiumCardTitle>Affärsinformation</PremiumCardTitle>
              <PremiumCardDescription>
                Ange din verksamhets ekonomiska data för ROI-beräkningar
              </PremiumCardDescription>
            </div>
          </div>
        </PremiumCardHeader>
        <PremiumCardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="annual-revenue">Förra årets omsättning (SEK)</Label>
              <Input
                id="annual-revenue"
                type="number"
                value={annualRevenue || ""}
                onChange={(e) => setAnnualRevenue(parseFloat(e.target.value) || 0)}
                placeholder="1500000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avg-cost">Genomsnittlig projektkostnad (SEK)</Label>
              <Input
                id="avg-cost"
                type="number"
                value={avgProjectCost || ""}
                onChange={(e) => setAvgProjectCost(parseFloat(e.target.value) || 0)}
                placeholder="25000"
              />
            </div>
          </div>
        </PremiumCardContent>
      </PremiumCard>

      {/* Hiems Platform Costs */}
      <PremiumCard className="animate-scale-in" style={{ animationDelay: '50ms' }}>
        <PremiumCardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Server className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <PremiumCardTitle>Hiems Plattformskostnader</PremiumCardTitle>
              <PremiumCardDescription>
                Ange fasta månadskostnader för Hiems-plattformen och integrationer
              </PremiumCardDescription>
            </div>
          </div>
        </PremiumCardHeader>
        <PremiumCardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="hiems-support">Hiems Månadskostnad (SEK)</Label>
              <Input
                id="hiems-support"
                type="number"
                value={hiemsSupportCost || ""}
                onChange={(e) => setHiemsSupportCost(parseFloat(e.target.value) || 0)}
                placeholder="4000"
              />
              <p className="text-xs text-muted-foreground">
                Din månatliga kostnad för Hiems plattformen
              </p>
            </div>

            <div>
              <Label htmlFor="integration-cost">Integrationskostnad (SEK)</Label>
              <Input
                id="integration-cost"
                type="number"
                value={integrationCost || ""}
                onChange={(e) => setIntegrationCost(parseFloat(e.target.value) || 0)}
                placeholder="15000"
              />
              <p className="text-xs text-muted-foreground mt-1">
                <strong>Engångsbetalning</strong> för initial integration och uppsättning
              </p>
            </div>

            <div>
              <Label htmlFor="integration-date">Datum för Integrationskostnad</Label>
              <Input
                id="integration-date"
                type="date"
                value={integrationStartDate}
                onChange={(e) => setIntegrationStartDate(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                När betalades startkostnaden? (används för ROI-beräkningar)
              </p>
            </div>
          </div>
          
          <div className="border-l-4 border-primary/50 bg-primary/5 p-4 rounded-r-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Tips:</strong> Hiems Plattform är en månadskostnad som prorateras baserat på vald period. 
              Integrationskostnaden är en engångsbetalning som endast visas om perioden inkluderar startdatumet.
            </p>
          </div>
        </PremiumCardContent>
      </PremiumCard>

      {/* OpenRouter Information */}
      <PremiumCard className="animate-scale-in" style={{ animationDelay: '75ms' }}>
        <PremiumCardHeader>
          <PremiumCardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            OpenRouter AI-kostnader
          </PremiumCardTitle>
        </PremiumCardHeader>
        <PremiumCardContent className="space-y-3">
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              <strong>Automatisk kostnadsspårning</strong>
              <p className="text-sm mt-1 text-muted-foreground">
                OpenRouter-kostnader spåras automatiskt via <code className="px-1 py-0.5 bg-muted rounded text-xs">ai_usage_logs</code> och 
                inkluderas i alla ROI-beräkningar. Kostnader synkas dagligen via edge functions.
              </p>
            </AlertDescription>
          </Alert>

          <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-950 rounded">
            <span className="text-sm font-medium">Spårad automatiskt i ROI</span>
            <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
              ✓ Inkluderad
            </Badge>
          </div>

          <Button 
            variant="outline" 
            className="w-full"
            asChild
          >
            <Link to="/dashboard/openrouter">
              <ExternalLink className="h-4 w-4 mr-2" />
              Se fullständig OpenRouter Dashboard
            </Link>
          </Button>
        </PremiumCardContent>
      </PremiumCard>

      <PremiumCard className="animate-scale-in" style={{ animationDelay: '100ms' }}>
        <PremiumCardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <PremiumCardTitle>Tjänstepriser</PremiumCardTitle>
              <PremiumCardDescription>
                Definiera priser för dina olika tjänster. AI kommer använda detta för att estimera intäkter från bokningar.
              </PremiumCardDescription>
            </div>
          </div>
        </PremiumCardHeader>
        <PremiumCardContent>
          <div className="space-y-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="grid gap-4 md:grid-cols-5 items-end border p-4 rounded-lg"
              >
                <div className="space-y-2">
                  <Label>Tjänst</Label>
                  <Input
                    value={service.service_name}
                    onChange={(e) => updateService(index, "service_name", e.target.value)}
                    placeholder="T.ex. Konsultation"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Min-pris (SEK)</Label>
                  <Input
                    type="number"
                    value={service.min_price || ""}
                    onChange={(e) =>
                      updateService(index, "min_price", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Genomsnitt (SEK)</Label>
                  <Input
                    type="number"
                    value={service.avg_price || ""}
                    onChange={(e) =>
                      updateService(index, "avg_price", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max-pris (SEK)</Label>
                  <Input
                    type="number"
                    value={service.max_price || ""}
                    onChange={(e) =>
                      updateService(index, "max_price", parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeService(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addService}>
              <Plus className="h-4 w-4 mr-2" />
              Lägg till tjänst
            </Button>
          </div>
        </PremiumCardContent>
      </PremiumCard>

      <PremiumCard className="animate-scale-in" style={{ animationDelay: '200ms' }}>
        <PremiumCardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            <div>
              <PremiumCardTitle>Historiska Dokument</PremiumCardTitle>
              <PremiumCardDescription>
                Ladda upp tidigare offerter och fakturor för mer exakt AI-analys (kommer snart)
              </PremiumCardDescription>
            </div>
          </div>
        </PremiumCardHeader>
        <PremiumCardContent>
          <Tabs defaultValue="quotes">
            <TabsList>
              <TabsTrigger value="quotes">Offerter</TabsTrigger>
              <TabsTrigger value="invoices">Fakturor</TabsTrigger>
            </TabsList>
            <TabsContent value="quotes" className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/30">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Dokumentuppladdning kommer i nästa version
                </p>
                <Button variant="outline" size="sm" disabled>
                  Välj filer
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="invoices">
              <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/30">
                <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Dokumentuppladdning kommer i nästa version
                </p>
                <Button variant="outline" size="sm" disabled>
                  Välj filer
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </PremiumCardContent>
      </PremiumCard>

      <div className="flex justify-end animate-fade-in" style={{ animationDelay: '300ms' }}>
        <Button onClick={handleSave} disabled={isLoading} size="lg">
          <Save className="h-4 w-4 mr-2" />
          Spara ROI-inställningar
        </Button>
      </div>
    </div>
  );
}
