import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";

interface ConversionFunnelChartProps {
  metrics: {
    leads_generated: number;
    leads_contacted: number;
    calls_made: number;
    meetings_scheduled: number;
    meetings_held: number;
    deals_closed: number;
    lead_to_contact_rate: number;
    contact_to_call_rate: number;
    call_to_meeting_rate: number;
    meeting_to_deal_rate: number;
    overall_conversion_rate: number;
  };
}

export function ConversionFunnelChart({ metrics }: ConversionFunnelChartProps) {
  const stages = [
    { name: "Leads Genererade", count: metrics.leads_generated, rate: 100 },
    { name: "Leads Kontaktade", count: metrics.leads_contacted, rate: metrics.lead_to_contact_rate },
    { name: "Samtal Genomförda", count: metrics.calls_made, rate: metrics.contact_to_call_rate },
    { name: "Möten Bokade", count: metrics.meetings_scheduled, rate: metrics.call_to_meeting_rate },
    { name: "Möten Genomförda", count: metrics.meetings_held, rate: metrics.meeting_to_deal_rate },
    { name: "Affärer Slutna", count: metrics.deals_closed, rate: metrics.overall_conversion_rate }
  ];

  const maxCount = Math.max(...stages.map(s => s.count), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Konverteringstratt</CardTitle>
        <CardDescription>
          Följ hela kundresan från lead till affär
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {stages.map((stage, index) => {
          const width = (stage.count / maxCount) * 100;
          const prevRate = index > 0 ? stages[index - 1].rate : 100;
          const dropoff = prevRate - stage.rate;
          const isGoodRate = stage.rate >= 20;

          return (
            <div key={stage.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{stage.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {stage.count} ({stage.rate.toFixed(1)}%)
                  </span>
                  {index > 0 && (
                    <span className={`flex items-center text-xs ${dropoff > 50 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {dropoff > 50 ? (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      )}
                      -{dropoff.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="relative h-10 bg-muted rounded overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 flex items-center justify-center text-white font-medium ${
                    isGoodRate ? 'bg-primary' : 'bg-orange-500'
                  }`}
                  style={{ width: `${width}%` }}
                >
                  {stage.count > 0 && width > 15 && (
                    <span className="text-sm">{stage.count}</span>
                  )}
                </div>
              </div>
              {index < stages.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          );
        })}
        
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Konvertering</span>
            <span className={`text-lg font-bold ${
              metrics.overall_conversion_rate >= 5 ? 'text-primary' : 'text-orange-500'
            }`}>
              {metrics.overall_conversion_rate.toFixed(1)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
