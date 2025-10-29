import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface CostBreakdownProps {
  event: any;
}

export function CostBreakdownCard({ event }: CostBreakdownProps) {
  const breakdown = event.cost_breakdown || {};
  const hasBreakdown = Object.keys(breakdown).length > 0;
  const totalCost = event.aggregate_cost_amount || event.cost_amount || 0;
  const currency = event.cost_currency || 'USD';
  
  // Map provider to display name and layer label
  const getProviderInfo = (provider: string, layer: string) => {
    const providerNames: Record<string, string> = {
      vapi: 'Vapi',
      retell: 'Retell',
      telnyx: 'Telnyx',
      twilio: 'Twilio',
    };
    
    const layerNames: Record<string, string> = {
      agent: 'AI Agent',
      telephony: 'Telephony',
      standalone: 'Standalone',
    };
    
    return {
      name: providerNames[provider.toLowerCase()] || provider,
      layerLabel: layerNames[layer] || layer,
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <DollarSign className="h-5 w-5" />
          Kostnaduppdelning
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center font-semibold text-lg border-b pb-2">
            <span>Total kostnad</span>
            <span className="text-primary">
              {Number(totalCost).toFixed(4)} {currency}
            </span>
          </div>
          
          {hasBreakdown && (
            <div className="space-y-2 pt-2">
              {Object.entries(breakdown).map(([provider, data]: [string, any]) => {
                const info = getProviderInfo(provider, data.layer);
                return (
                  <div 
                    key={provider} 
                    className="flex justify-between items-center text-sm bg-muted/50 rounded-lg p-3"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{info.name}</span>
                      <span className="text-xs text-muted-foreground">{info.layerLabel}</span>
                    </div>
                    <span className="font-mono">
                      {Number(data.amount).toFixed(4)} {data.currency}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          
          {!hasBreakdown && (
            <p className="text-sm text-muted-foreground italic">
              Ingen kostnaduppdelning tillgänglig
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
