import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChartComponent } from "./charts/PieChartComponent";
import { formatCurrency } from "@/lib/utils";

interface ServiceMetrics {
  serviceName: string;
  revenue: number;
  cost: number;
  profit: number;
  roi: number;
  bookingCount: number;
}

interface ServiceROIBreakdownProps {
  services: ServiceMetrics[];
}

export function ServiceROIBreakdown({ services }: ServiceROIBreakdownProps) {
  const totalRevenue = services.reduce((sum, s) => sum + s.revenue, 0);
  
  const pieData = services.map(service => ({
    name: service.serviceName,
    value: service.revenue,
    fill: `hsl(${Math.random() * 360}, 70%, 50%)`
  }));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Intäkter per Tjänst</CardTitle>
          <CardDescription>
            Fördelning av intäkter över olika tjänster
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PieChartComponent
            title="Intäktsfördelning"
            data={pieData}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tjänstespecifik ROI</CardTitle>
          <CardDescription>
            Lönsamhet per tjänstekategori
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service, index) => {
              const revenueShare = (service.revenue / totalRevenue) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{service.serviceName}</span>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{service.bookingCount} bokningar</span>
                      <span className={`font-bold ${service.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {service.roi.toFixed(0)}% ROI
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-muted p-2 rounded">
                      <div className="text-muted-foreground">Intäkt</div>
                      <div className="font-medium">{formatCurrency(service.revenue)}</div>
                    </div>
                    <div className="bg-muted p-2 rounded">
                      <div className="text-muted-foreground">Kostnad</div>
                      <div className="font-medium">{formatCurrency(service.cost)}</div>
                    </div>
                    <div className="bg-muted p-2 rounded">
                      <div className="text-muted-foreground">Vinst</div>
                      <div className={`font-medium ${service.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(service.profit)}
                      </div>
                    </div>
                  </div>

                  <div className="relative h-2 bg-muted rounded overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${revenueShare}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    {revenueShare.toFixed(1)}% av total intäkt
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
