import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, FileText, Settings, HelpCircle, BarChart3, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Köp mer paket",
      description: "Utöka dina AI-funktioner",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      onClick: () => navigate('/dashboard/packages'),
    },
    {
      title: "Visa rapport",
      description: "Se din månadsrapport",
      icon: BarChart3,
      color: "text-green-600",
      bgColor: "bg-green-100",
      onClick: () => navigate('/example-report'),
    },
    {
      title: "Ladda upp samtal",
      description: "Analysera nya samtal",
      icon: Upload,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      onClick: () => {
        // Scroll to upload section if on Thor dashboard
        const uploadSection = document.querySelector('[data-upload-section]');
        if (uploadSection) {
          uploadSection.scrollIntoView({ behavior: 'smooth' });
        }
      },
    },
    {
      title: "Inställningar",
      description: "Anpassa dina tjänster",
      icon: Settings,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      onClick: () => navigate('/gdpr-settings'),
    },
    {
      title: "Dokumentation",
      description: "Läs guider och FAQ",
      icon: FileText,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      onClick: () => window.open('https://docs.lovable.dev', '_blank'),
    },
    {
      title: "Support",
      description: "Få hjälp från oss",
      icon: HelpCircle,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
      onClick: () => navigate('/#contact'),
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
