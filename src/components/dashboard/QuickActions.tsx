import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, FileText, Settings, HelpCircle, BarChart3, Upload, Calendar, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserProducts } from "@/hooks/useUserProducts";

export function QuickActions() {
  const navigate = useNavigate();
  const { products } = useUserProducts();

  const hasThor = products.includes('thor');
  const hasKrono = products.includes('krono');
  const hasGastro = products.includes('gastro');
  const hasTalent = products.includes('talent');

  // Dynamic actions based on products
  const actions = [
    // Analytics - always show
    {
      title: "Analytics Dashboard",
      description: "Detaljerad analys av all data",
      icon: BarChart3,
      color: "text-primary",
      bgColor: "bg-primary/10",
      onClick: () => navigate('/dashboard/analytics'),
      priority: 1,
    },
    // Custom Dashboard - always show
    {
      title: "Custom Dashboard",
      description: "Skapa din egen dashboard",
      icon: Sparkles,
      color: "text-accent",
      bgColor: "bg-accent/10",
      onClick: () => navigate('/dashboard/custom'),
      priority: 2,
    },
    // Thor - upload calls
    ...(hasThor ? [{
      title: "Ladda upp samtal",
      description: "Analysera nya samtal med AI",
      icon: Upload,
      color: "text-success",
      bgColor: "bg-success/10",
      onClick: () => {
        const uploadSection = document.querySelector('[data-upload-section]');
        if (uploadSection) {
          uploadSection.scrollIntoView({ behavior: 'smooth' });
        }
      },
      priority: 3,
    }] : []),
    // Krono/Gastro - view bookings
    ...(hasKrono || hasGastro ? [{
      title: "Kommande bokningar",
      description: "Se alla dina bokningar",
      icon: Calendar,
      color: "text-warning",
      bgColor: "bg-warning/10",
      onClick: () => navigate('/dashboard'),
      priority: 4,
    }] : []),
    // If missing products - recommend
    ...(!hasThor && !hasTalent ? [{
      title: "Upptäck Thor AI",
      description: "Vår mest populära produkt",
      icon: ShoppingCart,
      color: "text-[hsl(142,76%,36%)]",
      bgColor: "bg-[hsl(142,76%,36%)]/10",
      onClick: () => navigate('/dashboard/packages'),
      priority: 5,
      isRecommended: true,
    }] : []),
    // Settings
    {
      title: "Inställningar",
      description: "Anpassa dina tjänster",
      icon: Settings,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
      onClick: () => navigate('/gdpr-settings'),
      priority: 6,
    },
    // Support
    {
      title: "Support",
      description: "Få hjälp från oss",
      icon: HelpCircle,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
      onClick: () => navigate('/#contact'),
      priority: 7,
    },
  ].sort((a, b) => a.priority - b.priority);

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
              className={`h-auto p-4 flex flex-col items-start gap-2 hover:shadow-md transition-all group ${
                action.isRecommended ? 'border-2 border-warning/50 bg-warning/5' : ''
              }`}
              onClick={action.onClick}
            >
              <div className={`p-2 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform`}>
                <action.icon className={`h-5 w-5 ${action.color}`} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm flex items-center gap-2">
                  {action.title}
                  {action.isRecommended && <span className="text-xs text-warning">⭐</span>}
                </p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
