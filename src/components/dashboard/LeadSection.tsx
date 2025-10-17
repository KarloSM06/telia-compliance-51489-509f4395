import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Phone, Mail, TrendingUp, Settings } from "lucide-react";

export function LeadSection() {
  const statCards = [
    {
      title: "Leads",
      value: 0,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Kontaktade",
      value: 0,
      icon: Phone,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Email kampanjer",
      value: 0,
      icon: Mail,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Konverteringar",
      value: 0,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Prospektering (Lead)</h2>
          <p className="text-muted-foreground">Hantera leads och försäljning med AI</p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Inställningar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Senaste leads</CardTitle>
          <CardDescription>Översikt av dina prospekteringsaktiviteter</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Inga leads att visa än</p>
            <p className="text-sm mt-2">Prospekteringsdata kommer att visas här när den blir tillgänglig</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}