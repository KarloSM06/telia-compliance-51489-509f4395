import { DollarSign, Info } from "lucide-react";
import { PremiumCard, PremiumCardContent, PremiumCardHeader, PremiumCardTitle } from "@/components/ui/premium-card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { OperationalCosts } from "@/lib/roiCalculations";
import { BusinessMetrics } from "@/hooks/useBusinessMetrics";
import { formatCostInSEK } from "@/lib/telephonyFormatters";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface CostBreakdownEnhancedProps {
  costs: OperationalCosts;
  businessMetrics: BusinessMetrics;
}

export function CostBreakdownEnhanced({ costs, businessMetrics }: CostBreakdownEnhancedProps) {
  const {
    telephonyCost,
    smsCost,
    emailCost,
    hiemsSupportCost,
    integrationCost,
    totalRecurringCost,
    isIntegrationCostIncluded
  } = costs;

  const integrationStartDate = businessMetrics.integration_start_date 
    ? new Date(businessMetrics.integration_start_date)
    : null;

  return (
    <PremiumCard>
      <PremiumCardHeader>
        <PremiumCardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Kostnadsfördelning
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Fasta månadskostnader prorateras baserat på vald period. 
                  Engångskostnader visas endast om perioden inkluderar betalningsdatumet.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </PremiumCardTitle>
      </PremiumCardHeader>
      <PremiumCardContent className="space-y-4">
        {/* One-time costs section */}
        {integrationCost > 0 && (
          <>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Engångskostnader</span>
                {isIntegrationCostIncluded && (
                  <Badge variant="outline" className="text-xs">
                    Inkluderad i denna period
                  </Badge>
                )}
              </div>
              <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Integration</span>
                    {integrationStartDate && (
                      <span className="text-xs text-muted-foreground">
                        Betald: {format(integrationStartDate, 'd MMM yyyy', { locale: sv })}
                      </span>
                    )}
                  </div>
                  <span className="font-semibold">{formatCostInSEK(businessMetrics.integration_cost || 0)}</span>
                </div>
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Recurring costs section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Månadskostnader</span>
            <Badge variant="secondary" className="text-xs">
              Återkommande
            </Badge>
          </div>
          <div className="space-y-2 pl-4 border-l-2 border-green-500/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Hiems Plattform</span>
              <span className="font-semibold">{formatCostInSEK(hiemsSupportCost)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Telefoni</span>
              <span className="font-semibold">{formatCostInSEK(telephonyCost)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">SMS</span>
              <span className="font-semibold">{formatCostInSEK(smsCost)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="font-semibold">{formatCostInSEK(emailCost)}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Återkommande månadskostnad</span>
            <span className="font-semibold">{formatCostInSEK(totalRecurringCost)}</span>
          </div>
          {isIntegrationCostIncluded && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">+ Engångskostnad</span>
              <span className="font-semibold">{formatCostInSEK(integrationCost)}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="font-semibold">Total kostnad (denna period)</span>
            <span className="text-xl font-bold">{formatCostInSEK(costs.totalCost)}</span>
          </div>
        </div>
      </PremiumCardContent>
    </PremiumCard>
  );
}