import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChartComponent } from "@/components/dashboard/charts/PieChartComponent";

interface UseCaseCost {
  useCase: string;
  cost: number;
  percentage: number;
}

interface UseCaseBreakdownProps {
  useCases: UseCaseCost[];
  isLoading?: boolean;
}

export const UseCaseBreakdown = ({ useCases, isLoading }: UseCaseBreakdownProps) => {
  const chartData = useCases.map(uc => ({
    name: uc.useCase,
    value: uc.cost
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fördelning per Användningsområde</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Laddar...</p>
          </div>
        ) : useCases.length > 0 ? (
          <PieChartComponent
            title=""
            data={chartData}
            height={340}
          />
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Ingen data tillgänglig</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
