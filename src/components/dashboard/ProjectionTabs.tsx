import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PremiumCard, PremiumCardContent, PremiumCardHeader, PremiumCardTitle } from "@/components/ui/premium-card";
import { ProjectionMetrics } from "@/lib/roiCalculations";
import { TrendingUp, DollarSign, Award, Target } from "lucide-react";
import { ROIProjectionTable } from "./ROIProjectionTable";
import { CumulativeROIChart } from "./CumulativeROIChart";

interface ProjectionTabsProps {
  projection12: ProjectionMetrics;
  projection24: ProjectionMetrics;
  projection36: ProjectionMetrics;
}

export function ProjectionTabs({ projection12, projection24, projection36 }: ProjectionTabsProps) {
  const renderProjectionContent = (projection: ProjectionMetrics) => (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <PremiumCard>
          <PremiumCardHeader>
            <PremiumCardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Total Intäkt
            </PremiumCardTitle>
          </PremiumCardHeader>
          <PremiumCardContent>
            <p className="text-2xl font-bold text-green-600">
              {projection.totalRevenue.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK
            </p>
          </PremiumCardContent>
        </PremiumCard>

        <PremiumCard>
          <PremiumCardHeader>
            <PremiumCardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Total Kostnad
            </PremiumCardTitle>
          </PremiumCardHeader>
          <PremiumCardContent>
            <p className="text-2xl font-bold text-red-600">
              {projection.totalCost.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK
            </p>
          </PremiumCardContent>
        </PremiumCard>

        <PremiumCard>
          <PremiumCardHeader>
            <PremiumCardTitle className="text-sm flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Nettovinst
            </PremiumCardTitle>
          </PremiumCardHeader>
          <PremiumCardContent>
            <p className={`text-2xl font-bold ${projection.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {projection.netProfit >= 0 ? '+' : ''}{projection.netProfit.toLocaleString('sv-SE', { maximumFractionDigits: 0 })} SEK
            </p>
          </PremiumCardContent>
        </PremiumCard>

        <PremiumCard>
          <PremiumCardHeader>
            <PremiumCardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              ROI
            </PremiumCardTitle>
          </PremiumCardHeader>
          <PremiumCardContent>
            <p className={`text-2xl font-bold ${projection.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {projection.roi.toFixed(1)}%
            </p>
          </PremiumCardContent>
        </PremiumCard>
      </div>

      {/* Cumulative Chart */}
      <CumulativeROIChart 
        data={projection.cumulativeData} 
        breakEvenMonth={projection.breakEvenMonth}
      />

      {/* Table */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Månadsvis Uppdelning</h3>
        <ROIProjectionTable 
          data={projection.cumulativeData} 
          breakEvenMonth={projection.breakEvenMonth}
        />
      </div>
    </div>
  );

  return (
    <Tabs defaultValue="12" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="12">12 Månader</TabsTrigger>
        <TabsTrigger value="24">24 Månader</TabsTrigger>
        <TabsTrigger value="36">36 Månader</TabsTrigger>
      </TabsList>
      
      <TabsContent value="12" className="mt-6">
        {renderProjectionContent(projection12)}
      </TabsContent>
      
      <TabsContent value="24" className="mt-6">
        {renderProjectionContent(projection24)}
      </TabsContent>
      
      <TabsContent value="36" className="mt-6">
        {renderProjectionContent(projection36)}
      </TabsContent>
    </Tabs>
  );
}
