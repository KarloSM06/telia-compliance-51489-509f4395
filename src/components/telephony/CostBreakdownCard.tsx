import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface CostBreakdownProps {
  event: any;
}

export function CostBreakdownCard({ event }: CostBreakdownProps) {
  const breakdown = event.cost_breakdown || {};
  const hasBreakdown = Object.keys(breakdown).length > 0;
  const totalCost = event.aggregate_cost_amount || event.cost_amount || 0;
  const currency = event.cost_currency || 'SEK';
  const SEK_TO_USD = 10.5;
  
  // Convert total to both currencies
  const totalInSEK = currency === 'USD' ? totalCost * SEK_TO_USD : totalCost;
  const totalInUSD = currency === 'SEK' ? totalCost / SEK_TO_USD : totalCost;
  
  // Helper to format cost: USD first, then SEK
  const formatCost = (amount: number, currency: string) => {
    const usdAmount = currency === 'SEK' ? amount / SEK_TO_USD : amount;
    const sekAmount = currency === 'USD' ? amount * SEK_TO_USD : amount;
    
    return `$${usdAmount.toFixed(4)} USD (≈ ${sekAmount.toFixed(2)} SEK)`;
  };
  
  // Map provider to display name and layer label
  const getProviderInfo = (provider: string, layer: string) => {
    const providerNames: Record<string, string> = {
      vapi: 'Vapi',
      retell: 'Retell',
      telnyx: 'Telnyx',
      twilio: 'Twilio',
    };
    
    const layerNames: Record<string, string> = {
      agent: 'AI Agent Layer',
      telephony: 'Telephony Layer',
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
              {totalInSEK.toFixed(2)} SEK (≈ ${totalInUSD.toFixed(4)} USD)
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
                    <div className="flex flex-col items-end">
                      <span className="font-mono text-xs">
                        {formatCost(data.amount, data.currency)}
                      </span>
                    </div>
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
