import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Settings, Calendar, MessageSquare, Star, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Boka möte",
      description: "Skapa ny kalenderhändelse",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      onClick: () => navigate('/dashboard/calendar'),
    },
    {
      title: "Skicka meddelande",
      description: "Snabbmeddelande till kund",
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-100",
      onClick: () => navigate('/dashboard/templates'),
    },
    {
      title: "Visa recensioner",
      description: "Analysera kundrecensioner",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      onClick: () => navigate('/dashboard/reviews'),
    },
    {
      title: "Köp mer paket",
      description: "Utöka dina AI-funktioner",
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      onClick: () => navigate('/dashboard/packages'),
    },
    {
      title: "Visa rapport",
      description: "Se din månadsrapport",
      icon: BarChart3,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      onClick: () => navigate('/dashboard/analytics'),
    },
    {
      title: "Inställningar",
      description: "Anpassa dina tjänster",
      icon: Settings,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      onClick: () => navigate('/dashboard/settings'),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Snabbåtgärder</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2 hover:shadow-md transition-all group"
              onClick={action.onClick}
            >
              <div className={`p-2 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform`}>
                <action.icon className={`h-5 w-5 ${action.color}`} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
